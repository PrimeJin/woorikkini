import './Card.css';
import React from 'react';

const Card = ({ title, src }) => {
  return (
    <div className="card">
      {' '}
      slider-item swiper-slide
      <div className="slider-image-wrapper" style={{ width: 291, height: 300, position: 'relative' }}>
        {/* 이미지 들어갈 자리 */}
        <img className="slider-image" src={src} alt="SliderImg" />
      </div>
      {/* <div style={{ position: 'absolute' }}> */}
      <button>수정</button>
      <button>삭제</button>
      {/* </div> */}
      <div className="slider-item-content">
        <div>날짜</div>
        <h3>{title}</h3>
        <div>내용을 입력하세요.</div>
      </div>
    </div>
  );
};

// const Slideritem = ({ title, src }) => {
// const [isActive, setIsActive] = useState(false);

// 미완..
// useEffect(() => {
//   setIsActive(true);
//   console.log("active!");
// }, []);

// return (
//   <div className="slider-item swiper-slide">
//     <div className="slider-image-wrapper">
//       <img className="slider-image" src={src} alt="SliderImg" />
//     </div>
//     <div className="slider-item-content">
//       <h1>{title}</h1>
//       <p>
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//         eiusmod tempor incididunt ut labore
//       </p>
//     </div>
//   </div>

export default Card;
