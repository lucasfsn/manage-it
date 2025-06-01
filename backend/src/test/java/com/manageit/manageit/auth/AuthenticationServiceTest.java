package com.manageit.manageit.auth;

import com.manageit.manageit.auth.dto.AuthenticationRequestDto;
import com.manageit.manageit.auth.dto.AuthenticationResponseDto;
import com.manageit.manageit.auth.dto.RegisterRequestDto;
import com.manageit.manageit.auth.service.AuthenticationServiceDefault;
import com.manageit.manageit.configuration.jwt.builder.JwtTokenParser;
import com.manageit.manageit.configuration.jwt.dto.JwtTokenResponseDto;
import com.manageit.manageit.configuration.jwt.model.JwtToken;
import com.manageit.manageit.configuration.jwt.service.JwtService;
import com.manageit.manageit.core.exception.JwtAuthenticationException;
import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.mapper.UserMapper;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @Mock
    private JwtTokenParser jwtTokenParser;

    @InjectMocks
    private AuthenticationServiceDefault authenticationService;

    private User testUser;
    private RegisterRequestDto registerRequest;
    private AuthenticationRequestDto authRequest;
    private AuthenticatedUserResponseDto userResponse;
    private JwtToken accessToken;
    private JwtToken refreshToken;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .username("johndoe")
                .email("john.doe@example.com")
                .password("encodedPassword")
                .createdAt(LocalDateTime.now())
                .build();

        registerRequest = RegisterRequestDto.builder()
                .firstName("John")
                .lastName("Doe")
                .username("johndoe")
                .email("john.doe@example.com")
                .password("password123")
                .build();

        authRequest = AuthenticationRequestDto.builder()
                .email("john.doe@example.com")
                .password("password123")
                .build();

        userResponse = AuthenticatedUserResponseDto.builder()
                .id(testUser.getId())
                .name("johndoe")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .build();

        Claims mockAccessClaims = mock(Claims.class);
        when(mockAccessClaims.get("type", String.class)).thenReturn("access");
        when(mockAccessClaims.getSubject()).thenReturn(testUser.getId().toString());
        when(mockAccessClaims.getIssuedAt()).thenReturn(new Date(System.currentTimeMillis()));
        when(mockAccessClaims.getExpiration()).thenReturn(new Date(System.currentTimeMillis() + 3600000));
        when(mockAccessClaims.get("authorities", java.util.List.class)).thenReturn(Collections.emptyList());

        accessToken = new JwtToken(mockAccessClaims, "access.jwt.token");

        Claims mockRefreshClaims = mock(Claims.class);
        when(mockRefreshClaims.get("type", String.class)).thenReturn("refresh");
        when(mockRefreshClaims.getSubject()).thenReturn(testUser.getId().toString());
        when(mockRefreshClaims.getIssuedAt()).thenReturn(new Date(System.currentTimeMillis()));
        when(mockRefreshClaims.getExpiration()).thenReturn(new Date(System.currentTimeMillis() + 86400000));
        when(mockRefreshClaims.get("authorities", java.util.List.class)).thenReturn(Collections.emptyList());

        refreshToken = new JwtToken(mockRefreshClaims, "refresh.jwt.token");
    }

    @Test
    void registerUserSuccessfully() {
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");

        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userMapper.toAuthenticatedUserResponse(any(User.class))).thenReturn(userResponse);
        when(jwtService.generateToken(testUser)).thenReturn(accessToken);
        when(jwtService.generateRefreshToken(testUser)).thenReturn(refreshToken);

        AuthenticationResponseDto response = authenticationService.register(registerRequest);

        assertThat(response).isNotNull();

        assertThat(response.getAccessToken()).isEqualTo("access.jwt.token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh.jwt.token");
        assertThat(response.getUser()).isEqualTo(userResponse);

        verify(passwordEncoder).encode("password123");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User capturedUser = userCaptor.getValue();

        assertThat(capturedUser.getFirstName()).isEqualTo("John");
        assertThat(capturedUser.getLastName()).isEqualTo("Doe");
        assertThat(capturedUser.getName()).isEqualTo("johndoe");
        assertThat(capturedUser.getEmail()).isEqualTo("john.doe@example.com");
        assertThat(capturedUser.getPassword()).isEqualTo("encodedPassword");

        verify(userMapper).toAuthenticatedUserResponse(any(User.class));
        verify(jwtService).generateToken(testUser);
        verify(jwtService).generateRefreshToken(testUser);
    }

    @Test
    void authenticateUserSuccessfully() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userMapper.toAuthenticatedUserResponse(testUser)).thenReturn(userResponse);
        when(jwtService.generateToken(testUser)).thenReturn(accessToken);
        when(jwtService.generateRefreshToken(testUser)).thenReturn(refreshToken);

        AuthenticationResponseDto response = authenticationService.authenticate(authRequest);

        assertThat(response).isNotNull();

        assertThat(response.getAccessToken()).isEqualTo("access.jwt.token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh.jwt.token");
        assertThat(response.getUser()).isEqualTo(userResponse);

        verify(authenticationManager).authenticate(argThat(token ->
                token.getPrincipal().equals("john.doe@example.com") &&
                        token.getCredentials().equals("password123")
        ));
        verify(userMapper).toAuthenticatedUserResponse(testUser);
        verify(jwtService).generateToken(testUser);
        verify(jwtService).generateRefreshToken(testUser);
    }

    @Test
    void throwExceptionWhenAuthenticationFails() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThatThrownBy(() -> authenticationService.authenticate(authRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid credentials");

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verifyNoInteractions(userMapper, jwtService);
    }

    @Test
    void refreshTokenSuccessfully() {
        String refreshTokenString = "refresh.jwt.token";
        UUID userId = testUser.getId();

        Claims mockClaimsForRefresh = mock(Claims.class);
        when(mockClaimsForRefresh.getSubject()).thenReturn(userId.toString());
        when(mockClaimsForRefresh.getExpiration()).thenReturn(new Date(System.currentTimeMillis() + 86400000));
        when(mockClaimsForRefresh.get("type", String.class)).thenReturn("refresh");
        when(mockClaimsForRefresh.getIssuedAt()).thenReturn(new Date(System.currentTimeMillis()));
        when(mockClaimsForRefresh.get("authorities", java.util.List.class)).thenReturn(Collections.emptyList());

        JwtToken parsedRefreshToken = new JwtToken(mockClaimsForRefresh, refreshTokenString);


        when(jwtTokenParser.parse(refreshTokenString)).thenReturn(parsedRefreshToken);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(jwtService.isTokenValid(parsedRefreshToken, testUser)).thenReturn(true);
        when(jwtService.generateToken(testUser)).thenReturn(accessToken);

        JwtTokenResponseDto response = authenticationService.refreshToken(refreshTokenString);

        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo("access.jwt.token");
        assertThat(response.refreshToken()).isEqualTo("refresh.jwt.token");

        verify(jwtTokenParser).parse(refreshTokenString);
        verify(userRepository).findById(userId);
        verify(jwtService).isTokenValid(parsedRefreshToken, testUser);
        verify(jwtService).generateToken(testUser);
    }

    @Test
    void throwExceptionWhenUserNotFoundDuringTokenRefresh() {
        String refreshTokenString = "refresh.jwt.token";
        UUID userId = testUser.getId();

        Claims mockClaimsForRefresh = mock(Claims.class);
        when(mockClaimsForRefresh.getSubject()).thenReturn(userId.toString());
        when(mockClaimsForRefresh.getExpiration()).thenReturn(new Date(System.currentTimeMillis() + 86400000));
        when(mockClaimsForRefresh.get("type", String.class)).thenReturn("refresh");
        when(mockClaimsForRefresh.getIssuedAt()).thenReturn(new Date(System.currentTimeMillis()));
        when(mockClaimsForRefresh.get("authorities", java.util.List.class)).thenReturn(Collections.emptyList());

        JwtToken parsedRefreshToken = new JwtToken(mockClaimsForRefresh, refreshTokenString);

        when(jwtTokenParser.parse(refreshTokenString)).thenReturn(parsedRefreshToken);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authenticationService.refreshToken(refreshTokenString))
                .isInstanceOf(JwtAuthenticationException.class)
                .hasMessage("Invalid JWT token");

        verify(jwtTokenParser).parse(refreshTokenString);
        verify(userRepository).findById(userId);
        verify(jwtService, never()).isTokenValid(any(), any());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void throwExceptionWhenRefreshTokenIsInvalid() {
        String refreshTokenString = "invalid.refresh.token";
        UUID userId = testUser.getId();

        Claims mockClaimsForRefresh = mock(Claims.class);
        when(mockClaimsForRefresh.getSubject()).thenReturn(userId.toString());
        when(mockClaimsForRefresh.getExpiration()).thenReturn(new Date(System.currentTimeMillis() - 1000));
        when(mockClaimsForRefresh.get("type", String.class)).thenReturn("refresh");
        when(mockClaimsForRefresh.getIssuedAt()).thenReturn(new Date(System.currentTimeMillis() - 2000));
        when(mockClaimsForRefresh.get("authorities", java.util.List.class)).thenReturn(Collections.emptyList());

        JwtToken parsedRefreshToken = new JwtToken(mockClaimsForRefresh, refreshTokenString);

        when(jwtTokenParser.parse(refreshTokenString)).thenReturn(parsedRefreshToken);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(jwtService.isTokenValid(parsedRefreshToken, testUser)).thenReturn(false);

        assertThatThrownBy(() -> authenticationService.refreshToken(refreshTokenString))
                .isInstanceOf(JwtAuthenticationException.class)
                .hasMessage("Invalid JWT token");

        verify(jwtTokenParser).parse(refreshTokenString);
        verify(userRepository).findById(userId);
        verify(jwtService).isTokenValid(parsedRefreshToken, testUser);
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void handleRepositoryExceptionDuringRegistration() {
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenThrow(new RuntimeException("Database error"));

        assertThatThrownBy(() -> authenticationService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Database error");

        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verifyNoInteractions(userMapper, jwtService);
    }

    @Test
    void handleJwtServiceExceptionDuringRegistration() {
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userMapper.toAuthenticatedUserResponse(any(User.class))).thenReturn(userResponse);
        when(jwtService.generateToken(testUser)).thenThrow(new RuntimeException("JWT generation failed"));

        assertThatThrownBy(() -> authenticationService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("JWT generation failed");

        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(userMapper).toAuthenticatedUserResponse(any(User.class));
        verify(jwtService).generateToken(testUser);
    }

    @Test
    void handleInvalidUuidFormatInRefreshToken() {
        String refreshTokenString = "refresh.jwt.token";

        Claims mockClaimsInvalidUuid = mock(Claims.class);
        when(mockClaimsInvalidUuid.getSubject()).thenReturn("invalid-uuid-format");
        when(mockClaimsInvalidUuid.getExpiration()).thenReturn(new Date(System.currentTimeMillis() + 3600000));
        when(mockClaimsInvalidUuid.get("type", String.class)).thenReturn("refresh");
        when(mockClaimsInvalidUuid.getIssuedAt()).thenReturn(new Date(System.currentTimeMillis()));
        when(mockClaimsInvalidUuid.get("authorities", java.util.List.class)).thenReturn(Collections.emptyList());

        JwtToken invalidToken = new JwtToken(mockClaimsInvalidUuid, refreshTokenString);

        when(jwtTokenParser.parse(refreshTokenString)).thenReturn(invalidToken);

        assertThatThrownBy(() -> authenticationService.refreshToken(refreshTokenString))
                .isInstanceOf(IllegalArgumentException.class);

        verify(jwtTokenParser).parse(refreshTokenString);
        verifyNoInteractions(userRepository, jwtService);
    }
}
