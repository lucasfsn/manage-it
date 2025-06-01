package com.manageit.manageit.feature.user;

import com.manageit.manageit.configuration.jwt.service.JwtService;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.dto.UpdateUserRequestDto;
import com.manageit.manageit.feature.user.dto.UserDetailsResponseDto;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.mapper.UserMapper;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.repository.UserRepository;
import com.manageit.manageit.feature.user.service.UserServiceDefault;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceDefault userService;

    private User testUser;
    private User anotherUser;
    private UUID userId;
    private UUID projectId;
    private String testToken;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        UUID anotherUserId = UUID.randomUUID();
        projectId = UUID.randomUUID();
        testToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

        testUser = User.builder()
                .id(userId)
                .username("testUser")
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .password("hashedPassword")
                .projects(new ArrayList<>())
                .build();

        anotherUser = User.builder()
                .id(anotherUserId)
                .username("anotherUser")
                .firstName("Another")
                .lastName("User")
                .email("another@example.com")
                .projects(new ArrayList<>())
                .build();

        Project testProject = Project.builder()
                .id(projectId)
                .name("Test Project")
                .members(List.of(testUser, anotherUser))
                .build();

        testUser.getProjects().add(testProject);
        anotherUser.getProjects().add(testProject);
    }

    @Test
    void getUserOrThrow_WithUUID_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        User result = userService.getUserOrThrow(userId);

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(userRepository).findById(userId);
    }

    @Test
    void getUserOrThrow_WithUUID_WhenUserNotExists_ShouldThrowEntityNotFoundException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> userService.getUserOrThrow(userId)
        );
        assertEquals("No user found with id: " + userId, exception.getMessage());
        verify(userRepository).findById(userId);
    }

    @Test
    void getUserOrThrow_WithString_WhenUserExists_ShouldReturnUser() {
        String userIdString = userId.toString();
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        User result = userService.getUserOrThrow(userIdString);

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(userRepository).findById(userId);
    }

    @Test
    void getUserOrThrow_WithString_WhenInvalidUUID_ShouldThrowIllegalArgumentException() {
        String invalidUUID = "invalid-uuid";

        assertThrows(
                IllegalArgumentException.class,
                () -> userService.getUserOrThrow(invalidUUID)
        );
    }

    @Test
    void getUserByToken_WhenValidToken_ShouldReturnUser() {
        String userIdString = userId.toString();
        when(jwtService.extractUserId("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")).thenReturn(userIdString);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        User result = userService.getUserByToken(testToken);

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(jwtService).extractUserId("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
        verify(userRepository).findById(userId);
    }

    @Test
    void getUserByUsername_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(testUser));

        User result = userService.getUserByUsername("testUser");

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(userRepository).findByUsername("testUser");
    }

    @Test
    void getUserByUsername_WhenUserNotExists_ShouldThrowEntityNotFoundException() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> userService.getUserByUsername("nonexistent")
        );
        assertEquals("No user found with username: nonexistent", exception.getMessage());
        verify(userRepository).findByUsername("nonexistent");
    }

    @Test
    void findByToken_WhenValidToken_ShouldReturnAuthenticatedUserResponseDto() {
        String userIdString = userId.toString();
        AuthenticatedUserResponseDto expectedDto = new AuthenticatedUserResponseDto();

        when(jwtService.extractUserId("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")).thenReturn(userIdString);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userMapper.toAuthenticatedUserResponse(testUser)).thenReturn(expectedDto);

        AuthenticatedUserResponseDto result = userService.findByToken(testToken);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        verify(userMapper).toAuthenticatedUserResponse(testUser);
    }

    @Test
    void findByUsername_WhenRequestingOwnProfile_ShouldReturnFullUserDetails() {
        UserDetailsResponseDto expectedDto = new UserDetailsResponseDto();
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(testUser));
        when(userMapper.toUserDetailsResponseDto(eq(testUser), anyList())).thenReturn(expectedDto);

        UserDetailsResponseDto result = userService.findByUsername(testUser, "testUser");

        assertNotNull(result);
        assertEquals(expectedDto, result);
        verify(userMapper).toUserDetailsResponseDto(eq(testUser), anyList());
        verify(userMapper, never()).toUserResponseWithoutEmail(any(), any());
    }

    @Test
    void findByUsername_WhenRequestingOtherUserProfile_ShouldReturnLimitedUserDetails() {
        UserDetailsResponseDto expectedDto = new UserDetailsResponseDto();
        when(userRepository.findByUsername("anotherUser")).thenReturn(Optional.of(anotherUser));
        when(userMapper.toUserResponseWithoutEmail(eq(anotherUser), anyList())).thenReturn(expectedDto);

        UserDetailsResponseDto result = userService.findByUsername(testUser, "anotherUser");

        assertNotNull(result);
        assertEquals(expectedDto, result);
        verify(userMapper).toUserResponseWithoutEmail(eq(anotherUser), anyList());
        verify(userMapper, never()).toUserDetailsResponseDto(any(), any());
    }

    @Test
    void findByUsername_ShouldFilterProjectsByMembership() {
        Project privateProject = Project.builder()
                .id(UUID.randomUUID())
                .name("Private Project")
                .members(List.of(anotherUser)) // testUser is not a member
                .build();

        anotherUser.getProjects().add(privateProject);

        UserDetailsResponseDto expectedDto = new UserDetailsResponseDto();
        when(userRepository.findByUsername("anotherUser")).thenReturn(Optional.of(anotherUser));
        when(userMapper.toUserResponseWithoutEmail(eq(anotherUser), anyList())).thenReturn(expectedDto);

        userService.findByUsername(testUser, "anotherUser");

        verify(userMapper).toUserResponseWithoutEmail(eq(anotherUser), argThat(projects ->
                projects.size() == 1 && projects.getFirst().getName().equals("Test Project")
        ));
    }

    @Test
    void updateUser_WhenAllFieldsProvided_ShouldUpdateAllFields() {
        UpdateUserRequestDto updateRequest = UpdateUserRequestDto.builder()
                .firstName("Updated")
                .lastName("Name")
                .email("updated@example.com")
                .password("newPassword")
                .build();

        UserDetailsResponseDto expectedDto = new UserDetailsResponseDto();
        User savedUser = testUser;

        when(passwordEncoder.encode("newPassword")).thenReturn("hashedNewPassword");
        when(userRepository.save(testUser)).thenReturn(savedUser);
        when(userMapper.toUserDetailsResponseDto(savedUser)).thenReturn(expectedDto);

        UserDetailsResponseDto result = userService.updateUser(testUser, updateRequest);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertEquals("Updated", testUser.getFirstName());
        assertEquals("Name", testUser.getLastName());
        assertEquals("updated@example.com", testUser.getEmail());
        assertEquals("hashedNewPassword", testUser.getPassword());
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(testUser);
    }

    @Test
    void updateUser_WhenPartialFieldsProvided_ShouldUpdateOnlyProvidedFields() {
        UpdateUserRequestDto updateRequest = UpdateUserRequestDto.builder()
                .firstName("Updated")
                .build();

        String originalLastName = testUser.getLastName();
        String originalEmail = testUser.getEmail();
        String originalPassword = testUser.getPassword();

        UserDetailsResponseDto expectedDto = new UserDetailsResponseDto();
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userMapper.toUserDetailsResponseDto(testUser)).thenReturn(expectedDto);

        UserDetailsResponseDto result = userService.updateUser(testUser, updateRequest);

        assertNotNull(result);
        assertEquals("Updated", testUser.getFirstName());
        assertEquals(originalLastName, testUser.getLastName());
        assertEquals(originalEmail, testUser.getEmail());
        assertEquals(originalPassword, testUser.getPassword());
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void searchUsers_WithoutProjectIdAndTaskId_ShouldSearchAllUsers() {
        String pattern = "test";
        List<User> users = List.of(testUser, anotherUser);
        List<UserResponseDto> expectedDtos = List.of(new UserResponseDto(), new UserResponseDto());

        when(userRepository.findByPatternInAllFields(pattern)).thenReturn(Optional.of(users));
        when(userMapper.toUserResponseDto(testUser)).thenReturn(expectedDtos.get(0));
        when(userMapper.toUserResponseDto(anotherUser)).thenReturn(expectedDtos.get(1));

        List<UserResponseDto> result = userService.searchUsers(pattern, null, null);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(userRepository).findByPatternInAllFields(pattern);
        verify(userRepository, never()).findByPatternInAllFieldsNotInProject(any(), any());
        verify(userRepository, never()).findByPatternInProjectExcludingTask(any(), any(), any());
    }

    @Test
    void searchUsers_WithProjectIdOnly_ShouldSearchUsersNotInProject() {
        String pattern = "test";
        List<User> users = List.of(testUser);
        List<UserResponseDto> expectedDtos = List.of(new UserResponseDto());

        when(userRepository.findByPatternInAllFieldsNotInProject(pattern, projectId))
                .thenReturn(Optional.of(users));
        when(userMapper.toUserResponseDto(testUser)).thenReturn(expectedDtos.getFirst());

        List<UserResponseDto> result = userService.searchUsers(pattern, projectId, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userRepository).findByPatternInAllFieldsNotInProject(pattern, projectId);
        verify(userRepository, never()).findByPatternInAllFields(any());
        verify(userRepository, never()).findByPatternInProjectExcludingTask(any(), any(), any());
    }

    @Test
    void searchUsers_WithProjectIdAndTaskId_ShouldSearchUsersInProjectExcludingTask() {
        String pattern = "test";
        UUID taskId = UUID.randomUUID();
        List<User> users = List.of(anotherUser);
        List<UserResponseDto> expectedDtos = List.of(new UserResponseDto());

        when(userRepository.findByPatternInProjectExcludingTask(pattern, projectId, taskId))
                .thenReturn(Optional.of(users));
        when(userMapper.toUserResponseDto(anotherUser)).thenReturn(expectedDtos.getFirst());

        List<UserResponseDto> result = userService.searchUsers(pattern, projectId, taskId);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userRepository).findByPatternInProjectExcludingTask(pattern, projectId, taskId);
        verify(userRepository, never()).findByPatternInAllFields(any());
        verify(userRepository, never()).findByPatternInAllFieldsNotInProject(any(), any());
    }

    @Test
    void searchUsers_WhenNoUsersFound_ShouldThrowEntityNotFoundException() {
        String pattern = "nonexistent";
        when(userRepository.findByPatternInAllFields(pattern)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> userService.searchUsers(pattern, null, null)
        );
        assertEquals("No users found!", exception.getMessage());
    }

    @Test
    void removeUser_WhenUserExists_ShouldDeleteUser() {
        when(userRepository.existsById(userId)).thenReturn(true);

        userService.removeUser(testUser);

        verify(userRepository).existsById(userId);
        verify(userRepository).deleteById(userId);
    }

    @Test
    void removeUser_WhenUserNotExists_ShouldThrowEntityNotFoundException() {
        when(userRepository.existsById(userId)).thenReturn(false);

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> userService.removeUser(testUser)
        );
        assertEquals("User not found with id: " + userId, exception.getMessage());
        verify(userRepository).existsById(userId);
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void getUserByToken_WhenTokenWithoutBearer_ShouldHandleCorrectly() {
        String tokenWithoutBearer = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        String userIdString = userId.toString();

        when(jwtService.extractUserId(tokenWithoutBearer)).thenReturn(userIdString);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        User result = userService.getUserByToken(tokenWithoutBearer);

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(jwtService).extractUserId(tokenWithoutBearer);
    }

    @Test
    void updateUser_WhenNullFieldsInRequest_ShouldNotUpdateNullFields() {
        UpdateUserRequestDto updateRequest = UpdateUserRequestDto.builder()
                .firstName(null)
                .lastName(null)
                .email(null)
                .password(null)
                .build();

        String originalFirstName = testUser.getFirstName();
        String originalLastName = testUser.getLastName();
        String originalEmail = testUser.getEmail();
        String originalPassword = testUser.getPassword();

        UserDetailsResponseDto expectedDto = new UserDetailsResponseDto();
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userMapper.toUserDetailsResponseDto(testUser)).thenReturn(expectedDto);

        UserDetailsResponseDto result = userService.updateUser(testUser, updateRequest);

        assertNotNull(result);
        assertEquals(originalFirstName, testUser.getFirstName());
        assertEquals(originalLastName, testUser.getLastName());
        assertEquals(originalEmail, testUser.getEmail());
        assertEquals(originalPassword, testUser.getPassword());
        verify(passwordEncoder, never()).encode(any());
    }
}
