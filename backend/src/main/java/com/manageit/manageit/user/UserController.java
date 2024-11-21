package com.manageit.manageit.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUser(
            @RequestHeader("Authorization") String token,
            @PathVariable String username
    ) {
        return ResponseEntity.ok(userService.findByUsername(token, username));
    }

    @PatchMapping("/update")
    public ResponseEntity<Boolean> updateUser(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UpdateUserRequest updatedUser
    ) {
        return ResponseEntity.ok(userService.updateUser(token, updatedUser));
    }

    @PostMapping("/search")
    public ResponseEntity<Object> searchUser(
            @RequestBody UserSearchRequest userSearchRequest
    ) {
        return ResponseEntity.ok(userService.searchUsers(userSearchRequest.getPattern(), userSearchRequest.getProjectId()));
    }
}

