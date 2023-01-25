package com.ssafy.kkini.dto;


import com.ssafy.kkini.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinFormDto {
    private String userName;

    private String userEmail;
    private String userPassword;
    private String userNickname;
    private String userGender;

}
