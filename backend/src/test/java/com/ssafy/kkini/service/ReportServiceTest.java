package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.ReportCreateFormDto;
import com.ssafy.kkini.dto.UserCreateFormDto;
import com.ssafy.kkini.dto.UserInfoDto;
import com.ssafy.kkini.entity.Report;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.ReportRepository;
import com.ssafy.kkini.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestPropertySource(locations="classpath:application-test.yml")
public class ReportServiceTest {
    @InjectMocks
    private ReportService reportService;
    @InjectMocks
    private UserService userService;

    @Mock
    private ReportRepository reportRepository;
    @Mock
    private UserRepository userRepository;

    private Logger logger = LoggerFactory.getLogger(ReportServiceTest.class);

    @Test
    @DisplayName("신고당한 횟수 1증가 테스트")
    public void plusReportedCount() {
        //given
        User user1 = new User(1, "테스트이름1", "test1@gmail.com", "qlqjs123", "ROLE_USER", "테스트닉네임1", LocalDateTime.now(), 1998, null, null, 0);
        User user2 = new User(2, "테스트이름2", "test2@gmail.com", "qlqjs123", "ROLE_USER", "테스트닉네임2", LocalDateTime.now(), 1998, null, null, 0);
        Report givenReport = new Report(1, user1.getUserId(), user2, "욕했어요", "욕설");
        //신고 당했을 때 카운트+1처리
        UserInfoDto userInfoDto = new UserInfoDto(user2);
        userInfoDto.setUserReportedCount(1);
        when(reportRepository.save(any())).thenReturn(givenReport);
        when(userRepository.findByUserId(anyInt())).thenReturn(userInfoDto.toEntity());
        //when
        Report report = reportRepository.save(givenReport);
//        if(report.getReportedUser() == 2) {
//            reportService.plusReportedCount(user2.getUserId());
//        }
//        //then
//        Assertions.assertThat(user2.getUserReportedCount() + 1).isEqualTo(after);
    }

    @Test
    @DisplayName("신고하기 (신고내역 저장)")
    public void createReport() {
        //테스트용 유저 만들기
        UserCreateFormDto user1 = new UserCreateFormDto("테스트이름1", "password123", "test1@naver.com", "테스트닉네임1", "male", 1998);
        UserCreateFormDto user2 = new UserCreateFormDto("테스트이름2", "password123", "test2@naver.com", "테스트닉네임2", "female", 1998);
        userService.createUser(user1);
        userService.createUser(user2);
        //given
        ReportCreateFormDto reportCreateFormDto = new ReportCreateFormDto(1,2,"욕했어요","욕설",null);
        Report givenReport = reportCreateFormDto.toEntity();
        when(reportRepository.save(any())).thenReturn(reportCreateFormDto.toEntity());
        when(userRepository.findByUserId(anyInt())).thenReturn(user2.toEntity());
        //when
        Report compareReport = reportService.createReport(reportCreateFormDto);
        //then
        Assertions.assertThat(givenReport.getReportContent()).isEqualTo(compareReport.getReportContent());
    }

}
