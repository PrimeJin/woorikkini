package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.PasswordCode;
import com.ssafy.kkini.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class PasswordCodeCreateDto {
    private int passwordCodeId;
    private String passwordCodeContent;
    private String passwordCodeUseYn;
    private LocalDateTime passwordCodeExpireDate;
    private User user;

    //dto -> entity
    public PasswordCode toEntity() {
        return PasswordCode.builder()
                .passwordCodeContent(passwordCodeContent)
                .passwordCodeExpireDate(passwordCodeExpireDate)
                .passwordCodeUseYn(passwordCodeUseYn)
                .user(user)
                .build();
    }
}
