package com.manageit.manageit.feature.user.mapper;

import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.feature.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BasicUserMapper {

    public BasicUserDto toBasicUserDto(User user) {
        return BasicUserDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getName())
                .build();
    }
}
