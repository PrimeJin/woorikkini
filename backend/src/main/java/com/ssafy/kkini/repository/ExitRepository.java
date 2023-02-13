package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Exit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExitRepository  extends JpaRepository<Exit, Long> {
    Exit findByOutcasterAndRoomId_RoomId(int userId, int roomId);
}
