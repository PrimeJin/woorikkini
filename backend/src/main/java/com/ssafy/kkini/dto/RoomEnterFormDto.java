package com.ssafy.kkini.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
public class RoomEnterFormDto {
    @NotNull(message = "방 공개여부를 입력해주세요")
    private String roomPrivate;

    private String roomPassword;
}
