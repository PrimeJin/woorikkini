import './CardContainer.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import React, { useState } from 'react';
import CreateCard from './CreateCard';

// import { useState, useRef, useEffect } from "react";

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

// const items = [
//   {
//     src: 'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2600&q=80',
//   },
//   {
//     src: 'https://images.unsplash.com/photo-1491900177661-4e1cd2d7cce2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80',
//   },
// ];

const SwiperContainer = () => {
  SwipeCore.use([Navigation, Pagination, Autoplay]);
  const [cardList, setCardList] = useState([
    // {
    //   img:
    // 'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2600&q=80',
    // //     'https://images.unsplash.com/photo-1491900177661-4e1cd2d7cce2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80',
    // '제목 1',
    // '내용 1',
    // },
  ]);

  const addCard = (event) => {
    // const newCard = {
    //   img: [event.data[0]],
    //   title: event.data[1],
    //   content: event.data[2],
    // };
    const newCard = event;
    setCardList([...cardList, newCard]);
    // console.log('$', event[0]);
    // console.log('**', newCard);
  };
  console.log('^^^', cardList);

  const cardDelete = (event) => {
    console.log('#', event);
  };

  return (
    <>
      <div className="cardlist-top">
        {cardList.map((data, idx) => {
          return (
            <div key={idx} className="card-whole">
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
                    {/* {data[0].img.map((item, id) => {
                      return (
                      );
                    })} */}
                    <SwiperSlide>
                      {/* 이미지 들어갈 자리 */}
                      <img src={data[0]} className="slider-image-wrapper" alt="SliderImg" />
                    </SwiperSlide>
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
                <button onClick={cardDelete} key={idx}>
                  삭제
                </button>
                <div>날짜</div>
                <div>{data[1]}</div>
                <div>{data[2]}</div>
              </div>
            </div>

            // <div  style={{ margin: 30, width: 200, height: 300 }}>
            //   <img style={{ width: 200, height: 200 }} />
            //   <p></p>
            //   <p></p>
            // </div>
          );
        })}
        <CreateCard addCard={addCard}></CreateCard>
      </div>
    </>
  );
};

export default SwiperContainer;
