package com.manageit.manageit.feature.message.mapper;

import com.manageit.manageit.feature.message.dto.MessageResponseDto;
import com.manageit.manageit.feature.message.model.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(target = "sender", source = "user")
    @Mapping(target = "createdAt", source = "createdAt")
    MessageResponseDto toMessageDto(Message message);

    default String map(OffsetDateTime value) {
        return value != null ? value.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;
    }
}
