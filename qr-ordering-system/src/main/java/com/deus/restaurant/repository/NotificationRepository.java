package com.deus.restaurant.repository;

import com.deus.restaurant.model.Notification;
import com.deus.restaurant.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientAndIsReadFalse(User recipient);

    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
}

