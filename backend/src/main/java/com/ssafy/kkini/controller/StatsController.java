package com.ssafy.kkini.controller;

import com.ssafy.kkini.dto.StatsGetDto;
import com.ssafy.kkini.service.StatsService;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    private StatsService statsService;

    private static final String MESSAGE = "message";
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    public StatsController(StatsService statsService){
        this.statsService =statsService;
    }

    @ApiOperation(value = "관리자 페이지 통계" ,notes = "성별, 나이, 키워드 통계를 반환한다.", response = Math.class)
    @GetMapping()
    public ResponseEntity<Map<String, Object>> stats(){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;


        List<StatsGetDto> genderStatsList = statsService.getGenderStats();
        List<StatsGetDto> ageStatsList = statsService.getAgeStats();
        List<StatsGetDto> keywordStatsList = statsService.getKeywordStats();

        if(!genderStatsList.isEmpty() && !ageStatsList.isEmpty() && !keywordStatsList.isEmpty()){
            resultMap.put("genderStatsList",genderStatsList);
            resultMap.put("ageStatsList",ageStatsList);
            resultMap.put("keywordStatsList",keywordStatsList);
            resultMap.put(MESSAGE, SUCCESS);
            status = HttpStatus.ACCEPTED;
        }else{
            resultMap.put(MESSAGE, FAIL);
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }


}
