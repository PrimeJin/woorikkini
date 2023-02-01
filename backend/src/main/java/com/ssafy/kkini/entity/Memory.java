package com.ssafy.kkini.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.stereotype.Service;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MEMORY")
public class Memory extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT UNSIGNED")
    private Long memoryId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String memoryContent;
    private String memoryTitle;

    public void setUser(User user){
        this.user = user;
    }
    @Builder
    public Memory(User user, String title, String content){
        this.user = user;
        this.memoryTitle = title;
        this.memoryContent = content;

    }
}
