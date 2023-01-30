import './CardContainer.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import React from 'react';
import CreateCard from './CreateCard';

// import { useState, useRef, useEffect } from "react";

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

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

  return (
    <>
      {/* {swiperSetting && ( */}
      <div className="cardlist-top">
        <div className="card-whole">
          <Swiper
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation
            slidesPerView={1}
            spaceBetween={20}
            effect={'fade'}
            loop={true}
            speed={300}
            className="swiper-container"
          >
            <div className="swiper-wrapper">
              <div className="card swiper-slide">
                {items.map((item, idx) => {
                  return (
                    <SwiperSlide key={idx}>
                      {/* <div className="slider-image-wrapper"> */}
                      {/* <Card title={item.title} src={item.src} /> */}
                      {/* 이미지 들어갈 자리 */}
                      <img className="slider-image-wrapper" src={item.src} alt="SliderImg" />
                      {/* </div> */}
                    </SwiperSlide>
                  );
                })}
                ;
              </div>

              <div className="slider-buttons">
                <button className="swiper-button-prev">Prev</button>
                <button className="swiper-button-next">Next</button>
              </div>
            </div>
          </Swiper>
          <div>
            <button>수정</button>
            <button>삭제</button>
            <div>날짜</div>
            <div>제목을 입력하세요.</div>
            <div>내용을 입력하세요.</div>
          </div>
        </div>
        <CreateCard></CreateCard>
      </div>
    </>
  );
};

export default SwiperContainer;
