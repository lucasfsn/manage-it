package com.manageit.manageit.user;

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
            @PathVariable String username
    ) {
        return ResponseEntity.ok(userService.findByUsername(username));
    }

    @PatchMapping("/update")
    public ResponseEntity<Boolean> updateUser(
            @RequestHeader("Authorization") String token,
            @RequestBody UpdateUserRequest updatedUser
    ) {
        return ResponseEntity.ok(userService.updateUser(token, updatedUser));
    }
}

