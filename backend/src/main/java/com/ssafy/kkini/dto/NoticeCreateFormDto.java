package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Notice;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NoticeCreateFormDto {
    private String noticeTitle;
    private String noticeContent;

    //dto -> entity
    public Notice toEntity() {
        return Notice.builder()
                .noticeTitle(noticeTitle)
                .noticeContent(noticeContent)
                .build();
    }
}
