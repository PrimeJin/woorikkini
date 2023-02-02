package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomPasswordXDto {
    private int roomId;
    private String roomTitle;
    private String roomContent;
    private String roomPrivate;
    private int roomLimitUser;

    private int roomPreset;
    private int roomRecentUser;

    public RoomPasswordXDto(Room room){
        this.roomId = room.getRoomId();
        this.roomTitle = room.getRoomTitle();
        this.roomContent = room.getRoomContent();
        this.roomPrivate = room.getRoomPrivate();
        this.roomLimitUser = room.getRoomLimitUser();
        this.roomPreset = room.getRoomPreset();
        this.roomRecentUser = room.getRoomRecentUser();
    }
}
