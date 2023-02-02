package com.ssafy.kkini.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "auth_code")
public class AuthCode extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int authCodeId;

    private String authCodeContent;

    private String authCodeUseYn = "N";

    private LocalDateTime authCodeExpireDate;

    private String authCodeUserEmail;

    @Builder
    public AuthCode(int authCodeId, String authCodeContent, String authCodeUseYn, LocalDateTime authCodeExpireDate, String authCodeUserEmail) {
        this.authCodeId = authCodeId;
        this.authCodeContent = authCodeContent;
        this.authCodeUseYn = authCodeUseYn;
        this.authCodeExpireDate = authCodeExpireDate;
        this.authCodeUserEmail = authCodeUserEmail;
    }

}
