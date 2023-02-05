package com.ssafy.kkini.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "password_code")
public class PasswordCode extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int passwordCodeId;

    private String passwordCodeContent;

    private String passwordCodeUseYn = "N";

    private LocalDateTime passwordCodeExpireDate;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @Builder
    public PasswordCode(int passwordCodeId, String passwordCodeContent, String passwordCodeUseYn, LocalDateTime passwordCodeExpireDate, User user) {
        this.passwordCodeId = passwordCodeId;
        this.passwordCodeContent = passwordCodeContent;
        this.passwordCodeUseYn = passwordCodeUseYn;
        this.passwordCodeExpireDate = passwordCodeExpireDate;
        this.user = user;
    }
}

