package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UserInfoDto {
    private int userId;

    private String userName;

    private String userEmail;

    private String userPassword;

    private String userRole;

    private String userNickname;

    private int userBirthYear;

    private String userGender;

    private LocalDateTime userActivation;

    private AuthProvider userProvider;

    private String userProviderId;

    private int userReportedCount;

    //entity -> dto
    public UserInfoDto(User entity) {
        this.userId = entity.getUserId();
        this.userName = entity.getUserName();
        this.userEmail = entity.getUserEmail();
        this.userPassword = entity.getUserPassword();
        this.userRole = entity.getUserRole();
        this.userNickname = entity.getUserNickname();
        this.userBirthYear = entity.getUserBirthYear();
        this.userGender = entity.getUserGender();
        this.userActivation = entity.getUserActivation();
        this.userProvider = entity.getUserProvider();
        this.userProviderId = entity.getUserProviderId();
        this.userReportedCount = entity.getUserReportedCount();
    }

    //dto -> entity
    public User toEntity() {
        return User.builder()
                .userId(userId)
                .userName(userName)
                .userEmail(userEmail)
                .userPassword(userPassword)
                .userNickname(userNickname)
                .userBirthYear(userBirthYear)
                .userGender(userGender)
                .userActivation(userActivation)
                .userProvider(userProvider)
                .userProviderId(userProviderId)
                .userReportedCount(userReportedCount)
                .build();
    }


}
