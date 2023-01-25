package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.BaseEntity;
import com.ssafy.kkini.entity.Notice;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class NoticeInfoDto {
    private int noticeId;
    private String noticeTitle;
    private String noticeContent;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    //entity -> dto
    public NoticeInfoDto(Notice entity) {
        this.noticeId = entity.getNoticeId();
        this.noticeTitle = entity.getNoticeTitle();
        this.noticeContent = entity.getNoticeContent();
        this.createdTime = entity.getCreatedTime();
        this.updatedTime = entity.getUpdatedTime();
    }
}
