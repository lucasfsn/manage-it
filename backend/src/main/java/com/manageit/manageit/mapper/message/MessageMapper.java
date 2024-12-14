package com.manageit.manageit.mapper.message;

import com.manageit.manageit.dto.message.MessageDto;
import com.manageit.manageit.mapper.user.BasicUserMapper;
import com.manageit.manageit.model.message.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageMapper {

    private final BasicUserMapper basicUserMapper;

    public MessageDto toMessageDto(Message message) {
        return MessageDto.builder()
                .user(basicUserMapper.toBasicUserDto(message.getUser()))
                .chatId(message.getChat().getId())
                .message(message.getMessage())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
