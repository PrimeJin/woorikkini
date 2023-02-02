package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserCreateFormDto {
    private String userName;
    private String userEmail;
    private String userPassword;
    private String userNickname;
    private String userGender;
    private int userBirth;

    public User toEntity() {
        return User.builder()
                .userName(userName)
                .userPassword(userPassword)
                .userName(userName)
                .userNickname(userNickname)
                .userGender(userGender)
                .userBirthYear(userBirth)
                .build();
    }

}
