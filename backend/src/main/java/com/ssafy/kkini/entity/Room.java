package com.ssafy.kkini.entity;

import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@DynamicInsert
@Builder
@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "room")
public class Room {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private int roomId;

    @Column(length = 50)
    @NotNull
    private String roomTitle;

    @Column(length = 50)
    private String roomContent;

    @Column( length = 5)
    @ColumnDefault("'false'")
    @NotNull
    private String roomPrivate;

    @Column(length = 10)
    private String roomPassword;

    @NotNull
    private int roomLimitUser;

    private String roomPreset;

    @ColumnDefault("1")
    @Builder.Default
    private int roomRecentUser = 1;

    private String sessionId;

    @OneToMany(mappedBy = "roomId")
    private List<RoomKeyword> roomKeywords =  new ArrayList<RoomKeyword>();

}
