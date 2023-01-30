import './CardContainer.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import React from 'react';
import CreateCard from './CreateCard';

// import { useState, useRef, useEffect } from "react";

// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

const items = [
  {
    title: 'Recursive',
    src: 'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2600&q=80',
  },
  {
    title: 'Bunker',
    src: 'https://images.unsplash.com/photo-1491900177661-4e1cd2d7cce2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80',
  },
];

const SwiperContainer = () => {
  SwipeCore.use([Navigation, Pagination, Autoplay]);

  // const Card = ({ title, src }) => {
  //   return (
  //   );
  // };
  // const prevRef = useRef(null);
  // const nextRef = useRef(null);

  // const [swiperSetting, setSwiperSetting] = useState(null);

  // useEffect(() => {
  //   if (!swiperSetting) {
  //     const settings = {
  //       // autoplay: { delay: 1000 },
  //       navigation: {
  //         prevEl: prevRef.current, // 이전 버튼
  //         nextEl: nextRef.current // 다음 버튼
  //       },
  //       onBeforeInit: (swiper) => {
  //         // 초기 설정
  //         swiper.params.navigation.prevEl = prevRef.current;
  //         swiper.params.navigation.nextEl = nextRef.current;
  //         swiper.navigation.update();
  //       },
  //       pagination: {
  //         el: ".swiper-pagination",
  //         clickable: true,
  //         dynamicBullets: true
  //       }
  //     };

  //     setSwiperSetting(settings);
  //   }
  // }, [prevRef, nextRef, swiperSetting]);

  return (
    <>
      {/* {swiperSetting && ( */}
      <div className="cardlist-top">
        <Swiper
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          // navigation={{
          //   nextEl: ".swiper-button-next",
          //   prevEl: ".swiper-button-prev"
          // }}
          navigation
          slidesPerView={1}
          spaceBetween={20}
          effect={'fade'}
          loop={true}
          speed={300}
          className="swiper-container"
        >
          <div className="swiper-wrapper">
            {items.map((item, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <div className="card">
                    <div className="slider-image-wrapper" style={{ width: 291, height: 300, position: 'relative' }}>
                      {/* <Card title={item.title} src={item.src} /> */}
                      {/* 이미지 들어갈 자리 */}
                      <img className="slider-image" src={item.src} alt="SliderImg" />
                    </div>
                    {/* <div style={{ position: 'absolute' }}> */}
                    <button>수정</button>
                    <button>삭제</button>
                    {/* </div> */}
                    <div className="slider-item-content">
                      <div>날짜</div>
                      <h3>{item.title}</h3>
                      <div>내용을 입력하세요.</div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
            <div className="slider-buttons">
              <button className="swiper-button-prev">Prev</button>
              <button className="swiper-button-next">Next</button>
            </div>
            {/* <div className="swiper-pagination" /> */}
          </div>
        </Swiper>
        <CreateCard></CreateCard>
      </div>
      {/* )} */}
    </>
  );
};

export default SwiperContainer;
