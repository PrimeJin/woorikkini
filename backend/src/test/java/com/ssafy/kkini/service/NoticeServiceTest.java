package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.NoticeCreateFormDto;
import com.ssafy.kkini.dto.NoticeInfoDto;
import com.ssafy.kkini.dto.NoticeUpdateFormDto;
import com.ssafy.kkini.entity.Notice;
import com.ssafy.kkini.repository.NoticeRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.TestPropertySource;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestPropertySource(locations="classpath:application-test.yml")
class NoticeServiceTest {
    @InjectMocks
    private NoticeService noticeService;
    @Mock  //가짜 객체(Test 협력)
    private NoticeRepository noticeRepository;

//    @BeforeEach
//    public void setUp() {
//        noticeService = new NoticeService(noticeRepository);
//    }
    private Logger logger = LoggerFactory.getLogger(NoticeServiceTest.class);

    @Test
    @DisplayName("공지사항 생성 service 테스트")
    public void writeNotice() throws Exception {
        //given
        NoticeCreateFormDto createFormDto = new NoticeCreateFormDto("제목1", "내용1");
        Notice givenNotice = createFormDto.toEntity();
        when(noticeRepository.save(any())).thenReturn(createFormDto.toEntity());
        //when
        Notice compareNotice = noticeService.createNotice(createFormDto);
        //then
        Assertions.assertThat(givenNotice.getNoticeTitle()).isEqualTo(compareNotice.getNoticeTitle());
    }
    @Test
    @DisplayName("공지사항 상세 조회 service 테스트")
    public void getNotice() throws Exception {
        //given
        Notice notice = Notice.builder().noticeId(1).noticeTitle("제목1").noticeContent("내용1").build();
        when(noticeRepository.findById(any())).thenReturn(Optional.ofNullable((notice)));
        //when
        NoticeInfoDto compareNoticeDto = noticeService.getNotice(1);
        //then
        Assertions.assertThat(notice.getNoticeTitle()).isEqualTo(compareNoticeDto.getNoticeTitle());
    }

    @Test
    @DisplayName("공지사항 목록(리스트) service 테스트")
    public void getNoticeList() throws Exception {
        //given
        Notice notice1 = Notice.builder().noticeTitle("제목1").noticeContent("내용1").build();
        Notice notice2 = Notice.builder().noticeTitle("제목2").noticeContent("내용2").build();
        List<Notice> noticeList = new ArrayList<>();
        noticeList.add(notice1);
        noticeList.add(notice2);
        when(noticeRepository.findAll()).thenReturn(noticeList);
        //when
        List<Notice> compareNoticeList = noticeRepository.findAll();
        //then
        Assertions.assertThat(noticeList).isEqualTo(compareNoticeList);
    }
    @Test
    @DisplayName("공지사항 수정 service 테스트")
    public void updateNotice() throws Exception {
        //given
        Notice givenNotice = Notice.builder().noticeId(1).noticeTitle("제목1").noticeContent("내용1").build();
        NoticeUpdateFormDto updateFormDto = new NoticeUpdateFormDto(1,"수정된제목1","수정된내용1");
        Notice updatedNotice = updateFormDto.toEntity();
        when(noticeRepository.save(any())).thenReturn(updatedNotice);
        //when
        Notice compareNotice = noticeService.updateNotice(updateFormDto);
        //then
        logger.info("수정 전 공지사항(givenNotice) 제목: " + givenNotice.getNoticeTitle());
        logger.info("수정 후 공지사항(compareNotice) 제목: " + compareNotice.getNoticeTitle());
        Assertions.assertThat(givenNotice.getNoticeTitle()).isNotEqualTo(compareNotice.getNoticeTitle());
    }

    @Test
    @DisplayName("공지사항 삭제 service 테스트")
    public void deleteNotice() throws Exception {
        //given
        Notice notice = Notice.builder().noticeId(1).noticeTitle("제목1").noticeContent("내용1").build();
        //when
        doNothing().when(noticeRepository).deleteById(1);
        //then
        noticeService.deleteNotice(1);
        System.out.println(notice.getNoticeTitle());
        verify(noticeRepository, times(1)).deleteById(1);
    }
}