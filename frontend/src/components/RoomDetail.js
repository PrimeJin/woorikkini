import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RoomDetail = () => {
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState('');
  const [content, setContent] = useState('');
  const params = useParams();

  function getDetail() {
    axios({
      url: 'https://my-json-server.typicode.com/yjw9397/demo/room',
      methods: 'GET',
    })
      .then((res) => {
        setTitle(res.data[params.roomId - 1].roomTitle);
        setIsPrivate(res.data[params.roomId - 1].roomPrivate);
        setContent(res.data[params.roomId - 1].roomContent);
      })
      .catch((err) => {
        console.log(err, '방 디테일 에러');
      });
  }

  useEffect(() => {
    getDetail();
  }, []);

  const navigate = useNavigate();
  function goOut() {
    navigate('/room');
  }

  return (
    <div>
      <h1>{title}</h1>
      {isPrivate ? <p>비공개</p> : <p>공개</p>}
      <p>{content}</p>
      <button onClick={goOut}>나가기</button>
    </div>
  );
};

export default RoomDetail;
