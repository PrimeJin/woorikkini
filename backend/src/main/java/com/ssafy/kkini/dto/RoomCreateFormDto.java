package com.ssafy.kkini.dto;


import com.ssafy.kkini.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomCreateFormDto {

    @NotNull(message = "방 제목을 입력해주세요.")
    private String roomTitle;
    private String roomContent;
    @NotNull(message = "방 공개여부를 입력해주세요")
    private String roomPrivate;

    private String roomPassword;

    @NotNull(message = "방 프리셋을 입력해주세요")
    private String roomPreset;

    private List<Integer> roomKeywordList;

    @NotNull(message = "방 인원수를 입력해주세요")
    private Integer roomLimitUser;

    private String sessionId;

    // entity 반환
    public Room toEntity() {
        return Room.builder()
                .roomTitle(roomTitle)
                .roomContent(roomContent)
                .roomPrivate(roomPrivate)
                .roomPassword(roomPassword)
                .roomKeywords(new ArrayList<>())
                .roomPreset(roomPreset)
                .sessionId(sessionId)
                .roomLimitUser(roomLimitUser)
                .build();
    }


}
