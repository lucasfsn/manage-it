package com.manageit.manageit.feature.message.mapper;

import com.manageit.manageit.feature.message.dto.MessageResponseDto;
import com.manageit.manageit.feature.message.model.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(target = "sender", source = "user")
    MessageResponseDto toMessageDto(Message message);
}
