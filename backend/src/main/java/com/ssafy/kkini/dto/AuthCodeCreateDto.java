package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.AuthCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AuthCodeCreateDto {
    private int authCodeId;
    private String authCodeContent;
    private String authCodeUseYn;
    private LocalDateTime authCodeExpireDate;
    private String authCodeUserEmail;

    //dto -> entity
    public AuthCode toEntity() {
        return AuthCode.builder()
                .authCodeContent(authCodeContent)
                .authCodeExpireDate(authCodeExpireDate)
                .authCodeUseYn(authCodeUseYn)
                .authCodeUserEmail(authCodeUserEmail)
                .build();
    }
}
