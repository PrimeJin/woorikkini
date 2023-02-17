package com.ssafy.kkini.controller;


import com.ssafy.kkini.dto.*;
import com.ssafy.kkini.entity.Room;
import com.ssafy.kkini.service.ExitService;
import com.ssafy.kkini.service.KeywordService;
import com.ssafy.kkini.service.RoomService;
import io.swagger.annotations.Api;
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
@Api("Room RestController V1")
@RequestMapping("/api/room")
public class RoomController {
    private static final String MESSAGE = "message";
    private static final String RESULT = "result";
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    private RoomService roomService;
    private KeywordService keywordService;
    private ExitService exitService;

    public RoomController(RoomService roomService, KeywordService keywordService, ExitService exitService) {
        this.roomService = roomService;
        this.keywordService = keywordService;
        this.exitService = exitService;
    }

    @ApiOperation(value = "방 생성", notes = "생성된 방 정보를 반환한다.", response = Map.class)
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRoom(@RequestBody @ApiParam(value = "방 생성에 필요한 정보(roomTitle / roomContent / roomPrivate / roomPassword / roomLimitUser / roomRecentUser)")
                                               @Valid RoomCreateFormDto roomCreateFormDto) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();

        RoomDto room = roomService.createRoom(roomCreateFormDto);
        if (room == null){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            status = HttpStatus.OK;
            resultMap.put(MESSAGE, SUCCESS);
            resultMap.put(RESULT, room);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "방 상세조회", notes = "방의 상세정보를 반환한다.", response = Map.class)
    @GetMapping("/{roomId}")
    public ResponseEntity<Map<String, Object>> detailRoom(@PathVariable @ApiParam(value = "방 번호(roomId)", required = true)
                                            String roomId) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        RoomDetailDto roomDetail = roomService.detailRoom(Integer.valueOf(roomId));
        if (roomDetail == null){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            status = HttpStatus.OK;
            resultMap.put(MESSAGE, SUCCESS);
            resultMap.put(RESULT, roomDetail);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "전체 방 조회", notes = "모든 방의 정보를 반환한다.", response = Map.class)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getRoom() {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        List<RoomDto> roomList = roomService.getAllRoom();
        if (roomList == null){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            status = HttpStatus.OK;
            resultMap.put(MESSAGE, SUCCESS);
            resultMap.put(RESULT, roomList);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "검색어에 해당되는 방 제공", notes = "입력된 검색어에 해당되는 방의 정보를 반환한다.", response = Map.class)
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchRoom(@ApiParam(value = "검색종류 subject = (title, keyword), 검색어(content) ", required = true)
                                             @RequestParam String subject, @RequestParam String content) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        List<RoomDto> roomList = roomService.searchRoom(subject, content);
        if (roomList == null){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            status = HttpStatus.OK;
            resultMap.put(MESSAGE, SUCCESS);
            resultMap.put(RESULT, roomList);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "모든 키워드 제공", notes = "모든 키워드를 반환한다.", response = Map.class)
    @GetMapping("/keyword")
    public ResponseEntity<Map<String, Object>> getKeyword() {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        List<KeywordDto> keywordList = keywordService.getKeyword();
        if (keywordList == null){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            status = HttpStatus.OK;
            resultMap.put(MESSAGE, SUCCESS);
            resultMap.put(RESULT, keywordList);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "방 입장", notes = "사용자가 방 입장 시 사용자가 강제 퇴장 당한 유저라면 거절, " +
            "강퇴당한 유저가 아니라면 해당 방의 참여자 수를 1 증가시킨다.", response = Map.class)
    @PostMapping("/enter/{roomId}/{userId}")
    public ResponseEntity<Map<String, Object>> enterRoom(@ApiParam(value = "입장할 방 번호", required = true)
                                           @PathVariable String roomId, @PathVariable String userId, @RequestBody RoomEnterFormDto roomEnterFormDto) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();

        //해당 유저가 강제퇴장 당한 유저인지 확인
        int cnt = exitService.findExitUser(roomId, userId);
        if(cnt == 0){
            Room result = roomService.enterRoom(Integer.valueOf(roomId), roomEnterFormDto);

            if (result == null){
                status = HttpStatus.BAD_REQUEST;
                resultMap.put(MESSAGE, FAIL);
            } else {
                status = HttpStatus.OK;
                resultMap.put("sessionId", result.getSessionId());
                resultMap.put(MESSAGE, SUCCESS);
            }
        } else{
            status = HttpStatus.UNAUTHORIZED;
            resultMap.put(MESSAGE, "denied");
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "강제퇴장 조치", notes = "특정 사용자를 강제 퇴장 시킨다", response = Map.class)
    @PostMapping("/exit/{roomId}/{userId}")
    public ResponseEntity<Map<String, Object>> addExitUser(@ApiParam(value = "사용자 아이디", required = true)
                                         @PathVariable String roomId, @PathVariable String userId) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        int result = exitService.addExitUser(roomId, userId);
        if (result == 0){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            int cnt = roomService.exitRoom(Integer.parseInt(roomId));
            if(cnt == 0){
                status = HttpStatus.BAD_REQUEST;
                resultMap.put(MESSAGE, FAIL);
            } else{
                status = HttpStatus.OK;
                resultMap.put(MESSAGE, SUCCESS);
            }
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "방 나가기 조치", notes = "방 인원수를 1감소 시킨다.", response = Map.class)
    @DeleteMapping("/exit/{roomId}")
    public ResponseEntity<Map<String, Object>> exitRoom(@ApiParam(value = " 방 아이디", required = true)
                                         @PathVariable String roomId) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        int result = roomService.exitRoom(Integer.parseInt(roomId));
        if (result == 0){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            status = HttpStatus.OK;
            resultMap.put(MESSAGE, SUCCESS);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "방 삭제", notes = "방을 삭제 시킨다", response = Map.class)
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Map<String, Object>> removeRoom(@ApiParam(value = "방 아이디", required = true)
                                         @PathVariable String roomId) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        int result = roomService.deleteRoom(Integer.valueOf(roomId));
        if (result == 0){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            status = HttpStatus.OK;
            resultMap.put(MESSAGE, SUCCESS);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "방 정보를 업데이트 시킨다.", notes = "방 정보를 업데이트 시킨다.", response = Map.class)
    @PatchMapping("/{roomId}")
    public ResponseEntity<Map<String, Object>> updateRoom(@ApiParam(value = "방 아이디", required = true)
                                        @PathVariable String roomId, @RequestParam String roomRecentUser) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        int result = roomService.updateRoom(Integer.valueOf(roomId), Integer.parseInt(roomRecentUser));
        if (result == 0){
            status = HttpStatus.BAD_REQUEST;
            resultMap.put(MESSAGE, FAIL);
        } else {
            status = HttpStatus.OK;
            resultMap.put(MESSAGE, SUCCESS);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }
}
