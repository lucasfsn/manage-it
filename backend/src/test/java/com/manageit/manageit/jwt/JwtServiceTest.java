package com.manageit.manageit.jwt;

import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.jwt.builder.JwtTokenParser;
import com.manageit.manageit.jwt.model.JwtToken;
import com.manageit.manageit.jwt.service.JwtServiceDefault;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.JwtParserBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @InjectMocks
    private JwtServiceDefault jwtService;

    @Mock
    private JwtTokenParser jwtTokenParser;

    private static final String TEST_SECRET_KEY = "c2VjcmV0a2V5Zm9ydGVzdGluZ3B1cnBvc2VzIHRoaXMgaXMgYSBsb25nIGVub3VnaCBraW1lCg==";
    private static final long TEST_JWT_EXPIRATION = 3600;
    private static final long TEST_JWT_REFRESH_EXPIRATION = 86400;

    private User testUser;
    private UUID testUserId;

    @BeforeEach
    void setUp() throws NoSuchFieldException, IllegalAccessException {
        Field secretKeyField = JwtServiceDefault.class.getDeclaredField("secretKey");
        secretKeyField.setAccessible(true);
        secretKeyField.set(jwtService, TEST_SECRET_KEY);

        Field jwtExpirationField = JwtServiceDefault.class.getDeclaredField("jwtExpiration");
        jwtExpirationField.setAccessible(true);
        jwtExpirationField.set(jwtService, TEST_JWT_EXPIRATION);

        Field jwtRefreshExpirationField = JwtServiceDefault.class.getDeclaredField("jwtRefreshExpiration");
        jwtRefreshExpirationField.setAccessible(true);
        jwtRefreshExpirationField.set(jwtService, TEST_JWT_REFRESH_EXPIRATION);

        testUserId = UUID.randomUUID();
        testUser = User.builder()
                .id(testUserId)
                .email("test@example.com")
                .password("password")
                .firstName("John")
                .lastName("Doe")
                .username("johndoe")
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(TEST_SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims createTestClaims(UUID subject, String type, long issuedAtMillis, long expirationMillis, List<String> authorities) {
        Claims claims = Jwts.claims();
        claims.setSubject(subject.toString());
        claims.put("type", type);
        claims.setIssuedAt(new Date(issuedAtMillis));
        claims.setExpiration(new Date(expirationMillis));
        claims.put("authorities", authorities);
        return claims;
    }

    @Test
    void extractUserIdFromValidToken() {
        String testToken = "some.jwt.token";
        UUID expectedUserId = UUID.randomUUID();
        Claims claims = createTestClaims(expectedUserId, "access", System.currentTimeMillis() - 10000, System.currentTimeMillis() + 3600000, List.of("USER"));

        try (MockedStatic<Jwts> mockedJwts = mockStatic(Jwts.class)) {
            JwtParserBuilder mockParserBuilder = mock(JwtParserBuilder.class);
            JwtParser mockParser = mock(JwtParser.class);
            Jws<Claims> mockJwsClaims = mock(Jws.class);

            mockedJwts.when(Jwts::parserBuilder).thenReturn(mockParserBuilder);
            when(mockParserBuilder.setSigningKey(any(Key.class))).thenReturn(mockParserBuilder);
            when(mockParserBuilder.build()).thenReturn(mockParser);
            when(mockParser.parseClaimsJws(testToken)).thenReturn(mockJwsClaims);
            when(mockJwsClaims.getBody()).thenReturn(claims);

            Field jwtTokenParserField = JwtServiceDefault.class.getDeclaredField("jwtTokenParser");
            jwtTokenParserField.setAccessible(true);
            jwtTokenParserField.set(jwtService, null);

            String actualUserId = jwtService.extractUserId(testToken);
            assertThat(actualUserId).isEqualTo(expectedUserId.toString());

            jwtTokenParserField.set(jwtService, jwtTokenParser);

        } catch (Exception e) {
            throw new RuntimeException("Test failed for extractUserIdFromValidToken", e);
        }
    }

    @Test
    void extractClaimFromValidToken() {
        String testToken = "some.jwt.token";
        String expectedClaimValue = "some_custom_value";
        Claims claims = createTestClaims(UUID.randomUUID(), "access", System.currentTimeMillis() - 10000, System.currentTimeMillis() + 3600000, List.of("USER"));
        claims.put("customClaim", expectedClaimValue);

        try (MockedStatic<Jwts> mockedJwts = mockStatic(Jwts.class)) {
            JwtParserBuilder mockParserBuilder = mock(JwtParserBuilder.class);
            JwtParser mockParser = mock(JwtParser.class);
            Jws<Claims> mockJwsClaims = mock(Jws.class);

            mockedJwts.when(Jwts::parserBuilder).thenReturn(mockParserBuilder);
            when(mockParserBuilder.setSigningKey(any(Key.class))).thenReturn(mockParserBuilder);
            when(mockParserBuilder.build()).thenReturn(mockParser);
            when(mockParser.parseClaimsJws(testToken)).thenReturn(mockJwsClaims);
            when(mockJwsClaims.getBody()).thenReturn(claims);

            Field jwtTokenParserField = JwtServiceDefault.class.getDeclaredField("jwtTokenParser");
            jwtTokenParserField.setAccessible(true);
            jwtTokenParserField.set(jwtService, null);

            Function<Claims, String> claimsResolver = c -> c.get("customClaim", String.class);
            String actualClaimValue = jwtService.extractClaim(testToken, claimsResolver);
            assertThat(actualClaimValue).isEqualTo(expectedClaimValue);

            jwtTokenParserField.set(jwtService, jwtTokenParser);

        } catch (Exception e) {
            throw new RuntimeException("Test failed for extractClaimFromValidToken", e);
        }
    }

    @Test
    @SuppressWarnings("unchecked")
    void generateAccessTokenWithDefaultClaims() {
        JwtToken expectedJwtToken = new JwtToken(
                createTestClaims(testUserId, "access", System.currentTimeMillis(), System.currentTimeMillis() + TEST_JWT_EXPIRATION * 1000, List.of("USER")),
                "generated.access.token"
        );
        when(jwtTokenParser.parse(any(JwtBuilder.class))).thenReturn(expectedJwtToken);

        jwtService.generateToken(testUser);

        ArgumentCaptor<JwtBuilder> jwtBuilderCaptor = ArgumentCaptor.forClass(JwtBuilder.class);
        verify(jwtTokenParser).parse(jwtBuilderCaptor.capture());

        JwtBuilder capturedBuilder = jwtBuilderCaptor.getValue();
        String tokenString = capturedBuilder.compact();
        Claims capturedClaims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(tokenString)
                .getBody();

        assertThat(capturedClaims.getSubject()).isEqualTo(testUserId.toString());
        assertThat(capturedClaims.get("type", String.class)).isEqualTo("access");
        assertThat(capturedClaims.getIssuedAt()).isCloseTo(new Date(), 1000);
        assertThat(capturedClaims.getExpiration()).isCloseTo(new Date(System.currentTimeMillis() + TEST_JWT_EXPIRATION * 1000), 1000);
        assertThat(capturedClaims.get("authorities", List.class)).containsExactly("USER");
    }

    @Test
    @SuppressWarnings("unchecked")
    void generateAccessTokenWithExtraClaims() {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("customField", "customValue");
        extraClaims.put("type", "access");

        JwtToken expectedJwtToken = new JwtToken(
                createTestClaims(testUserId, "access", System.currentTimeMillis(), System.currentTimeMillis() + TEST_JWT_EXPIRATION * 1000, List.of("USER")),
                "generated.access.token.with.extra.claims"
        );
        when(jwtTokenParser.parse(any(JwtBuilder.class))).thenReturn(expectedJwtToken);

        jwtService.generateToken(extraClaims, testUser);

        ArgumentCaptor<JwtBuilder> jwtBuilderCaptor = ArgumentCaptor.forClass(JwtBuilder.class);
        verify(jwtTokenParser).parse(jwtBuilderCaptor.capture());

        JwtBuilder capturedBuilder = jwtBuilderCaptor.getValue();
        String tokenString = capturedBuilder.compact();
        Claims capturedClaims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(tokenString)
                .getBody();

        assertThat(capturedClaims.getSubject()).isEqualTo(testUserId.toString());
        assertThat(capturedClaims.get("type", String.class)).isEqualTo("access");
        assertThat(capturedClaims.get("customField", String.class)).isEqualTo("customValue");
        assertThat(capturedClaims.getIssuedAt()).isCloseTo(new Date(), 1000);
        assertThat(capturedClaims.getExpiration()).isCloseTo(new Date(System.currentTimeMillis() + TEST_JWT_EXPIRATION * 1000), 1000);
        assertThat(capturedClaims.get("authorities", List.class)).containsExactly("USER");
    }

    @Test
    @SuppressWarnings("unchecked")
    void generateRefreshToken() {
        JwtToken expectedJwtToken = new JwtToken(
                createTestClaims(testUserId, "refresh", System.currentTimeMillis(), System.currentTimeMillis() + TEST_JWT_REFRESH_EXPIRATION * 1000, List.of("USER")),
                "generated.refresh.token"
        );
        when(jwtTokenParser.parse(any(JwtBuilder.class))).thenReturn(expectedJwtToken);

        jwtService.generateRefreshToken(testUser);

        ArgumentCaptor<JwtBuilder> jwtBuilderCaptor = ArgumentCaptor.forClass(JwtBuilder.class);
        verify(jwtTokenParser).parse(jwtBuilderCaptor.capture());

        JwtBuilder capturedBuilder = jwtBuilderCaptor.getValue();

        String tokenString = capturedBuilder.compact();
        Claims capturedClaims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(tokenString)
                .getBody();

        assertThat(capturedClaims.getSubject()).isEqualTo(testUserId.toString());
        assertThat(capturedClaims.get("type", String.class)).isEqualTo("refresh");
        assertThat(capturedClaims.getIssuedAt()).isCloseTo(new Date(), 5000);
        assertThat(capturedClaims.getExpiration()).isCloseTo(new Date(System.currentTimeMillis() + TEST_JWT_REFRESH_EXPIRATION * 1000), 5000);
        assertThat(capturedClaims.get("authorities", List.class)).containsExactly("USER");
    }

    @Test
    void returnTrueForValidTokenMatchingUser() {
        JwtToken validJwtToken = new JwtToken(
                createTestClaims(testUserId, "access", System.currentTimeMillis() - 10000, System.currentTimeMillis() + 3600000, List.of("USER")),
                "valid.jwt.token"
        );

        boolean isValid = jwtService.isTokenValid(validJwtToken, testUser);
        assertThat(isValid).isTrue();
    }

    @Test
    void returnFalseForTokenWithMismatchedUserId() {
        UUID otherUserId = UUID.randomUUID();
        JwtToken mismatchedJwtToken = new JwtToken(
                createTestClaims(otherUserId, "access", System.currentTimeMillis() - 10000, System.currentTimeMillis() + 3600000, List.of("USER")),
                "mismatched.jwt.token"
        );

        boolean isValid = jwtService.isTokenValid(mismatchedJwtToken, testUser);
        assertThat(isValid).isFalse();
    }

    @Test
    void returnFalseForExpiredToken() {
        JwtToken expiredJwtToken = new JwtToken(
                createTestClaims(testUserId, "access", System.currentTimeMillis() - 7200000, System.currentTimeMillis() - 3600000, List.of("USER")), // Issued 2 hours ago, expired 1 hour ago
                "expired.jwt.token"
        );

        boolean isValid = jwtService.isTokenValid(expiredJwtToken, testUser);
        assertThat(isValid).isFalse();
    }
}