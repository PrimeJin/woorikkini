package com.ssafy.kkini.entity;
import com.ssafy.kkini.dto.AuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Builder
@Data
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "USER"
//        , uniqueConstraints = {
//        @UniqueConstraint(columnNames = "email")}
)
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

}
