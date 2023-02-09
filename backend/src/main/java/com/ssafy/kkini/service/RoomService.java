package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.*;
import com.ssafy.kkini.entity.Room;
import com.ssafy.kkini.entity.RoomKeyword;
import com.ssafy.kkini.repository.KeywordRepository;
import com.ssafy.kkini.repository.RoomKeywordRepository;
import com.ssafy.kkini.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoomService {
    private RoomRepository roomRepository;
    private RoomKeywordRepository roomKeywordRepository;
    private KeywordRepository keywordRepository;

    public RoomService(RoomRepository roomRepository, RoomKeywordRepository roomKeywordRepository, KeywordRepository keywordRepository) {
        this.roomRepository = roomRepository;
        this.roomKeywordRepository = roomKeywordRepository;
        this.keywordRepository = keywordRepository;
    }

    public RoomPasswordXDto createRoom(RoomCreateFormDto roomCreateFormDto){
        Room room = roomCreateFormDto.toEntity();
        roomRepository.save(room);

        List<Integer> keywordIdxList = roomCreateFormDto.getRoomKeywordList();
        if(keywordIdxList != null && !keywordIdxList.isEmpty()){
            for (int keywordIdx: keywordIdxList) {
                RoomKeyword roomKeyword = roomKeywordRepository.save(new RoomKeyword(room, keywordRepository.findByKeywordId(keywordIdx)));
                room.getRoomKeywords().add(roomKeyword);
            }
        }
        return new RoomPasswordXDto(room);
    }

    public RoomDetailDto detailRoom(int roomId){
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null){
            return null;
        }
        RoomDetailDto roomDetailDto = new RoomDetailDto(room);
        return roomDetailDto;
    }

    public List<RoomPasswordXDto> getAllRoom(){
        List<Room> roomList = roomRepository.findAll();
        List<RoomPasswordXDto> roomListDto = roomList.stream()
                .map(room -> new RoomPasswordXDto(room))
                .collect(Collectors.toList());
        return roomListDto;
    }

    public List<RoomPasswordXDto> searchRoom(String subject, String content) {
        return roomRepository.searchRoom(subject, content);
    }

    public int enterRoom(int roomId, RoomEnterFormDto roomEnterFormDto) {
        if(roomEnterFormDto.getRoomPrivate().equals("true")){
                if(!roomRepository.findByRoomId(roomId).getRoomPassword().equals(roomEnterFormDto.getRoomPassword())){
                    return 0;
                }
        }
        return roomRepository.increaseRecentUserInRoom(roomId);
    }
    public int exitRoom(int roomId) {
        return roomRepository.decreaseRecentUserInRoom(roomId);
    }

    @Transactional
    public int deleteRoom(int roomId) {
        return roomRepository.deleteByRoomId(roomId);
    }

//    public List<RoomPasswordXDto> getFilteredRoom(RoomFilterFormDto roomFilterFormDto){
//        String openPrivate = roomFilterFormDto.getOpenPrivate();
//        String openFullRoom = roomFilterFormDto.getOpenFullRoom();
//
//        select * from room where private = "N" and
//        if(openPrivate.equals("Y")){
//
//        } else {
//            // where private = "N"
//        }
//        List<Room>
//    }
}
