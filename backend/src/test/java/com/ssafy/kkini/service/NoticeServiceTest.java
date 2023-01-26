package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.NoticeCreateFormDto;
import com.ssafy.kkini.entity.Notice;
import com.ssafy.kkini.repository.NoticeRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.TestPropertySource;


//@SpringBootTest
@ExtendWith(MockitoExtension.class)
@TestPropertySource(locations="classpath:application-test.properties")
class NoticeServiceTest {
    @InjectMocks
    private NoticeService noticeService;
    @Mock  //가짜 객체(Test 협력)
    private NoticeRepository noticeRepository;

//    @BeforeEach
//    public void setUp() {
//        noticeService = new NoticeService(noticeRepository);
//    }

    @Test
    public void writeNotice() throws Exception {
        //given
        Notice givenNotice = Notice.builder().noticeTitle("제목1").noticeContent("내용1").build();
        //when
        NoticeCreateFormDto createFormDto = new NoticeCreateFormDto("제목1", "내용1");
        Notice compareNotice = noticeService.writeNotice(createFormDto);
        //then
        Assertions.assertThat(givenNotice.getNoticeTitle()).isEqualTo(compareNotice.getNoticeTitle());
    }
    @Test
    public void getNotice() throws Exception {

    }
    @Test
    public void getNoticeList() throws Exception {

    }
    @Test
    public void updateNotice() throws Exception {

    }
    @Test
    public void deleteNotice() throws Exception {

    }
}