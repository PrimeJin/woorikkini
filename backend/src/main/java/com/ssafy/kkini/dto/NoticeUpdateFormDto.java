package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Notice;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class NoticeUpdateFormDto {
    private int noticeId;
    private String noticeTitle;
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
