package com.manageit.manageit.controller;

import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.dto.user.UserResponseDto;
import com.manageit.manageit.user.UpdateUserRequest;
import com.manageit.manageit.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserResponseDto> getUser(
            @RequestHeader("Authorization") String token,
            @PathVariable String username
    ) {
        return ResponseEntity.ok(userService.findByUsername(token, username));
    }

    @PatchMapping()
    public ResponseEntity<Void> updateUser(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UpdateUserRequest updatedUser
    ) {
        userService.updateUser(token, updatedUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<BasicUserDto>> searchUser(
            @RequestParam("pattern") String pattern,
            @RequestParam(value = "projectId", required = false) UUID projectId
    ) {
        return ResponseEntity.ok(userService.searchUsers(pattern, projectId));
    }

}

