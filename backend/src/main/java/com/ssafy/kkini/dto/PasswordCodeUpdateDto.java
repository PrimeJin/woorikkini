package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.PasswordCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PasswordCodeUpdateDto {
    private int passwordCodeId;
    private String passwordCodeContent;
    private String passwordCodeUseYn;
    private LocalDateTime passwordCodeExpireDate;

    //entity -> dto
    public PasswordCodeUpdateDto(PasswordCode entity) {
        this.passwordCodeId = entity.getPasswordCodeId();
        this.passwordCodeContent = entity.getPasswordCodeContent();
        this.passwordCodeUseYn = entity.getPasswordCodeUseYn();
        this.passwordCodeExpireDate = entity.getPasswordCodeExpireDate();
    }

    //dto -> entity
    public PasswordCode toEntity() {
        return PasswordCode.builder()
                .passwordCodeId(passwordCodeId)
                .passwordCodeContent(passwordCodeContent)
                .passwordCodeUseYn(passwordCodeUseYn)
                .passwordCodeExpireDate(passwordCodeExpireDate)
                .build();
    }
}
