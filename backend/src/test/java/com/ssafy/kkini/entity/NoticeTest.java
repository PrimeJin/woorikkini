package com.ssafy.kkini.entity;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NoticeTest {

    @Test
    @DisplayName("공지사항 생성되는지 확인 테스트")
    public void createNoticeTest() {
        //given
        Notice notice = Notice.builder().noticeTitle("제목1").noticeContent("내용1").build();

        //when
        //then
        Assertions.assertThat(notice.getNoticeTitle()).isEqualTo("제목1");
        Assertions.assertThat(notice.getNoticeContent()).isEqualTo("내용1");
    }


}