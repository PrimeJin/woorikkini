package com.ssafy.kkini.service;


import com.ssafy.kkini.entity.Exit;
import com.ssafy.kkini.entity.Room;
import com.ssafy.kkini.repository.ExitRepository;
import com.ssafy.kkini.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExitService {
    private RoomRepository roomRepository;
    private ExitRepository exitRepository;

    public ExitService(RoomRepository roomRepository, ExitRepository exitRepository) {
        this.roomRepository = roomRepository;
        this.exitRepository = exitRepository;
    }

    public int addExitUser(String roomId, String userId) {
        System.out.println("hihi");
        Room room = roomRepository.findByRoomId(Integer.parseInt(roomId));
        System.out.println(room);

        if (room == null) {
            return 0;
        }
        Exit exit = new Exit(Integer.parseInt(userId), room);
        exitRepository.save(exit);
        return 1;
    }

    public int findExitUser(String roomId, String userId) {
        Exit exit = exitRepository.findByOutcaster(Integer.parseInt(userId));
        if (exit == null || exit.getRoomId().getRoomId() != Integer.parseInt(roomId)){
            return 0;
        }

        return 1;
    }
}
