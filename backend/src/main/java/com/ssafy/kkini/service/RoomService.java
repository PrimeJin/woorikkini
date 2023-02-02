package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.RoomCreateFormDto;
import com.ssafy.kkini.dto.RoomEnterFormDto;
import com.ssafy.kkini.dto.RoomPasswordXDto;
import com.ssafy.kkini.dto.RoomSearchDto;
import com.ssafy.kkini.entity.Room;
import com.ssafy.kkini.entity.RoomKeyword;
import com.ssafy.kkini.repository.KeywordRepository;
import com.ssafy.kkini.repository.RoomKeywordRepository;
import com.ssafy.kkini.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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
        List<Integer> keywordIdxList = roomCreateFormDto.getRoomKeywordList();
        roomRepository.save(room);
        if(keywordIdxList != null && !keywordIdxList.isEmpty()){
            for (int keywordIdx: keywordIdxList) {
                roomKeywordRepository.save(new RoomKeyword(room, keywordRepository.findByKeywordId(keywordIdx)));
            }
        }
        return new RoomPasswordXDto(room);
    }

    public Map<String, String> detailRoom(int roomId){
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null){
            return null;
        }
        Map<String, String> roomDetail = new HashMap<>();
        roomDetail.put("roomTitle", room.getRoomTitle());
        roomDetail.put("roomContent", room.getRoomContent());
        return roomDetail;
    }

    public List<RoomPasswordXDto> getAllRoom(){
        List<Room> roomList = roomRepository.findAll();
        List<RoomPasswordXDto> roomListDto = roomList.stream()
                .map(room -> new RoomPasswordXDto(room))
                .collect(Collectors.toList());
        return roomListDto;
    }

    public List<RoomPasswordXDto> searchRoom(RoomSearchDto roomSearchDto) {
        return roomRepository.searchRoom(roomSearchDto);
    }

    public int enterRoom(int roomId, RoomEnterFormDto roomEnterFormDto) {
        if(roomEnterFormDto.getRoomPrivate().equals("Y")){
                if(!roomRepository.findByRoomId(roomId).getRoomPassword().equals(roomEnterFormDto.getRoomPassword())){
                    return 0;
                }
        }
        return roomRepository.increaseRecentUserInRoom(roomId);
    }
    public int exitRoom(int roomId) {
        return roomRepository.decreaseRecentUserInRoom(roomId);
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
