package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.*;
import com.ssafy.kkini.entity.Room;
import com.ssafy.kkini.entity.RoomKeyword;
import com.ssafy.kkini.repository.KeywordRepository;
import com.ssafy.kkini.repository.RoomKeywordRepository;
import com.ssafy.kkini.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public RoomDto createRoom(RoomCreateFormDto roomCreateFormDto){
        Room room = roomCreateFormDto.toEntity();
        roomRepository.save(room);

        List<Integer> keywordIdxList = roomCreateFormDto.getRoomKeywordList();
        if(keywordIdxList != null && !keywordIdxList.isEmpty()){
            for (int keywordIdx: keywordIdxList) {
                RoomKeyword roomKeyword = roomKeywordRepository.save(new RoomKeyword(room, keywordRepository.findByKeywordId(keywordIdx)));
                room.getRoomKeywords().add(roomKeyword);
            }
        }
        return new RoomDto(room);
    }

    public RoomDetailDto detailRoom(int roomId){
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null){
            return null;
        }
        RoomDetailDto roomDetailDto = new RoomDetailDto(room);
        return roomDetailDto;
    }

    public List<RoomDto> getAllRoom(){
        List<Room> roomList = roomRepository.findAll();
        List<RoomDto> roomListDto = roomList.stream()
                .map(room -> new RoomDto(room))
                .collect(Collectors.toList());
        return roomListDto;
    }

    public List<RoomDto> searchRoom(String subject, String content) {
        return roomRepository.searchRoom(subject, content);
    }

    public Room enterRoom(int roomId, RoomEnterFormDto roomEnterFormDto) {
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null) return null;
        if(roomEnterFormDto.getRoomPrivate().equals("true")){
                if(!room.getRoomPassword().equals(roomEnterFormDto.getRoomPassword())){
                    return null;
                }
        }
        int cnt = roomRepository.increaseRecentUserInRoom(roomId);
        if(cnt == 0) return null;
        return room;
    }

    @Transactional
    public int exitRoom(int roomId) {
        int cnt = roomRepository.decreaseRecentUserInRoom(roomId);
        if(cnt == 0) return cnt;
        else {
            Room room = roomRepository.findByRoomId(roomId);
            if(room.getRoomRecentUser() <= 0){
                return deleteRoom(roomId);
            }
        }
        return cnt;
    }

    @Transactional
    public int deleteRoom(int roomId) {
        return roomRepository.deleteByRoomId(roomId);
    }

    public int updateRoom(int roomId, int roomRecentUser) {
        return roomRepository.updateRoom(roomId, roomRecentUser);
    }
}
