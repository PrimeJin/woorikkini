package com.ssafy.kkini.controller;

import com.ssafy.kkini.service.StatsService;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class StatsController {
    private StatsService statsService;

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    public StatsController(StatsService statsService){
        this.statsService =statsService;
    }

    @ApiOperation(value = "관리자 페이지 통계" ,notes = "성별, 나일, 키워드 통계를 반환한다.", response = Math.class)
    @GetMapping()
    public ResponseEntity<Map<String, Object>> stats(){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }


}
