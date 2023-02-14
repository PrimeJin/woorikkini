package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserEmail(String email);

    Boolean existsByUserEmail(String email);

    Optional<User> findByUserEmailAndUserProviderId(String email, String providerId);

    User findByUserId(int userId);
    Optional<User> findAllByUserId(int userId);

    User findByUserNickname(String userNickname);

    int countAllByUserGender(String gender);

    int countByUserBirthYearBetween(int greater, int less);

    Optional<User> findByUserEmailAndUserProviderIsNull(String userEmail);
}
