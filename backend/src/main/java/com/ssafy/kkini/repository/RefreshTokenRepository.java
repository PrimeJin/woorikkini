package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    RefreshToken findByUserId(int userId);

    RefreshToken findByRefreshToken(String refreshToken);
    RefreshToken findByUserIdAndRefreshToken(int userId, String refreshToken);
}
