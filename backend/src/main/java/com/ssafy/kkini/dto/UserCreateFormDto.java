package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.User;
import lombok.*;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserCreateFormDto {
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
    private String userBirth;

    public User toEntity() {
        return User.builder()
                .userName(userName)
                .userPassword(userPassword)
                .userEmail(userEmail)
                .userNickname(userNickname)
                .userGender(userGender)
                .userBirthYear(Integer.parseInt(userBirth))
                .build();
    }

}
