import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomList = (props) => {
  const title = props.room.title;
  const 공개 = props.room.completed;
  const navigate = useNavigate();

  function goDetail() {
    navigate(`${props.room.id}`);
  }

  return (
    <div style={{ display: 'grid' }}>
      <div onClick={goDetail} style={{ cursor: 'pointer', border: '1px solid black', margin: 50 }}>
        {title}
        {공개 ? <p>공개방</p> : <p>비공개방</p>}
        {props.room.userId}/10
      </div>
    </div>
  );
};

export default RoomList;
