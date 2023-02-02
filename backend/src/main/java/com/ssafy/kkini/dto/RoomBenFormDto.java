package com.ssafy.kkini.dto;


import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class RoomBenFormDto {
    @NotNull(message = "방 번호를 입력해주세요")
    private Integer roomId;
    @NotNull(message = "유저 아이디를 입력해주세요")
    private Integer userId;

}
