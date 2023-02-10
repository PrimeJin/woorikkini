import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomList from './RoomList';
// import "./Room.css";

const Room = () => {
  const [list, setList] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [filtered, setFiltered] = useState([]);

  function getList() {
    axios({
      url: `https://jsonplaceholder.typicode.com/todos`,
      methods: 'GET',
    })
      .then((res) => {
        setList(res.data);
        setFiltered(res.data);
      })
      .catch((err) => {
        console.log(err, '방 목록 에러');
      });
  }

  useEffect(() => {
    getList();
  }, []);

  function sorting(e) {
    // list.sort((b) => b.title);
    // setList(list);
    // console.log(list[1].title);
  }

  useEffect(() => {
    isFull
      ? isPrivate
        ? setFiltered(list.filter((room) => room.userId >= 5 && room.completed === true))
        : setFiltered(list.filter((room) => room.userId >= 5))
      : isPrivate
      ? setFiltered(list.filter((room) => room.completed === true))
      : setFiltered(list);
  }, [isPrivate, isFull]);

  return (
    <div>
      <h1>방 목록</h1>
      <select onChange={sorting} style={{ textAlign: 'center' }}>
        <option value="old">오래된순</option>
        <option value="new">최신순</option>
        <option value="numHigh">참여인원많은순</option>
        <option value="numLow">참여인원적은순</option>
      </select>
      검색창
      <button>방 만들기</button>
      <br />
      <input type="checkbox" onChange={(e) => (e.target.checked ? setIsFull(true) : setIsFull(false))} />
      입장가능한 방만 보기
      <input
        type="checkbox"
        name="isPrivate"
        onChange={(e) => (e.target.checked ? setIsPrivate(true) : setIsPrivate(false))}
      />
      공개방만 보기
      <div style={{ columns: 2 }}>
        {filtered.map((room, index) => (
          <RoomList key={index} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Room;
