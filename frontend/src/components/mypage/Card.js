import './Card.css';
import React from 'react';

const Card = ({ title, src }) => {
  return (
    <div className="card">
      <div className="slider-image-wrapper" style={{ width: 291, height: 300, position: 'relative' }}>
        {/* 이미지 들어갈 자리 */}
        <img className="slider-image" src={src} alt="SliderImg" />
      </div>
      <button>수정</button>
      <button>삭제</button>
      <div className="slider-item-content">
        <div>날짜</div>
        <h3>{title}</h3>
        <div>내용을 입력하세요.</div>
      </div>
    </div>
  );
};

export default Card;
