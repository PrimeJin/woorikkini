import './CardContainer.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateCard from './CreateCard';
import UpdateCard from './UpdateCard';

// 사진 슬라이드
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

// 카드
const SwiperContainer = () => {
  SwipeCore.use([Navigation, Pagination, Autoplay]);
  const [cardList, setCardList] = useState([{}]);

  // 전체 카드 목록 보여주기
  const getCardList = async () => {
    try {
      const res = await axios.get('https://.../memory/');
      const inputData = res.data.map((rowData) => ({
        id: rowData.memory_id,
        img: rowData.save_filename,
        date: rowData.memory_reg_date,
        title: rowData.memory_title,
        content: rowData.memory_content,
      }));
      setCardList(cardList.concat(inputData));
    } catch (e) {
      console.error(e);
    }
  };

  // 페이지 실행 시 바로 진행
  useEffect(() => {
    getCardList();
  }, []);

  // 카드 추가하기
  const addCard = (event) => {
    console.log('$', event);

    // 새롭게 배열 데이터를 추가하는 함수
    const newCard = {
      id: cardList.length + 1,
      img: event.img,
      title: event.title,
      content: event.content,
    };
    setCardList([...cardList, newCard]);
  };

  // 카드 삭제하기
  const cardDelete = (id) => {
    // card.id 가 매개변수로 작성하지 않는 데이터들만 추출해서 새로운 배열을 만듬
    // = card.id 가 id 인 것을 제거함
    // setCardList(cardList.filter((card) => card.id !== id));

    axios
      .delete(`http://.../memory/${id}`, {
        data: {
          id,
        },
      })
      .then(() => {
        setModalOpen(false);
        alert('추억이 삭제되었습니다.');
      })
      .catch((err) => {
        console.log(err);
        alert('다시 시도해주시기 바랍니다.');
      });
  };

  // 카드 수정하기
  const [update, setUpdate] = useState(false);
  const [currentCard, setCurrentCard] = useState({});
  const cardUpdate = (data) => {
    setUpdate(!update);
    const card = data;
    setCurrentCard(card);
  };

  // 카드 리스트 수정하기
  const cardListUpdate = (targetId, newCard) => {
    setCardList(
      cardList.map((card) =>
        card.id === targetId ? { ...card, img: newCard.img, title: newCard.title, content: newCard.content } : card,
      ),
    );
  };
  console.log('카드 리스트 ->', cardList);

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
                    <SwiperSlide>
                      {/* 이미지 들어갈 자리 */}
                      <img src={data.img} className="slider-image-wrapper" alt="SliderImg" />
                    </SwiperSlide>
                    {/* 
                    {data.img.map((item, id) => {
                      return (
                        <SwiperSlide key={id}> */}
                    {/* 이미지 들어갈 자리 */}
                    {/* <img src={item} className="slider-image-wrapper" alt="SliderImg" />
                        </SwiperSlide>
                      );
                    })} */}
                  </div>

                  <div className="slider-buttons">
                    <button className="swiper-button-prev">Prev</button>
                    <button className="swiper-button-next">Next</button>
                  </div>
                </div>
              </Swiper>
              <div>
                <button onClick={() => cardUpdate(data)}>수정</button>
                {update ? (
                  <UpdateCard
                    currentCard={currentCard}
                    cardUpdate={cardUpdate}
                    cardListUpdate={cardListUpdate}
                  ></UpdateCard>
                ) : (
                  <div></div>
                )}
                <button onClick={() => cardDelete(data.id)}>삭제</button>
                <div>{data.date}</div>
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
