package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomPasswordXDto {
    private int roomId;
    private String roomTitle;
    private String roomContent;
    private String roomPrivate;
    private int roomLimitUser;

    private String roomPreset;
    private int roomRecentUser;
    private List<Integer> roomKeywordList;

    public RoomPasswordXDto(Room room){
        System.out.println(room.getRoomKeywords());
        this.roomId = room.getRoomId();
        this.roomTitle = room.getRoomTitle();
        this.roomContent = room.getRoomContent();
        this.roomKeywordList = room.getRoomKeywords().stream().map(keyword -> keyword.getKeywordId().getKeywordId()).collect(Collectors.toList());
        this.roomPrivate = room.getRoomPrivate();
        this.roomLimitUser = room.getRoomLimitUser();
        this.roomPreset = room.getRoomPreset();
        this.roomRecentUser = room.getRoomRecentUser();
    }
}
