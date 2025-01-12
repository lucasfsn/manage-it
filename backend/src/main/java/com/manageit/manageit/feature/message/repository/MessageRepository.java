package com.manageit.manageit.feature.message.repository;

import com.manageit.manageit.feature.message.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
}
