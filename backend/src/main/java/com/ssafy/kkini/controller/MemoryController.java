package com.ssafy.kkini.controller;

import com.ssafy.kkini.dto.MemoryCreateFormDto;
import com.ssafy.kkini.dto.MemoryUpdateFormDto;
import com.ssafy.kkini.entity.Memory;
import com.ssafy.kkini.service.MemoryService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/memory")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE})
public class MemoryController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    @Autowired
    private MemoryService memoryService;

    @ApiOperation(value = "추억카드 등록", notes = "추억카드 등록")
    @PostMapping()
    public ResponseEntity<Map<String,Object>> createMemory(@Valid @RequestBody @ApiParam(value = "추억 제목,내용, 사진",required = true,example = "0")
                                                     MemoryCreateFormDto memoryCreateFormDto){
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        Memory createMemory = null;
        try {
            createMemory = memoryService.createMemory(memoryCreateFormDto);
            if(createMemory != null){
                resultMap.put("message", SUCCESS);
                status = HttpStatus.ACCEPTED;
            }
            else {
                resultMap.put("message", FAIL);
                status = HttpStatus.BAD_REQUEST;
            }
        } catch (IOException e) {
            resultMap.put("message", FAIL);
            status = HttpStatus.BAD_REQUEST;
        }


        return new ResponseEntity<Map<String,Object>>(resultMap,status);
    }
    @ApiOperation(value = "추억카드 수정", notes = "추억카드 수정")
    @PatchMapping()
    public ResponseEntity<Map<String,Object>> updateMemory(@Valid @RequestBody @ApiParam(value = "추억 아이디, 제목, 내용 사진", required = true, example = "0")
                                                           MemoryUpdateFormDto memoryUpdateFormDto){
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();

        Memory updateMemory = null;
        try {
            updateMemory = memoryService.updateMemory(memoryUpdateFormDto);
            if(updateMemory != null){
                resultMap.put("message", SUCCESS);
                status = HttpStatus.ACCEPTED;
            }
            else {
                resultMap.put("message", FAIL);
                status = HttpStatus.BAD_REQUEST;
            }

        } catch (IOException e) {
            resultMap.put("message", FAIL);
            status = HttpStatus.BAD_REQUEST;
        }



        return new ResponseEntity<Map<String,Object>>(resultMap,status);
    }

    @ApiOperation(value = "추억카드 삭제", notes = "추억카드 삭제")
    @DeleteMapping("/{memoryId}")
    public ResponseEntity<Map<String,Object>> deleteMemory(@Valid @PathVariable @ApiParam(value = "추억 아이디", required = true, example = "0")
                                                           int memoryId){
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();

        if(memoryService.deleteMemory(memoryId) > 0){
            resultMap.put("message", SUCCESS);
            status = HttpStatus.ACCEPTED;
        }
        else {
            resultMap.put("message", FAIL);
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String,Object>>(resultMap,status);
    }

    @ApiOperation(value = "추억카드 조회", notes = "추억카드 조회")
    @GetMapping()
    public ResponseEntity<Map<String,Object>> getMemory(@Valid @RequestParam @ApiParam(value = "회원 아이디", required = true, example = "0")
                                                           int userId){
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();

        List<Memory> memoryList = memoryService.getMemory(userId);

        if(memoryList != null && memoryList.size() != 0){
            resultMap.put("message", SUCCESS);
            resultMap.put("memoryList", memoryList);
            status = HttpStatus.ACCEPTED;
        }else{
            resultMap.put("message", FAIL);
            status = HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<Map<String,Object>>(resultMap,status);
    }

}
