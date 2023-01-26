package com.ssafy.kkini.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserNicknameModifyFormDto {
    private Long userId;
    private String userNickname;

}
