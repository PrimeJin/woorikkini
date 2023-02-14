package com.ssafy.kkini.controller;

import com.ssafy.kkini.dto.ReportCreateFormDto;
import com.ssafy.kkini.dto.ReportListDto;
import com.ssafy.kkini.entity.Report;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.service.ReportService;
import com.ssafy.kkini.service.TokenProviderService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    private ReportService reportService;
    private TokenProviderService tokenProviderService;

    public ReportController(ReportService reportService, TokenProviderService tokenProviderService) {
        this.reportService = reportService;
        this.tokenProviderService = tokenProviderService;
    }

    private static final String MESSAGE = "message";
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    @ApiOperation(value = "신고 등록", notes = "신고 내역에 저장, 피신고자 신고당한횟수 +1 시키기")
    @PostMapping()
    public ResponseEntity<Map<String, Object>> report(@Valid @ApiParam(value = "신고 작성 정보") @RequestBody ReportCreateFormDto reportCreateFormDto) {
        Map<String, Object> map = new HashMap<>();
        if(reportService.createReport(reportCreateFormDto) != null) {
            map.put(MESSAGE, SUCCESS);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } else {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }

    @ApiOperation(value = "신고내역 목록", notes = "신고내역 목록 불러오기")
    @GetMapping()
    public ResponseEntity<Map<String, Object>> getReportList() {
        Map<String, Object> map = new HashMap<>();
        try {
            List<ReportListDto> reportListDto = reportService.getReportList();
            map.put(MESSAGE, SUCCESS);
            map.put("reportList", reportListDto);
            map.put("totalSize", reportListDto.size());
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } catch(Exception e) {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }

    @ApiOperation(value = "활동 정지시키기", notes = "선택한 신고내역의 피신고자 활동 정지시키기")
    @GetMapping("/suspend")
    public ResponseEntity<Map<String, Object>> userSuspend(@ApiParam(value = "신고내역번호") @RequestParam int reportId) {
        Map<String, Object> map = new HashMap<>();
        Report report = reportService.getReportByReportId(reportId);
        int userId = 0;  //report가 null일 때를 대비해 없는 유저아이디로 초기화
        if(report != null) {
            userId = report.getReportedUser().getUserId();
        }
        //활동정지
        User user = reportService.userSuspend(userId);
        if(user != null) {
            //로그아웃 처리
            tokenProviderService.deleteRefreshToken(userId);
            map.put(MESSAGE, SUCCESS);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } else {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }

}
