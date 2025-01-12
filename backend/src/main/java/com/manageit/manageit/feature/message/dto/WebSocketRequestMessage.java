package com.manageit.manageit.feature.message.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class WebSocketRequestMessage{
    private String token;
    private String content;
}
