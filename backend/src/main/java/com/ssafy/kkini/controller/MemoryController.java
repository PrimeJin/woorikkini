package com.ssafy.kkini.controller;

import com.ssafy.kkini.entity.Memory;
import com.ssafy.kkini.dto.MemoryCreateFormDto;
import com.ssafy.kkini.entity.Photo;
import com.ssafy.kkini.service.MemoryService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/memory")
public class MemoryController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    @Autowired
    private MemoryService memoryService;

    @ApiOperation(value = "추억카드 등록", notes = "추억카드 등록", response = MemoryCreateFormDto.class)
    @PostMapping()
    public ResponseEntity<Map<String,Object>> createMemory(@Valid @RequestBody @ApiParam(value = "추억 제목,내용, 사진",required = true,example = "0")
                                                     MemoryCreateFormDto memoryCreateFormDto){
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        Memory createMemory = memoryService.createMemory(memoryCreateFormDto);
//        if(!memoryCreateFormDto.getMemoryImgFiles().isEmpty()){
//            // 파일 이름을 업로드 한 날짜로 바꾸어서 저장할 것이다
//            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
//            String current_date = simpleDateFormat.format(new Date());
//
//        }
//        Photo createPhoto = memoryService.createPhoto(memoryCreateFormDto.getMemoryImgFile());

        if(createMemory != null){
            resultMap.put("message", SUCCESS);
            status = HttpStatus.ACCEPTED;
        }
        else {
            resultMap.put("message", FAIL);
            status = HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<Map<String,Object>>(resultMap,status);
    }

}
