package com.ssafy.kkini.dto;


import com.ssafy.kkini.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinFormDto {
    @NotBlank(message = "이름은 필수 입력 값입니다.")
    private String userName;

    @Email
    @NotNull(message = "이메일은 필수 입력 값입니다.")
    private String userEmail;
    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    private String userPassword;
    @NotBlank(message = "닉네임은 필수 입력 값입니다.")
    private String userNickname;
    private String userGender;
    @NotBlank(message = "생년월일은 필수 입력 값입니다.")
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

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }
}
