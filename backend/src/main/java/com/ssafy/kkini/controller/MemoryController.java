package com.ssafy.kkini.controller;

import com.ssafy.kkini.dto.MemoryCreateFormDto;
import com.ssafy.kkini.dto.MemoryGetFormDto;
import com.ssafy.kkini.dto.MemoryUpdateFormDto;
import com.ssafy.kkini.entity.Memory;
import com.ssafy.kkini.service.MemoryService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/memory")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE,RequestMethod.OPTIONS})
public class MemoryController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    private final MemoryService memoryService;

    private static final Logger logger = LoggerFactory.getLogger(MemoryController.class);

    public MemoryController(MemoryService memoryService){
        this.memoryService = memoryService;
    }

    @ApiOperation(value = "추억카드 등록", notes = "추억카드 등록")
    @PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Map<String,Object>> createMemory(@Valid @ApiParam(value = "추억 제목,내용, 사진", required = true, example = "0")
                                                               @RequestPart(value = "memoryImgFiles", required = false) List<MultipartFile> memoryImgFiles,
                                                               @RequestPart(value = "newCardData", required = false) MemoryCreateFormDto memoryCreateFormDto){

        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        Memory createMemory = null;

        logger.debug(String.valueOf(memoryImgFiles.size()));
        if(!memoryImgFiles.isEmpty()){
            logger.debug(String.valueOf(memoryImgFiles.get(0)));
        }


        try {
            createMemory = memoryService.createMemory(memoryCreateFormDto, memoryImgFiles);
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
    @PatchMapping(consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Map<String,Object>> updateMemory(@Valid @ApiParam(value = "추억 아이디, 제목, 내용 사진", required = true, example = "0")
                                                               @RequestPart(value = "memoryImgFiles", required = false) List<MultipartFile> memoryImgFiles,
                                                               @RequestPart(value = "newCardData", required = false) MemoryUpdateFormDto memoryUpdateFormDto){
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        Memory updateMemory = null;

        logger.debug(String.valueOf(memoryImgFiles.size()));
        if(!memoryImgFiles.isEmpty()){
            logger.debug(String.valueOf(memoryImgFiles.get(0)));
        }

        try {
            updateMemory = memoryService.updateMemory(memoryUpdateFormDto ,memoryImgFiles);
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

        List<MemoryGetFormDto> memoryGetFormDtoList = memoryService.getMemory(userId);

        if(memoryGetFormDtoList != null && memoryGetFormDtoList.size() != 0){
            resultMap.put("message", SUCCESS);
            resultMap.put("memoryList", memoryGetFormDtoList);
            status = HttpStatus.ACCEPTED;
        }else{
            resultMap.put("message", FAIL);
            status = HttpStatus.ACCEPTED;
        }
        return new ResponseEntity<Map<String,Object>>(resultMap,status);
    }

}
