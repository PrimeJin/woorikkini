package com.ssafy.kkini.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class UserPasswordUpdateDto {
    private String userEmail;
    private String passwordCodeContent;

    @NotBlank
    private String userPassword;

    @NotBlank
    private String userPasswordCheck;

}
