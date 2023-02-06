package com.ssafy.kkini.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Getter
@Setter
@Entity
@DynamicInsert
@NoArgsConstructor
@Table(name = "MEMORY")
public class Memory extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "memory_id",columnDefinition = "INT UNSIGNED")
    private int memoryId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;
    private String memoryContent;
    private String memoryTitle;

    public void setUser(User user){
        this.user = user;
    }
    @Builder
    public Memory(int memoryId, User user, String title, String content){
        this.memoryId = memoryId;
        this.user = user;
        this.memoryTitle = title;
        this.memoryContent = content;

    }
}
