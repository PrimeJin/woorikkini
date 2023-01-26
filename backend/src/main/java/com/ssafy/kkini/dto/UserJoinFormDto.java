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
    private int userBirth;

    public User toEntity(){
//        return new User(this.userEmail, this.userName,this.userPassword,this.userNickname,this.userGender);
        return User.builder().email(this.userEmail)
                .password(this.userPassword)
                .name(this.userName)
                .nickname(this.userNickname)
                .gender(this.userGender)
                .birthYear(this.userBirth).build();
    }

}
