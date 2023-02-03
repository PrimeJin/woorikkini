package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.AuthCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthCodeUpdateDto {
    private int authCodeId;
    private String authCodeContent;
    private String authCodeUseYn;
    private LocalDateTime authCodeExpireDate;

    //entity -> dto
    public AuthCodeUpdateDto(AuthCode entity) {
        this.authCodeId = entity.getAuthCodeId();
        this.authCodeContent = entity.getAuthCodeContent();
        this.authCodeUseYn = entity.getAuthCodeUseYn();
        this.authCodeExpireDate = entity.getAuthCodeExpireDate();
    }

    //dto -> entity
    public AuthCode toEntity() {
        return AuthCode.builder()
                .authCodeId(authCodeId)
                .authCodeContent(authCodeContent)
                .authCodeUseYn(authCodeUseYn)
                .authCodeExpireDate(authCodeExpireDate)
                .build();
    }
}
