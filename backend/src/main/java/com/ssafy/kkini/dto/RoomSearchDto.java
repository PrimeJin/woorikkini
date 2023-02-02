package com.ssafy.kkini.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
public class RoomSearchDto {
    @NotNull(message = "검색어 종류를 입력해주세요")
    private String subject;
    private String content;
}
