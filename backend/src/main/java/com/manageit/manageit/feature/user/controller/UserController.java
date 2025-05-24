package com.manageit.manageit.feature.user.controller;

import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.dto.UserDetailsResponseDto;
import com.manageit.manageit.feature.user.dto.UpdateUserRequestDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.service.UserService;
import com.manageit.manageit.shared.dto.ResponseDto;
import com.manageit.manageit.shared.enums.SuccessCode;
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
    public ResponseDto<UserDetailsResponseDto> getUser(
            @AuthenticationPrincipal User userDetails,
            @PathVariable String username
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "User found successfully",
                userService.findByUsername(userDetails, username)
        );
    }

    @PatchMapping()
    public ResponseDto<UserDetailsResponseDto> updateUser(
            @AuthenticationPrincipal User userDetails,
            @Valid @RequestBody UpdateUserRequestDto updatedUser
    ) {
        return new ResponseDto<>(
                SuccessCode.RESOURCE_UPDATED,
                "User updated successfully",
                userService.updateUser(userDetails, updatedUser)
        );
    }

    @GetMapping("/search")
    public ResponseDto<List<UserResponseDto>> searchUser(
            @RequestParam("pattern") String pattern,
            @RequestParam(value = "projectId", required = false) UUID projectId,
            @RequestParam(value = "taskId", required = false) UUID taskId
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "Users found successfully",
                userService.searchUsers(pattern, projectId, taskId)
        );
    }

    @DeleteMapping()
    public ResponseEntity<ResponseDto<Void>> deleteUser(
            @AuthenticationPrincipal User userDetails
    ) {
        userService.removeUser(userDetails);
        return ResponseEntity.ok(
                new ResponseDto<>(
                        SuccessCode.RESOURCE_DELETED,
                        "User deleted successfully",
                        null
                )
        );
    }

}

