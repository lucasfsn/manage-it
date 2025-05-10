package com.manageit.manageit.feature.user.controller;

import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.dto.UpdateUserRequest;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @AuthenticationPrincipal User userDetails,
            @PathVariable String username
    ) {
        return ResponseEntity.ok(userService.findByUsername(userDetails, username));
    }

    @PatchMapping()
    public ResponseEntity<UserResponseDto> updateUser(
            @AuthenticationPrincipal User userDetails,
            @Valid @RequestBody UpdateUserRequest updatedUser
    ) {
        UserResponseDto updatedUserData = userService.updateUser(userDetails, updatedUser);
        return ResponseEntity.ok(updatedUserData);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BasicUserDto>> searchUser(
            @RequestParam("pattern") String pattern,
            @RequestParam(value = "projectId", required = false) UUID projectId,
            @RequestParam(value = "taskId", required = false) UUID taskId
    ) {
        return ResponseEntity.ok(userService.searchUsers(pattern, projectId, taskId));
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteUser(
            @AuthenticationPrincipal User userDetails
    ) {
        userService.removeUser(userDetails);
        return ResponseEntity.noContent().build();
    }

}

