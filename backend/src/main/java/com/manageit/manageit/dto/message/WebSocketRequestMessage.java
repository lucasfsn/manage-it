package com.manageit.manageit.dto.message;

import com.manageit.manageit.dto.user.BasicUserDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class WebSocketRequestMessage{
    private String token;
    private String content;
}
