import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RoomDetail = () => {
  const [title, setTitle] = useState('');
  // const [isPrivate, setIsPrivate] = useState("");
  const [content, setContent] = useState('');
  const params = useParams();
  const roomId = params.roomId;

  function getDetail() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/room/${roomId}`,
      methods: 'GET',
    })
      .then((res) => {
        setTitle(res.data.result.roomTitle);
        // setIsPrivate(res.data.result.roomPrivate);
        setContent(res.data.result.roomContent);
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
      {/* {isPrivate ? <p>비공개</p> : <p>공개</p>} */}
      <pre style={{ backgroundColor: 'green' }}>{content}</pre>
      <button onClick={goOut}>나가기</button>
    </div>
  );
};

export default RoomDetail;
