package com.ssafy.kkini.repository;

import com.ssafy.kkini.dto.RoomDto;

import java.util.List;

public interface RoomCustomRepository {
    List<RoomDto> searchRoom(String subject, String content);
}
