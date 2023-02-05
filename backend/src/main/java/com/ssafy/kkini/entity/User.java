package com.ssafy.kkini.entity;

import com.ssafy.kkini.dto.AuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "USER")
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
    public User(int userId, String userEmail, String userName, String userPassword,String userNickname,String userGender,Timestamp userActivation, int userBirthYear, AuthProvider userProvider,String userProviderId){
        this.userId = userId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userNickname = userNickname;
        this.userGender = userGender;
        this.userActivation = userActivation;
        this.userRole = "ROLE_USER";
        this.userBirthYear = userBirthYear;
        this.userProvider = userProvider;
        this.userProviderId = userProviderId;
    }

    public void changeNickname(String nickname) {
        this.userNickname = nickname;
    }

    public void changePassword(String password){
        this.userPassword = password;
    }
}
