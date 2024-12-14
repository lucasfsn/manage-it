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
                .id(message.getId())
                .sender(basicUserMapper.toBasicUserDto(message.getUser()))
                .content(message.getContent())
                .createdAt(message.getCreatedAt().toString())
                .build();
    }
}
