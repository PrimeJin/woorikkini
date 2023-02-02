package com.ssafy.kkini.entity;

import com.ssafy.kkini.dto.AuthProvider;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
@NoArgsConstructor
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    private String userName;

    private String userEmail;

    private String userPassword;

    private String userRole;

    private String userNickname;

    private int userBirthYear;

    private String userGender;

    @CreationTimestamp
    private Timestamp userActivation;

    @Enumerated(EnumType.STRING)
    private AuthProvider userProvider;

    private String userProviderId;

    @ColumnDefault("0")
    private int userReported;
    @Builder
    public User(String userEmail, String userName, String userPassword,String userNickname,String userGender, int userBirthYear, AuthProvider userProvider,String userProviderId){
        this.userEmail = userEmail;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userNickname = userNickname;
        this.userGender = userGender;
        this.userRole = "ROLE_USER";
        this.userBirthYear = userBirthYear;
        this.userProvider = userProvider;
        this.userProviderId = userProviderId;
    }


}
