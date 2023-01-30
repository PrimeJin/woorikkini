package com.ssafy.kkini.entity;
import com.ssafy.kkini.dto.AuthProvider;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;


@Getter
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "USER")
public class User {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "user_name", length = 30)
    private String name;

    @Column(name = "user_email", length = 30)
    private String email;

    @Column(name = "user_password", length = 100)
    private String password;

    @Column(name = "user_role", length = 10)
    private String role;

    @Column(name = "user_nickname", length = 30)
    private String nickname;

    @Column(name = "user_birth_year", length = 10)
    private int birthYear;

    @Column(name = "user_gender", length = 5)
    private String gender;

    @CreationTimestamp
    @Column(name = "user_activation")
    private Timestamp activation;

    @CreationTimestamp
    @Column(name = "user_join_date")
    private Timestamp joinDate;

    @Column(name = "user_provider", length = 20)
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;
    @Column(name = "user_provider_id")
    private String providerId;

    @Column(name = "user_reported")
    @ColumnDefault("0")
    private int reported;

    @Builder
    public User(String email, String name, String password,String nickname,String gender, int birthYear,AuthProvider provider,String providerId){
        this.email = email;
        this.name = name;
        this.password = password;
        this.nickname = nickname;
        this.gender = gender;
        this.role = "ROLE_USER";
        this.birthYear = birthYear;
        this.provider = provider;
        this.providerId = providerId;
    }


    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changePassword(String password){
        this.password = password;
    }
}
