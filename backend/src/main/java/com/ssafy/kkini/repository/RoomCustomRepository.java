package com.ssafy.kkini.repository;

import com.ssafy.kkini.dto.RoomPasswordXDto;
import com.ssafy.kkini.dto.RoomSearchDto;

import java.util.List;

public interface RoomCustomRepository {
    List<RoomPasswordXDto> searchRoom(RoomSearchDto roomSearchDto);
}
