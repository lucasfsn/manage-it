package com.manageit.manageit.mapper.user;

import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.user.User;
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
