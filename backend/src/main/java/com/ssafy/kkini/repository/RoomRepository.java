package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long>, RoomCustomRepository {
    List<Room> findByRoomTitleContaining(String roomTitle);
    Room findByRoomId(int roomId);
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("update Room r set r.roomRecentUser = r.roomRecentUser + 1 where r.roomId=:roomId and r.roomRecentUser < r.roomLimitUser")
    int increaseRecentUserInRoom(int roomId);


    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("update Room r set r.roomRecentUser = r.roomRecentUser - 1 where r.roomId=:roomId")
    int decreaseRecentUserInRoom(int roomId);
}
