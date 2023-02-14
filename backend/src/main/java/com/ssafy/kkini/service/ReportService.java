package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.ReportCreateFormDto;
import com.ssafy.kkini.dto.ReportListDto;
import com.ssafy.kkini.dto.UserInfoDto;
import com.ssafy.kkini.entity.Report;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.ReportRepository;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    private ReportRepository reportRepository;
    private UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    //신고당한횟수 +1시키기
    public void plusReportedCount(int reportedUser) {
        User reportedUserInfo = userRepository.findByUserId(reportedUser);
        UserInfoDto userInfoDto = new UserInfoDto(reportedUserInfo);
        userInfoDto.setUserReportedCount(userInfoDto.getUserReportedCount() + 1);
        userRepository.save(userInfoDto.toEntity());
    }

    @Transactional
    //신고하기 (저장)
    public Report createReport(ReportCreateFormDto reportCreateFormDto) {
        User reportedUser = userRepository.findByUserId(reportCreateFormDto.getReportedUserId());
        reportCreateFormDto.setReportedUser(reportedUser);
        this.plusReportedCount(reportCreateFormDto.getReportedUserId());
        return reportRepository.save(reportCreateFormDto.toEntity());
    }

    //신고내역 목록
    public List<ReportListDto> getReportList() {
        List<Report> reportList = reportRepository.findAll();
        List<ReportListDto> reportListDto = new ArrayList<>();
        for(Report x : reportList) {
            ReportListDto reportDto = new ReportListDto();
            reportDto.setReportId(x.getReportId());
            reportDto.setCreatedTime(x.getCreatedTime());
            reportDto.setReportCategory(x.getReportCategory());
            reportDto.setReportContent(x.getReportContent());

            User user = x.getReportedUser();
            reportDto.setReportedUser(user.getUserEmail());
            reportDto.setReportedCount(user.getUserReportedCount());
            if(user.getUserActivation().isAfter(LocalDateTime.now())) {
                reportDto.setUserActivation("활동정지");
            }

            reportListDto.add(reportDto);
        }
        return reportListDto;
    }

    @Transactional
    //활동정지 시키기
    public User userSuspend(int userId) {
        User user = userRepository.findByUserId(userId);
        if(user != null) {
            UserInfoDto userInfoDto = new UserInfoDto(user);
            userInfoDto.setUserActivation(LocalDateTime.now().plusDays(7));
            return userRepository.save(userInfoDto.toEntity());
        } else {
            return null;
        }
    }

    public Report getReportByReportId(int reportId) {
        Optional<Report> report = reportRepository.findById(reportId);
        Report reportEntity = null;
        if(report.isPresent()) {
            reportEntity = report.get();
        }
        return reportEntity;
    }
}
