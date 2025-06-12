package com.manageit.manageit.feature.task;

import com.manageit.manageit.core.exception.*;
import com.manageit.manageit.feature.chat.service.ChatService;
import com.manageit.manageit.feature.notification.service.NotificationService;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.project.service.ProjectService;
import com.manageit.manageit.feature.task.dto.CreateTaskRequestDto;
import com.manageit.manageit.feature.task.dto.TaskDetailsResponseDto;
import com.manageit.manageit.feature.task.dto.TaskResponseDto;
import com.manageit.manageit.feature.task.dto.UpdateTaskRequestDto;
import com.manageit.manageit.feature.task.mapper.TaskMapper;
import com.manageit.manageit.feature.task.model.Task;
import com.manageit.manageit.feature.task.model.TaskPriority;
import com.manageit.manageit.feature.task.model.TaskStatus;
import com.manageit.manageit.feature.task.repository.TaskRepository;
import com.manageit.manageit.feature.task.service.TaskServiceDefault;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.service.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectService projectService;

    @Mock
    private TaskMapper taskMapper;

    @Mock
    private NotificationService notificationService;

    @Mock
    private UserService userService;

    @Mock
    private ChatService chatService;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private TaskServiceDefault taskService;

    private User testUser;
    private Project testProject;
    private Task testTask;
    private UUID projectId;
    private UUID taskId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        taskId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        testUser = User.builder()
                .id(userId)
                .username("testUser")
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .build();

        testProject = Project.builder()
                .id(projectId)
                .name("Test Project")
                .members(new ArrayList<>(List.of(testUser)))
                .endDate(LocalDate.of(2030, 1, 1))
                .build();

        testTask = Task.builder()
                .id(taskId)
                .project(testProject)
                .description("Test task")
                .users(new ArrayList<>())
                .build();

        try {
            var field = TaskServiceDefault.class.getDeclaredField("entityManager");
            field.setAccessible(true);
            field.set(taskService, entityManager);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void getTaskById_WhenTaskExists_ShouldReturnTask() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));

        Task result = taskService.getTaskById(taskId);

        assertNotNull(result);
        assertEquals(testTask, result);
        verify(taskRepository).findById(taskId);
    }

    @Test
    void getTaskById_WhenTaskNotExists_ShouldThrowEntityNotFoundException() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> taskService.getTaskById(taskId)
        );
        assertEquals("No task found with id: " + taskId, exception.getMessage());
        verify(taskRepository).findById(taskId);
    }

    @Test
    void getTask_WhenValidUserAndTask_ShouldReturnTaskResponseDto() {
        TaskResponseDto expectedDto = new TaskResponseDto();
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(taskMapper.toTaskResponseDto(testTask)).thenReturn(expectedDto);

        TaskResponseDto result = taskService.getTask(testUser, projectId, taskId);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        verify(projectService).getProjectById(projectId);
        verify(taskRepository).findById(taskId);
        verify(taskMapper).toTaskResponseDto(testTask);
    }

    @Test
    void getTask_WhenUserNotInProject_ShouldThrowUserNotInProjectException() {
        User unauthorizedUser = User.builder()
                .id(UUID.randomUUID())
                .username("unauthorized")
                .build();
        when(projectService.getProjectById(projectId)).thenReturn(testProject);

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> taskService.getTask(unauthorizedUser, projectId, taskId)
        );
        assertEquals("User unauthorized is not member of project", exception.getMessage());
    }

    @Test
    void getTask_WhenTaskNotInProject_ShouldThrowTaskNotInProjectException() {
        Project anotherProject = Project.builder().id(UUID.randomUUID()).build();
        Task taskFromAnotherProject = Task.builder()
                .id(taskId)
                .project(anotherProject)
                .build();

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(taskFromAnotherProject));

        TaskNotInProjectException exception = assertThrows(
                TaskNotInProjectException.class,
                () -> taskService.getTask(testUser, projectId, taskId)
        );
        assertNotNull(exception);
    }

    @Test
    void createAndAddTaskToProject_WhenValidRequest_ShouldCreateTask() {
        CreateTaskRequestDto createRequest = CreateTaskRequestDto.builder()
                .description("New task")
                .build();

        TaskDetailsResponseDto expectedDto = new TaskDetailsResponseDto();
        Task savedTask = Task.builder().id(UUID.randomUUID()).build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);
        when(taskMapper.toTaskDetailsResponseDto(savedTask)).thenReturn(expectedDto);

        TaskDetailsResponseDto result = taskService.createAndAddTaskToProject(testUser, projectId, createRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        verify(projectService).getProjectById(projectId);
        verify(taskRepository).save(any(Task.class));
        verify(chatService).saveChat(testProject, savedTask);
    }

    @Test
    void createAndAddTaskToProject_WhenUserNotInProject_ShouldThrowException() {
        User unauthorizedUser = User.builder()
                .id(UUID.randomUUID())
                .username("unauthorized")
                .build();
        CreateTaskRequestDto createRequest = CreateTaskRequestDto.builder()
                .description("New task")
                .build();

        when(entityManager.merge(unauthorizedUser)).thenReturn(unauthorizedUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> taskService.createAndAddTaskToProject(unauthorizedUser, projectId, createRequest)
        );
        assertEquals("User unauthorized is not member of project", exception.getMessage());
    }

    @Test
    void deleteTask_WhenValidRequest_ShouldDeleteTask() {
        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));

        taskService.deleteTask(testUser, taskId, projectId);

        verify(projectService).getProjectById(projectId);
        verify(taskRepository).delete(testTask);
        verify(notificationService).createAndSendNotification(
                eq(testProject.getMembers()),
                eq(testUser),
                eq("task;delete;" + testProject.getName()),
                eq(projectId),
                eq(taskId)
        );
    }

    @Test
    void deleteTask_WhenTaskNotInProject_ShouldThrowTaskNotInProjectException() {
        Project anotherProject = Project.builder().id(UUID.randomUUID()).build();
        Task taskFromAnotherProject = Task.builder()
                .id(taskId)
                .project(anotherProject)
                .build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(taskFromAnotherProject));

        TaskNotInProjectException exception = assertThrows(
                TaskNotInProjectException.class,
                () -> taskService.deleteTask(testUser, taskId, projectId)
        );
        assertNotNull(exception);
    }

    @Test
    void updateTask_WhenValidRequest_ShouldUpdateTask() {
        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .description("Updated description")
                .build();

        TaskResponseDto expectedDto = new TaskResponseDto();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(testTask)).thenReturn(testTask);
        when(taskMapper.toTaskResponseDto(testTask)).thenReturn(expectedDto);

        TaskResponseDto result = taskService.updateTask(testUser, taskId, projectId, updateRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertEquals("Updated description", testTask.getDescription());
        assertNotNull(testTask.getUpdatedAt());
        verify(taskRepository).save(testTask);
        verify(notificationService).createAndSendNotification(
                eq(testProject.getMembers()),
                eq(testUser),
                eq("task;update;" + testProject.getName()),
                eq(projectId),
                eq(taskId)
        );
    }

    @Test
    void updateTask_WhenAllFieldsProvided_ShouldUpdateAllFields() {
        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .description("Updated description")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .dueDate(LocalDate.now())
                .build();

        TaskResponseDto expectedDto = new TaskResponseDto();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(testTask)).thenReturn(testTask);
        when(taskMapper.toTaskResponseDto(testTask)).thenReturn(expectedDto);

        TaskResponseDto result = taskService.updateTask(testUser, taskId, projectId, updateRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertEquals("Updated description", testTask.getDescription());
        assertEquals(TaskStatus.IN_PROGRESS, testTask.getStatus());
        assertEquals(TaskPriority.HIGH, testTask.getPriority());
        assertEquals(updateRequest.getDueDate(), testTask.getDueDate());
        assertNotNull(testTask.getUpdatedAt());
    }

    @Test
    void updateTask_WhenOnlyStatusProvided_ShouldUpdateOnlyStatus() {
        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .status(TaskStatus.COMPLETED)
                .build();

        String originalDescription = testTask.getDescription();
        TaskResponseDto expectedDto = new TaskResponseDto();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(testTask)).thenReturn(testTask);
        when(taskMapper.toTaskResponseDto(testTask)).thenReturn(expectedDto);

        TaskResponseDto result = taskService.updateTask(testUser, taskId, projectId, updateRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertEquals(originalDescription, testTask.getDescription());
        assertEquals(TaskStatus.COMPLETED, testTask.getStatus());
        assertNotNull(testTask.getUpdatedAt());
    }

    @Test
    void updateTask_WhenOnlyPriorityProvided_ShouldUpdateOnlyPriority() {
        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .priority(TaskPriority.LOW)
                .build();

        String originalDescription = testTask.getDescription();
        TaskResponseDto expectedDto = new TaskResponseDto();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(testTask)).thenReturn(testTask);
        when(taskMapper.toTaskResponseDto(testTask)).thenReturn(expectedDto);

        TaskResponseDto result = taskService.updateTask(testUser, taskId, projectId, updateRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertEquals(originalDescription, testTask.getDescription());
        assertEquals(TaskPriority.LOW, testTask.getPriority());
        assertNotNull(testTask.getUpdatedAt());
    }

    @Test
    void updateTask_WhenOnlyDueDateProvided_ShouldUpdateOnlyDueDate() {
        LocalDate newDueDate = LocalDate.now().plusDays(1);
        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .dueDate(newDueDate)
                .build();

        String originalDescription = testTask.getDescription();
        TaskResponseDto expectedDto = new TaskResponseDto();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(testTask)).thenReturn(testTask);
        when(taskMapper.toTaskResponseDto(testTask)).thenReturn(expectedDto);

        TaskResponseDto result = taskService.updateTask(testUser, taskId, projectId, updateRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertEquals(originalDescription, testTask.getDescription());
        assertEquals(newDueDate, testTask.getDueDate());
        assertNotNull(testTask.getUpdatedAt());
    }

    @Test
    void updateTask_WhenTaskNotFound_ShouldThrowEntityNotFoundException() {
        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .description("Updated description")
                .build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> taskService.updateTask(testUser, taskId, projectId, updateRequest)
        );
        assertEquals("No task found with id: " + taskId, exception.getMessage());
    }

    @Test
    void updateTask_WhenTaskNotInProject_ShouldThrowTaskNotInProjectException() {
        Project anotherProject = Project.builder().id(UUID.randomUUID()).build();
        Task taskFromAnotherProject = Task.builder()
                .id(taskId)
                .project(anotherProject)
                .build();

        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .description("Updated description")
                .build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(taskFromAnotherProject));

        TaskNotInProjectException exception = assertThrows(
                TaskNotInProjectException.class,
                () -> taskService.updateTask(testUser, taskId, projectId, updateRequest)
        );
        assertNotNull(exception);
    }

    @Test
    void addUserToTask_WhenValidRequest_ShouldAddUserToTask() {
        User userToAdd = User.builder()
                .id(UUID.randomUUID())
                .username("userToAdd")
                .build();
        testProject.getMembers().add(userToAdd);
        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToAdd");

        TaskResponseDto expectedDto = new TaskResponseDto();

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(userService.getUserByUsername("userToAdd")).thenReturn(userToAdd);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(testTask)).thenReturn(testTask);
        when(taskMapper.toTaskResponseDto(testTask)).thenReturn(expectedDto);

        TaskResponseDto result = taskService.addUserToTask(testUser, taskId, projectId, userRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertTrue(testTask.getUsers().contains(userToAdd));
        verify(taskRepository).save(testTask);
        verify(notificationService).createAndSendNotification(
                eq(testProject.getMembers()),
                eq(userToAdd),
                eq("task;join;" + testProject.getName()),
                eq(projectId),
                eq(taskId)
        );
    }

    @Test
    void addUserToTask_WhenUserNotInProject_ShouldThrowException() {
        User userNotInProject = User.builder()
                .id(UUID.randomUUID())
                .username("outsider")
                .build();
        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("outsider");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(userService.getUserByUsername("outsider")).thenReturn(userNotInProject);

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> taskService.addUserToTask(testUser, taskId, projectId, userRequest)
        );
        assertEquals("User outsider is not member of project", exception.getMessage());
    }

    @Test
    void addUserToTask_WhenTaskNotInProject_ShouldThrowTaskNotInProjectException() {
        User userToAdd = User.builder()
                .id(UUID.randomUUID())
                .username("userToAdd")
                .build();
        testProject.getMembers().add(userToAdd);

        Project anotherProject = Project.builder().id(UUID.randomUUID()).build();
        Task taskFromAnotherProject = Task.builder()
                .id(taskId)
                .project(anotherProject)
                .users(new ArrayList<>())
                .build();

        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToAdd");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(userService.getUserByUsername("userToAdd")).thenReturn(userToAdd);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(taskFromAnotherProject));

        TaskNotInProjectException exception = assertThrows(
                TaskNotInProjectException.class,
                () -> taskService.addUserToTask(testUser, taskId, projectId, userRequest)
        );
        assertNotNull(exception);
    }

    @Test
    void addUserToTask_WhenUserAlreadyInTask_ShouldThrowIllegalStateException() {
        User userAlreadyInTask = User.builder()
                .id(UUID.randomUUID())
                .username("existing")
                .build();
        testProject.getMembers().add(userAlreadyInTask);
        testTask.getUsers().add(userAlreadyInTask);

        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("existing");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(userService.getUserByUsername("existing")).thenReturn(userAlreadyInTask);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> taskService.addUserToTask(testUser, taskId, projectId, userRequest)
        );
        assertEquals("User is already a member of the task", exception.getMessage());
    }

    @Test
    void removeUserFromTask_WhenValidRequest_ShouldRemoveUserFromTask() {
        User userToRemove = User.builder()
                .id(UUID.randomUUID())
                .username("userToRemove")
                .build();
        testTask.getUsers().add(userToRemove);

        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToRemove");

        TaskResponseDto expectedDto = new TaskResponseDto();

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(userService.getUserByUsername("userToRemove")).thenReturn(userToRemove);
        when(taskRepository.save(testTask)).thenReturn(testTask);
        when(taskMapper.toTaskResponseDto(testTask)).thenReturn(expectedDto);

        TaskResponseDto result = taskService.removeUserFromTask(testUser, taskId, projectId, userRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertFalse(testTask.getUsers().contains(userToRemove));
        verify(taskRepository).save(testTask);
        verify(notificationService).createAndSendNotification(
                eq(testProject.getMembers()),
                eq(userToRemove),
                eq("task;leave;" + testProject.getName()),
                eq(projectId),
                eq(taskId)
        );
    }

    @Test
    void removeUserFromTask_WhenTaskNotInProject_ShouldThrowTaskNotInProjectException() {
        Project anotherProject = Project.builder().id(UUID.randomUUID()).build();
        Task taskFromAnotherProject = Task.builder()
                .id(taskId)
                .project(anotherProject)
                .users(new ArrayList<>())
                .build();

        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToRemove");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(taskFromAnotherProject));

        TaskNotInProjectException exception = assertThrows(
                TaskNotInProjectException.class,
                () -> taskService.removeUserFromTask(testUser, taskId, projectId, userRequest)
        );
        assertNotNull(exception);
    }

    @Test
    void removeUserFromTask_WhenUserNotInTask_ShouldThrowException() {
        User userNotInTask = User.builder()
                .id(UUID.randomUUID())
                .username("notInTask")
                .build();
        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("notInTask");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(userService.getUserByUsername("notInTask")).thenReturn(userNotInTask);

        UserNotInTaskException exception = assertThrows(
                UserNotInTaskException.class,
                () -> taskService.removeUserFromTask(testUser, taskId, projectId, userRequest)
        );
        assertEquals("User is not a member of the task", exception.getMessage());
    }

    @Test
    void createAndAddTaskToProject_WhenProjectCompleted_ShouldThrowProjectModificationNotAllowedException() {
        CreateTaskRequestDto createRequest = CreateTaskRequestDto.builder()
                .description("New task")
                .build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.createAndAddTaskToProject(testUser, projectId, createRequest)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void createAndAddTaskToProject_WhenEndDatePassed_ShouldThrowProjectModificationNotAllowedException() {
        CreateTaskRequestDto createRequest = CreateTaskRequestDto.builder()
                .description("New task")
                .build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(false);
        when(projectService.isEndDatePassed(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.createAndAddTaskToProject(testUser, projectId, createRequest)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void deleteTask_WhenUserNotInProject_ShouldThrowUserNotInProjectException() {
        User unauthorizedUser = User.builder()
                .id(UUID.randomUUID())
                .username("unauthorized")
                .build();

        when(entityManager.merge(unauthorizedUser)).thenReturn(unauthorizedUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> taskService.deleteTask(unauthorizedUser, taskId, projectId)
        );
        assertEquals("User unauthorized is not member of project", exception.getMessage());
    }

    @Test
    void deleteTask_WhenProjectCompleted_ShouldThrowProjectModificationNotAllowedException() {
        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.deleteTask(testUser, taskId, projectId)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void deleteTask_WhenEndDatePassed_ShouldThrowProjectModificationNotAllowedException() {
        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(false);
        when(projectService.isEndDatePassed(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.deleteTask(testUser, taskId, projectId)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void updateTask_WhenUserNotInProject_ShouldThrowUserNotInProjectException() {
        User unauthorizedUser = User.builder()
                .id(UUID.randomUUID())
                .username("unauthorized")
                .build();

        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .description("Updated description")
                .build();

        when(entityManager.merge(unauthorizedUser)).thenReturn(unauthorizedUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> taskService.updateTask(unauthorizedUser, taskId, projectId, updateRequest)
        );
        assertEquals("User unauthorized is not member of project", exception.getMessage());
    }

    @Test
    void updateTask_WhenProjectCompleted_ShouldThrowProjectModificationNotAllowedException() {
        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .description("Updated description")
                .build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.updateTask(testUser, taskId, projectId, updateRequest)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void updateTask_WhenEndDatePassed_ShouldThrowProjectModificationNotAllowedException() {
        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .description("Updated description")
                .build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(false);
        when(projectService.isEndDatePassed(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.updateTask(testUser, taskId, projectId, updateRequest)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void updateTask_WhenDueDateExceedsProjectEndDate_ShouldThrowTaskDueDateExceedsProjectEndDateException() {
        LocalDate projectEndDate = LocalDate.of(2025, 12, 31);
        LocalDate taskDueDate = LocalDate.of(2026, 1, 15);

        testProject.setEndDate(projectEndDate);

        UpdateTaskRequestDto updateRequest = UpdateTaskRequestDto.builder()
                .dueDate(taskDueDate)
                .build();

        when(entityManager.merge(testUser)).thenReturn(testUser);
        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));

        TaskDueDateExceedsProjectEndDateException exception = assertThrows(
                TaskDueDateExceedsProjectEndDateException.class,
                () -> taskService.updateTask(testUser, taskId, projectId, updateRequest)
        );
        assertEquals("Due date cannot be after project end date", exception.getMessage());
    }

    @Test
    void addUserToTask_WhenUserNotInProject_ShouldThrowUserNotInProjectException() {
        User unauthorizedUser = User.builder()
                .id(UUID.randomUUID())
                .username("unauthorized")
                .build();

        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToAdd");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> taskService.addUserToTask(unauthorizedUser, taskId, projectId, userRequest)
        );
        assertEquals("User unauthorized is not member of project", exception.getMessage());
    }

    @Test
    void addUserToTask_WhenProjectCompleted_ShouldThrowProjectModificationNotAllowedException() {
        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToAdd");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.addUserToTask(testUser, taskId, projectId, userRequest)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void addUserToTask_WhenEndDatePassed_ShouldThrowProjectModificationNotAllowedException() {
        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToAdd");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(false);
        when(projectService.isEndDatePassed(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.addUserToTask(testUser, taskId, projectId, userRequest)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void removeUserFromTask_WhenUserNotInProject_ShouldThrowUserNotInProjectException() {
        User unauthorizedUser = User.builder()
                .id(UUID.randomUUID())
                .username("unauthorized")
                .build();

        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToRemove");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);

        UserNotInProjectException exception = assertThrows(
                UserNotInProjectException.class,
                () -> taskService.removeUserFromTask(unauthorizedUser, taskId, projectId, userRequest)
        );
        assertEquals("User unauthorized is not member of project", exception.getMessage());
    }

    @Test
    void removeUserFromTask_WhenProjectCompleted_ShouldThrowProjectModificationNotAllowedException() {
        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToRemove");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.removeUserFromTask(testUser, taskId, projectId, userRequest)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }

    @Test
    void removeUserFromTask_WhenEndDatePassed_ShouldThrowProjectModificationNotAllowedException() {
        UserResponseDto userRequest = new UserResponseDto();
        userRequest.setName("userToRemove");

        when(projectService.getProjectById(projectId)).thenReturn(testProject);
        when(projectService.isProjectCompleted(testProject)).thenReturn(false);
        when(projectService.isEndDatePassed(testProject)).thenReturn(true);

        ProjectModificationNotAllowedException exception = assertThrows(
                ProjectModificationNotAllowedException.class,
                () -> taskService.removeUserFromTask(testUser, taskId, projectId, userRequest)
        );
        assertEquals("Cannot modify project.", exception.getMessage());
    }
}