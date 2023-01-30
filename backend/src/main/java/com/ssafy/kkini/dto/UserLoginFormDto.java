package com.ssafy.kkini.dto;

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
public class UserLoginFormDto {

    @Email
    @NotNull(message = "이메일은 필수 입력 값입니다.")
    private String userEmail;
    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    private String userPassword;
}
