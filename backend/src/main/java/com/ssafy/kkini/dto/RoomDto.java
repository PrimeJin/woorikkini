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
public class RoomDto {
    private int roomId;
    private String roomTitle;
    private String roomContent;
    private String roomPrivate;
    private int roomLimitUser;

    private String roomPassword;
    private String roomPreset;
    private int roomRecentUser;
    private List<Integer> roomKeywordList;

    public RoomDto(Room room){
        this.roomId = room.getRoomId();
        this.roomTitle = room.getRoomTitle();
        this.roomContent = room.getRoomContent();
        this.roomPassword = room.getRoomPassword();
        this.roomKeywordList = room.getRoomKeywords().stream().map(keyword -> keyword.getKeywordId().getKeywordId()).collect(Collectors.toList());
        this.roomPrivate = room.getRoomPrivate();
        this.roomLimitUser = room.getRoomLimitUser();
        this.roomPreset = room.getRoomPreset();
        this.roomRecentUser = room.getRoomRecentUser();
    }
}
