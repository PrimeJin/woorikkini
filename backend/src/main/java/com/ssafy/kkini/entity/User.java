package com.ssafy.kkini.entity;

import com.ssafy.kkini.dto.AuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.LocalDateTime;

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

    @Column(length = 30)
    private String userName;

    @Column(length = 30)
    @NotNull
    private String userEmail;

    private String userPassword;

    @Column(length = 10)
    private String userRole;

    @Column(length = 50)
    private String userNickname;
    
    private int userBirthYear;

    @Column(length = 6)
    private String userGender;

    @CreatedDate  //@CreationTimeStamp -> @CreatedDate로 변경
    private LocalDateTime userActivation;

    @Enumerated(EnumType.STRING)
    @Column(length = 6)
    private AuthProvider userProvider;

    private String userProviderId;

    @ColumnDefault("0")
    private int userReportedCount;
    @Builder
    public User(int userId, String userEmail, String userName, String userPassword,String userNickname,String userGender,LocalDateTime userActivation, int userBirthYear, AuthProvider userProvider,String userProviderId, int userReportedCount){
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
        this.userReportedCount = userReportedCount;
    }

    public void changeNickname(String nickname) {
        this.userNickname = nickname;
    }

    public void changePassword(String password){
        this.userPassword = password;
    }
}
