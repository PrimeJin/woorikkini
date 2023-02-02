package com.ssafy.kkini.repository;
import com.ssafy.kkini.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserEmail(String userEmail);

    Boolean existsByUserEmail(String userEmail);

    Optional<User> findByUserEmailAndUserProviderId(String userEmail, String userProviderId);

    User findByUserId(int userId);

}
