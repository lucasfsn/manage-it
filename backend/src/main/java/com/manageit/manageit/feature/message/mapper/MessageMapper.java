package com.manageit.manageit.feature.message.mapper;

import com.manageit.manageit.feature.message.dto.MessageDto;
import com.manageit.manageit.feature.user.mapper.BasicUserMapper;
import com.manageit.manageit.feature.message.model.Message;
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
