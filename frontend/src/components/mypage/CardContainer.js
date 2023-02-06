import './CardContainer.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
  const [cardList, setCardList] = useState([]);

  const userId = useSelector((state) => state.user.id);

  // 전체 카드 목록 보여주기
  function getCardList() {
    try {
      // axios.get('http://i8a804.p.ssafy.io:8040/memory');
      console.log('새로운 목록 불러오기');
      axios({
        url: `http://i8a804.p.ssafy.io:8040/memory?userId=${userId}`,
        method: 'GET',
      }).then((res) => {
        console.log(res);
        const response = res;
        const inputData = response.data.memoryList.map((rowData) => ({
          id: rowData.memoryId,
          // img: rowData.save_filename,
          date: rowData.createdTime.slice(0, 10),
          title: rowData.memoryTitle,
          content: rowData.memoryContent,
        }));
        // setCardList(cardList.concat(inputData));
        setCardList(inputData);
      });
    } catch (e) {
      console.error('*', e);
    }
  }

  // 페이지 들어가면 바로 실행
  useEffect(() => {
    getCardList();
  }, []);

  // 카드 삭제하기
  const cardDelete = (id) => {
    // card.id 가 매개변수로 작성하지 않는 데이터들만 추출해서 새로운 배열을 만듬
    // = card.id 가 id 인 것을 제거함
    // setCardList(cardList.filter((card) => card.id !== id));
    axios
      .delete(`http://i8a804.p.ssafy.io:8040/memory/${id}`, {
        data: {
          memoryId: id,
        },
      })
      .then(() => {
        alert('추억이 삭제되었습니다.');
        getCardList();
      })
      .catch((err) => {
        console.log(err);
        alert('다시 시도해주시기 바랍니다.');
      });
  };

  // 카드 수정하기
  const [update, setUpdate] = useState(false);
  const [currentCard, setCurrentCard] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const cardUpdate = (data) => {
    setUpdate(!update);
    const card = data;
    setCurrentCard(card);
    console.log('수정할거야', update);
  };
  const openModal = () => {
    setModalOpen(true);
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
                <button
                  onClick={() => {
                    cardUpdate(data);
                    openModal();
                  }}
                >
                  수정
                </button>
                {update ? (
                  <UpdateCard
                    currentCard={currentCard}
                    getCardList={getCardList}
                    update={update}
                    modalOpen={modalOpen}
                    // cardListUpdate={cardListUpdate}
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
        <CreateCard getCardList={getCardList}></CreateCard>
      </div>
    </>
  );
};

export default SwiperContainer;
