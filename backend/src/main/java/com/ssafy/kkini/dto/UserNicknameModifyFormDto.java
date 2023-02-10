package com.ssafy.kkini.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotBlank;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserNicknameModifyFormDto {
    private int userId;
    @NotBlank(message = "닉네임은 필수 입력 값입니다.")
    private String userNickname;

}
