package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Notice;
import com.ssafy.kkini.entity.Room;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Getter
@NoArgsConstructor
public class RoomDetailDto {
    private String roomTitle;
    private String roomContent;

    public RoomDetailDto(Room room) {
        this.roomTitle = room.getRoomTitle();
        this.roomContent = room.getRoomContent();
    }
}
