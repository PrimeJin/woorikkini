package com.ssafy.kkini.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserListDto {
    private int userId;

    private String userName;

    private String userNickname;

    private String userEmail;

    private int userBirthYear;

    private String userGender;  //남자, 여자, 선택안함

    private LocalDateTime createdTime;

    private String userActivation;  //활동정지
}
