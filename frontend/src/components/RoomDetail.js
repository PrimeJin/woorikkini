import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RoomDetail = () => {
  const [title, setTitle] = useState('');
  const [공개, set공개] = useState('');
  const params = useParams();

  function getDetail() {
    axios({
      url: `https://jsonplaceholder.typicode.com/todos`,
      methods: 'GET',
    })
      .then((res) => {
        setTitle(res.data[params.roomId - 1].title);
        set공개(res.data[params.roomId - 1].completed);
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
      {공개 ? <p>공개</p> : <p>비공개</p>}
      <button onClick={goOut}>나가기</button>
    </div>
  );
};

export default RoomDetail;
