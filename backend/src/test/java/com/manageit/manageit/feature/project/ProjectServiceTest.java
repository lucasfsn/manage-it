package com.manageit.manageit.feature.project;

import com.manageit.manageit.feature.project.service.ProjectServiceDefault;
import com.manageit.manageit.feature.project.dto.CreateProjectRequestDto;
import com.manageit.manageit.feature.project.dto.ProjectResponseDto;
import com.manageit.manageit.feature.project.dto.UpdateProjectRequestDto;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.project.model.ProjectStatus;
import com.manageit.manageit.core.exception.ProjectModificationNotAllowedException;
import com.manageit.manageit.core.exception.UserAlreadyInProjectException;
import com.manageit.manageit.core.exception.UserNotInProjectException;
import com.manageit.manageit.feature.project.mapper.ProjectMapper;
import com.manageit.manageit.feature.project.repository.ProjectRepository;
import com.manageit.manageit.feature.task.repository.TaskRepository;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.service.UserService;
import com.manageit.manageit.feature.notification.service.NotificationService;
import com.manageit.manageit.feature.chat.service.ChatService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMapper projectMapper;

    @Mock
    private NotificationService notificationService;

    @Mock
    private UserService userService;

    @Mock
    private ChatService chatService;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private EntityManager entityManager;

    private ProjectServiceDefault projectService;

    private User testUser;
    private User testOwner;
    private Project testProject;
    private UUID testProjectId;

    @BeforeEach
    void setUp() {
        projectService = new ProjectServiceDefault(
                projectRepository,
                projectMapper,
                notificationService,
                userService,
                chatService,
                taskRepository
        );

        // Użyj refleksji aby ustawić EntityManager (bo to @PersistenceContext)
        try {
            var field = ProjectServiceDefault.class.getDeclaredField("entityManager");
            field.setAccessible(true);
            field.set(projectService, entityManager);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        testProjectId = UUID.randomUUID();
        testUser = createTestUser("testuser", UUID.randomUUID());
        testOwner = createTestUser("owner", UUID.randomUUID());
        testProject = createTestProject();
    }

    private User createTestUser(String name, UUID id) {
        User user = new User();
        user.setId(id);
        user.setUsername(name);
        return user;
    }

    private Project createTestProject() {
        return Project.builder()
                .id(testProjectId)
                .name("Test Project")
                .description("Test Description")
                .status(ProjectStatus.IN_PROGRESS)
                .owner(testOwner)
                .members(new ArrayList<>(List.of(testOwner)))
                .tasks(new ArrayList<>())
                .endDate(LocalDate.now().plusDays(30))
                .build();
    }

    @Test
    void shouldGetProjectById_WhenProjectExists() {
        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));

        Project result = projectService.getProjectById(testProjectId);

        assertEquals(testProject, result);
        verify(projectRepository).findById(testProjectId);
    }

    @Test
    void shouldThrowEntityNotFoundException_WhenProjectNotFound() {
        when(projectRepository.findById(testProjectId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> projectService.getProjectById(testProjectId)
        );

        assertEquals("No project found with id: " + testProjectId, exception.getMessage());
    }

    @Test
    void shouldGetProjects_WhenUserHasProjects() {
        List<Project> projects = List.of(testProject);
        ProjectResponseDto responseDto = new ProjectResponseDto();

        when(projectRepository.findByMembers_Username(testUser.getName()))
                .thenReturn(Optional.of(projects));
        when(projectMapper.toProjectResponseDto(testProject)).thenReturn(responseDto);

        List<ProjectResponseDto> result = projectService.getProjects(testUser);

        assertEquals(1, result.size());
        assertEquals(responseDto, result.get(0));
        verify(projectRepository).findByMembers_Username(testUser.getName());
        verify(projectMapper).toProjectResponseDto(testProject);
    }

    @Test
    void shouldThrowEntityNotFoundException_WhenUserHasNoProjects() {
        when(projectRepository.findByMembers_Username(testUser.getName()))
                .thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> projectService.getProjects(testUser)
        );

        assertEquals("No projects found", exception.getMessage());
    }

    @Test
    void shouldGetProject_WhenUserIsMember() {
        testProject.getMembers().add(testUser);
        ProjectResponseDto responseDto = new ProjectResponseDto();

        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));
        when(projectMapper.toProjectResponseDto(testProject)).thenReturn(responseDto);

        ProjectResponseDto result = projectService.getProject(testProjectId, testUser);

        assertEquals(responseDto, result);
        verify(projectMapper).toProjectResponseDto(testProject);
    }

    @Test
    void shouldThrowUserNotInProjectException_WhenUserNotMember() {
        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> projectService.getProject(testProjectId, testUser)
        );

        assertEquals("User " + testUser.getName() + " is not member of project", exception.getMessage());
    }

    @Test
    void shouldCreateProject_Successfully() {
        CreateProjectRequestDto request = new CreateProjectRequestDto();
        request.setName("New Project");
        request.setDescription("New Description");
        request.setEndDate(LocalDate.now().plusDays(30));

        Project savedProject = createTestProject();
        ProjectResponseDto responseDto = new ProjectResponseDto();

        when(entityManager.merge(testOwner)).thenReturn(testOwner);
        when(projectRepository.save(any(Project.class))).thenReturn(savedProject);
        when(projectMapper.toProjectResponseDto(savedProject)).thenReturn(responseDto);

        ProjectResponseDto result = projectService.createProject(testOwner, request);

        assertEquals(responseDto, result);
        verify(entityManager).merge(testOwner);
        verify(projectRepository).save(any(Project.class));
        verify(chatService).saveChat(savedProject);
        verify(projectMapper).toProjectResponseDto(savedProject);
    }

    @Test
    void shouldDeleteProject_WhenUserIsOwner() {
        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));

        projectService.deleteProject(testOwner, testProjectId);

        verify(taskRepository).deleteAll(testProject.getTasks());
        verify(projectRepository).delete(testProject);
    }

    @Test
    void shouldThrowUserNotInProjectException_WhenUserNotOwnerOnDelete() {
        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> projectService.deleteProject(testUser, testProjectId)
        );

        assertEquals("User is not the owner of the project", exception.getMessage());
    }

    @Test
    void shouldUpdateProjectName_Successfully() {
        UpdateProjectRequestDto request = new UpdateProjectRequestDto();
        request.setName("Updated Name");

        ProjectResponseDto responseDto = new ProjectResponseDto();

        when(entityManager.merge(testOwner)).thenReturn(testOwner);
        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(testProject)).thenReturn(testProject);
        when(projectMapper.toProjectResponseDto(testProject)).thenReturn(responseDto);

        ProjectResponseDto result = projectService.updateProject(testOwner, testProjectId, request);

        assertEquals(responseDto, result);
        assertEquals("Updated Name", testProject.getName());
    }

    @Test
    void shouldUpdateProjectStatus_ToCompleted() {
        UpdateProjectRequestDto request = new UpdateProjectRequestDto();
        request.setStatus(ProjectStatus.COMPLETED);

        ProjectResponseDto responseDto = new ProjectResponseDto();

        when(entityManager.merge(testOwner)).thenReturn(testOwner);
        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(testProject)).thenReturn(testProject);
        when(projectMapper.toProjectResponseDto(testProject)).thenReturn(responseDto);

        ProjectResponseDto result = projectService.updateProject(testOwner, testProjectId, request);

        assertEquals(responseDto, result);
        assertEquals(ProjectStatus.COMPLETED, testProject.getStatus());
        verify(notificationService).createAndSendNotification(
                eq(testProject.getMembers()),
                eq(testOwner),
                eq("project;complete;" + testProject.getName()),
                eq(testProject.getId()),
                isNull()
        );
    }

    @Test
    void shouldThrowException_WhenUpdatingCompletedProject() {
        testProject.setStatus(ProjectStatus.COMPLETED);
        UpdateProjectRequestDto request = new UpdateProjectRequestDto();
        request.setName("Updated Name");

        when(entityManager.merge(testOwner)).thenReturn(testOwner);
        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> projectService.updateProject(testOwner, testProjectId, request)
        );

        assertEquals("Cannot modify a completed project.", exception.getMessage());
    }

    @Test
    void shouldAddUserToProject_Successfully() {
        User newUser = createTestUser("newuser", UUID.randomUUID());
        UserResponseDto request = new UserResponseDto();
        request.setName("newuser");

        ProjectResponseDto responseDto = new ProjectResponseDto();

        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));
        when(userService.getUserByUsername("newuser")).thenReturn(newUser);
        when(projectMapper.toProjectResponseDto(testProject)).thenReturn(responseDto);

        ProjectResponseDto result = projectService.addUserToProject(testOwner, testProjectId, request);

        assertEquals(responseDto, result);
        assertTrue(testProject.getMembers().contains(newUser));
        verify(notificationService).createAndSendNotification(
                eq(testProject.getMembers()),
                eq(newUser),
                eq("project;join;" + testProject.getName()),
                eq(testProject.getId()),
                isNull()
        );
    }

    @Test
    void shouldThrowUserAlreadyInProjectException_WhenUserAlreadyMember() {
        UserResponseDto request = new UserResponseDto();
        request.setName(testOwner.getName());

        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));
        when(userService.getUserByUsername(testOwner.getName())).thenReturn(testOwner);

        UserAlreadyInProjectException exception = assertThrows(
                UserAlreadyInProjectException.class,
                () -> projectService.addUserToProject(testOwner, testProjectId, request)
        );

        assertEquals("User " + testOwner.getName() + " is already in project",
                exception.getMessage());
    }

    @Test
    void shouldRemoveUserFromProject_Successfully() {
        User userToRemove = createTestUser("usertoremove", UUID.randomUUID());
        testProject.getMembers().add(userToRemove);

        UserResponseDto request = new UserResponseDto();
        request.setName("usertoremove");

        ProjectResponseDto responseDto = new ProjectResponseDto();

        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));
        when(userService.getUserByUsername("usertoremove")).thenReturn(userToRemove);
        when(projectRepository.save(testProject)).thenReturn(testProject);
        when(projectMapper.toProjectResponseDto(testProject)).thenReturn(responseDto);

        ProjectResponseDto result = projectService.removeUserFromProject(testOwner, testProjectId, request);

        assertEquals(responseDto, result);
        assertFalse(testProject.getMembers().contains(userToRemove));
        verify(notificationService).createAndSendNotification(
                eq(testProject.getMembers()),
                eq(userToRemove),
                eq("project;leave;" + testProject.getName()),
                eq(testProject.getId()),
                isNull()
        );
    }

    @Test
    void shouldThrowException_WhenRemovingOwnerFromProject() {
        UserResponseDto request = new UserResponseDto();
        request.setName(testOwner.getName());

        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> projectService.removeUserFromProject(testOwner, testProjectId, request)
        );

        assertEquals("Project owner cannot remove themselves from the project.",
                exception.getMessage());
    }

    @Test
    void shouldThrowUserNotInProjectException_WhenRemovingNonMember() {
        User nonMember = createTestUser("nonmember", UUID.randomUUID());
        UserResponseDto request = new UserResponseDto();
        request.setName("nonmember");

        when(projectRepository.findById(testProjectId)).thenReturn(Optional.of(testProject));
        when(userService.getUserByUsername("nonmember")).thenReturn(nonMember);

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> projectService.removeUserFromProject(testOwner, testProjectId, request)
        );

        assertEquals("User is not a member of the project", exception.getMessage());
    }

    @Test
    void shouldNotThrowException_WhenProjectInProgress() {
        testProject.setStatus(ProjectStatus.IN_PROGRESS);

        assertDoesNotThrow(() -> projectService.isProjectCompleted(testProject));
    }

    @Test
    void shouldThrowException_WhenProjectCompleted() {
        testProject.setStatus(ProjectStatus.COMPLETED);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> projectService.isProjectCompleted(testProject)
        );

        assertEquals("Cannot modify a completed project.", exception.getMessage());
    }
}
