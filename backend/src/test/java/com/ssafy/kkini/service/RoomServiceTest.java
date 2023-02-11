package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.*;
import com.ssafy.kkini.entity.Room;
import com.ssafy.kkini.repository.RoomRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.TestPropertySource;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
@TestPropertySource(locations="classpath:application-test.yml")
public class RoomServiceTest {

    @InjectMocks
    private RoomService roomService;
    @Mock  //가짜 객체(Test 협력)
    private RoomRepository roomRepository;

    @Test
    @DisplayName("방 생성 테스트")
    public void createRoom() throws Exception {
        //given
        RoomCreateFormDto createFormDto = new RoomCreateFormDto("roomtitle4", "roomContent4", "true"
                , "password", "preset1", new ArrayList<>(), 6, "asdf");
        Room givenRoom = createFormDto.toEntity();
        when(roomRepository.save(any())).thenReturn(createFormDto.toEntity());
        //when
        RoomDto compareRoom = roomService.createRoom(createFormDto);
        //then
        Assertions.assertThat(givenRoom.getRoomContent()).isEqualTo(compareRoom.getRoomContent());
    }

    @Test
    @DisplayName("방 상세 조회 service 테스트")
    public void getRoom() throws Exception {
        //given
        Room room = Room.builder().roomId(1).roomTitle("roomtitle").roomContent("roomContent").build();
        when(roomRepository.findByRoomId(1)).thenReturn(room);
        //when
        RoomDetailDto roomDetailDto = roomService.detailRoom(1);
        //then
        Assertions.assertThat(roomDetailDto.getRoomTitle()).isEqualTo(room.getRoomTitle());
    }

    @Test
    @DisplayName("방 목록(리스트) service 테스트")
    public void getRoomList() throws Exception {
        Room room1 = Room.builder().roomId(1).roomTitle("roomtitle").roomContent("roomContent").roomKeywords(new ArrayList<>())
                .roomRecentUser(1).roomLimitUser(6).roomPassword("password").roomPreset("preset1").roomPrivate("true").build();
        Room room2 = Room.builder().roomId(1).roomTitle("roomtitle").roomContent("roomContent").roomKeywords(new ArrayList<>())
                .roomRecentUser(1).roomLimitUser(6).roomPassword("password").roomPreset("preset1").roomPrivate("true").build();
        //given
        List<Room> roomList = new ArrayList<>();
        roomList.add(room1);
        roomList.add(room2);


        when(roomRepository.findAll()).thenReturn(roomList);
        //when

        List<RoomDto> roomListDto = roomList.stream()
                .map(room -> new RoomDto(room))
                .collect(Collectors.toList());

        List<RoomDto> compareRoomList = roomService.getAllRoom();
        //then
        Assertions.assertThat(roomListDto.size()).isEqualTo(compareRoomList.size());
    }

    @Test
    @DisplayName("방 삭제 service 테스트")
    public void deleteRoom() throws Exception {

        roomService.deleteRoom(1);
        verify(roomRepository, times(1)).deleteByRoomId(1);
    }

    @Test
    @DisplayName("방 검색 service 테스트")
    public void searchRoom() throws Exception {
        Room room = Room.builder().roomId(1).roomTitle("roomtitle").roomContent("roomContent").roomKeywords(new ArrayList<>())
                .roomRecentUser(1).roomLimitUser(6).roomPassword("password").roomPreset("preset1").roomPrivate("true").build();

        RoomDto room1 = new RoomDto(room);
        RoomDto room2 = new RoomDto(room);
        //given
        List<RoomDto> roomList = new ArrayList<>();
        roomList.add(room1);
        roomList.add(room2);

        when(roomRepository.searchRoom("title", "title")).thenReturn(roomList);
        List<RoomDto> compareRoomList = roomService.searchRoom("title", "title");

        roomService.deleteRoom(1);
        Assertions.assertThat(roomList.size()).isEqualTo(compareRoomList.size());
        Assertions.assertThat(roomList).isEqualTo(compareRoomList);
    }

    @Test
    @DisplayName("방 들어가기 service 테스트")
    public void enterRoom() throws Exception {
        Room room = Room.builder().roomId(1).roomTitle("roomtitle").roomContent("roomContent").roomKeywords(new ArrayList<>())
                .roomRecentUser(1).roomLimitUser(6).roomPassword("password").roomPreset("preset1").roomPrivate("true").build();
        RoomEnterFormDto roomEnterFormDto = new RoomEnterFormDto("true", "password");

        when(roomRepository.findByRoomId(1)).thenReturn(room);
        when(roomRepository.increaseRecentUserInRoom(1)).thenReturn(room.getRoomRecentUser() + 1);

        Room result = roomService.enterRoom(1, roomEnterFormDto);

        Assertions.assertThat(room.getRoomRecentUser()).isEqualTo(result.getRoomRecentUser());
    }

    @Test
    @DisplayName("방 나가기 service 테스트")
    public void exitRoom() throws Exception {

        when(roomRepository.decreaseRecentUserInRoom(1)).thenReturn(1);

        int result = roomService.exitRoom(1);

        Assertions.assertThat(1).isEqualTo(result);
    }

}
