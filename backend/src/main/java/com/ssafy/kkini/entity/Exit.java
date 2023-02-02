package com.ssafy.kkini.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Builder
@Getter
@DynamicInsert
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exit_user")
@IdClass(ExitId.class)
public class Exit {
    @Id // primary key
    @Column(name = "outcaster")
    private int outcaster;

    @Id
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "room_id")
    private Room roomId;
}
