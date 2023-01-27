package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Notice;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@DataJpaTest
//@TestPropertySource(locations="classpath:application-test.properties")
class NoticeRepositoryTest {

    @Autowired
    NoticeRepository noticeRepository;

    @Test
    @DisplayName("공지사항 생성 repository 테스트")
    public void createNoticeTest() {
        //given
        Notice notice1 = Notice.builder().noticeTitle("제목1").noticeContent("내용1").build();
        Notice notice2 = Notice.builder().noticeTitle("제목2").noticeContent("내용2").build();
        //when
        Notice result1 = noticeRepository.save(notice1);
        Notice result2 = noticeRepository.save(notice2);
        //then
        Assertions.assertThat(result1.getNoticeTitle()).isEqualTo(notice1.getNoticeTitle());
        Assertions.assertThat(result2.getNoticeContent()).isEqualTo(notice2.getNoticeContent());
    }

    @Test
    @DisplayName("공지사항 목록(리스트) 반환 repository 테스트")
    public void getNoticeList() {
        //given
        Notice notice1 = Notice.builder().noticeTitle("제목1").noticeContent("내용1").build();
        Notice notice2 = Notice.builder().noticeTitle("제목2").noticeContent("내용2").build();
        noticeRepository.save(notice1);
        noticeRepository.save(notice2);
        //when
        List<Notice> noticeList = noticeRepository.findAll();
        //then
        Assertions.assertThat(noticeList.size()).isEqualTo(2);
    }
}