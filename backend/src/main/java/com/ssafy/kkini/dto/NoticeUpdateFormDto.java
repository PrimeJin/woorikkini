package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Notice;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NoticeUpdateFormDto {
    private int noticeId;
    @NotBlank(message = "제목은 필수 입력 값입니다.")
    private String noticeTitle;
    @NotNull(message = "내용은 필수 입력 값입니다.")
    private String noticeContent;

    //dto -> entity
    public Notice toEntity() {
        return Notice.builder()
                .noticeId(noticeId)
                .noticeTitle(noticeTitle)
                .noticeContent(noticeContent)
                .build();
    }
}
