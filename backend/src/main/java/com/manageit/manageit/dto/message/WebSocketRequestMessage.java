package com.manageit.manageit.dto.message;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class WebSocketRequestMessage extends MessageDto{
    private String token;
}
