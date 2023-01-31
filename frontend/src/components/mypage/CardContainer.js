import './CardContainer.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import React, { useState } from 'react';
import CreateCard from './CreateCard';
import UpdateCard from './UpdateCard';

// import { useState, useRef, useEffect } from "react";

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

const SwiperContainer = () => {
  SwipeCore.use([Navigation, Pagination, Autoplay]);
  const [cardList, setCardList] = useState([]);

  const addCard = (event) => {
    console.log('$', event);

    //새롭게 배열 데이터를 추가하는 함수
    const newCard = {
      id: cardList.length + 1,
      img: event.img,
      title: event.title,
      content: event.content,
    };
    setCardList([...cardList, newCard]);
  };

  const cardDelete = (id) => {
    // card.id 가 매개변수로 작성하지 않는 데이터들만 추출해서 새로운 배열을 만듬
    // = card.id 가 id 인 것을 제거함
    setCardList(cardList.filter((card) => card.id !== id));
    console.log('!!', id);
  };

  const [update, setUpdate] = useState(false);
  const [currentCard, setCurrentCard] = useState({});
  const cardUpdate = (data) => {
    console.log('수정할래');
    console.log('뭘', data);
    setUpdate(true);
    setCurrentCard(data);
    console.log('보낼거1', update);
    console.log('보낼거2', currentCard);
  };

  console.log('^^^', cardList);

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
                    {data.img.map((item, id) => {
                      return (
                        <SwiperSlide>
                          {/* 이미지 들어갈 자리 */}
                          {/* <p>{item}</p> */}
                          <img key={id} src={item} className="slider-image-wrapper" alt="SliderImg" />
                        </SwiperSlide>
                      );
                    })}
                  </div>

                  <div className="slider-buttons">
                    <button className="swiper-button-prev">Prev</button>
                    <button className="swiper-button-next">Next</button>
                  </div>
                </div>
              </Swiper>
              <div>
                <button onClick={() => cardUpdate(data)}>수정</button>
                {update ? <UpdateCard currentCard={currentCard} update={update}></UpdateCard> : <div></div>}
                <button onClick={() => cardDelete(data.id)}>삭제</button>
                <div>날짜</div>
                <div>{data.title}</div>
                <div>{data.content}</div>
              </div>
            </div>
          );
        })}
        <CreateCard addCard={addCard}></CreateCard>
      </div>
    </>
  );
};

export default SwiperContainer;