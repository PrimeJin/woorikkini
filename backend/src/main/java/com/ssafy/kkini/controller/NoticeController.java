package com.ssafy.kkini.controller;

import com.ssafy.kkini.dto.NoticeCreateFormDto;
import com.ssafy.kkini.dto.NoticeUpdateFormDto;
import com.ssafy.kkini.entity.Notice;
import com.ssafy.kkini.service.NoticeService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {
    private NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    private static final String MESSAGE = "message";
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    //공지사항 목록
    @ApiOperation(value = "공지사항 목록", notes = "공지사항 목록 페이징", response = Page.class)
    @GetMapping()
    public ResponseEntity<Map<String, Object>> getNoticeList(@RequestParam(value = "page", defaultValue = "0") int page,
                                                      @RequestParam(value = "limit", defaultValue = "10") int limit) {
        Map<String, Object> map = new HashMap<>();
        try {
            Page<Notice> noticeList = noticeService.getNoticeList(page, limit);
            map.put(MESSAGE, SUCCESS);
            map.put("noticeList", noticeList);
            map.put("totalSize", noticeList.getTotalElements());
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } catch (Exception e) {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }

    //공지사항 등록
    @ApiOperation(value = "공지사항 등록", notes = "새로운 공지사항 등록, DB입력 성공여부에 따라 'success' 또는 'fail' 반환")
    @PostMapping()
    public ResponseEntity<Map<String, Object>> writeNotice(@Valid @RequestBody @ApiParam (value = "새 공지사항 정보 담은 dto") NoticeCreateFormDto noticeCreateFormDto) {
        Map<String, Object> map = new HashMap<>();

        if(noticeService.createNotice(noticeCreateFormDto) != null) {
            map.put(MESSAGE, SUCCESS);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } else {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }

    //공지사항 조회
    @ApiOperation(value = "공지사항 조회", notes = "공지사항 번호에 해당하는 공지사항 정보 반환")
    @GetMapping("/{noticeId}")
    public ResponseEntity<Map<String, Object>> getNotice(@PathVariable @ApiParam(value = "조회할 공지사항 번호", example = "0") int noticeId) {
        Map<String, Object> map = new HashMap<>();
        if(noticeService.getNotice(noticeId) != null) {
            map.put(MESSAGE, SUCCESS);
            map.put("notice", noticeService.getNotice(noticeId));
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } else {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }

    //공지사항 수정
    @ApiOperation(value = "공지사항 글 수정", notes = "수정할 공지사항 정보 입력")
    @PutMapping("/{noticeId}")
    public ResponseEntity<Map<String, Object>> updateNotice(@PathVariable int noticeId,
                                                            @Valid @RequestBody @ApiParam(value = "수정 글 정보 담은 dto") NoticeUpdateFormDto noticeUpdateFormDto) {
        Map<String, Object> map = new HashMap<>();

        Notice updatedNotice = noticeService.updateNotice(noticeUpdateFormDto);
        if(updatedNotice != null) {
            map.put(MESSAGE, SUCCESS);
            map.put("notice", updatedNotice);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } else {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }

    //공지사항 삭제
    @ApiOperation(value = "공지사항 삭제", notes = "공지사항 번호에 해당하는 공지사항 정보 삭제, DB에서 삭제 여부에 따라 'success' 또는 'fail' 반환")
    @DeleteMapping("/{noticeId}")
    public ResponseEntity<Map<String, Object>> deleteNotice(@PathVariable @ApiParam(value = "삭제할 공지사항 번호", example = "0") int noticeId) {
        Map<String, Object> map = new HashMap<>();
        if(noticeService.deleteNotice(noticeId) == 1) {
            map.put(MESSAGE, SUCCESS);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } else {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }
}
