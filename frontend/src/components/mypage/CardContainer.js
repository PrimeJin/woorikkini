import styles from './CardContainer.module.css';
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
      axios({
        url: `https://i8a804.p.ssafy.io/api/memory?userId=${userId}`,
        method: 'GET',
      }).then((res) => {
        console.log('?', res);
        const response = res;
        const responseData = response.data.memoryList.map((rowData) => ({
          id: rowData.memoryId,
          img: rowData.photoPathList,
          date: rowData.createdTime.slice(0, 10),
          title: rowData.memoryTitle,
          content: rowData.memoryContent,
        }));
        setCardList(responseData);
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
    axios
      .delete(`https://i8a804.p.ssafy.io/api/memory/${id}`, {
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
    const updateModal = true;
    setUpdate(updateModal);
    const card = data;
    setCurrentCard(card);
  };
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          maxHeight: '490px',
          margin: '3% 5% 0.5% 5%',
        }}
        className={styles.scroll}
      >
        <div className={styles.cardlist_top}>
          {cardList.map((data, idx) => {
            return (
              <div key={idx} className={styles.card_whole}>
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
                  className={styles.swiper_container}
                >
                  <div className={styles.swiper_wrapper}>
                    <div className={`${styles.card} ${styles.swiper_slide}`}>
                      {data.img.map((filePath, id) => {
                        return (
                          <SwiperSlide key={id}>
                            {/* 이미지 들어갈 자리 */}
                            <img src={filePath} className={styles.slider_image_wrapper} alt="SliderImg" />
                            <p>{console.log(filePath)}</p>
                          </SwiperSlide>
                        );
                      })}
                    </div>

                    <div className={styles.slider_buttons}>
                      <button className={styles.swiper_button_prev}>Prev</button>
                      <button className={styles.swiper_button_next}>Next</button>
                    </div>
                  </div>
                </Swiper>
                <div
                  style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '300px',
                  }}
                >
                  <div>
                    <div style={{ justifyContent: 'space-between', width: '300px', display: 'flex' }}>
                      <img
                        src={'img/수정 아이콘.png'}
                        onClick={() => {
                          cardUpdate(data);
                          openModal();
                        }}
                        style={{ width: 25, height: 25, margin: '1% 5%', cursor: 'pointer' }}
                      ></img>
                      <div style={{ fontWeight: '900', fontSize: 'small', lineHeight: 2.5 }}>{data.date}</div>
                      <img
                        src={'img/삭제 아이콘.png'}
                        onClick={() => cardDelete(data.id)}
                        style={{ width: 25, height: 25, margin: '1% 5%', cursor: 'pointer' }}
                      ></img>
                    </div>
                    <div style={{ fontWeight: '900' }}>{data.title}</div>
                    <div style={{ fontWeight: '500', fontSize: 'medium' }}>{data.content}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {update ? (
            <UpdateCard
              style={{ display: 'none' }}
              currentCard={currentCard}
              getCardList={getCardList}
              closeModal={closeModal}
              modalOpen={modalOpen}
            ></UpdateCard>
          ) : (
            <div style={{ display: 'none' }}></div>
          )}
          <CreateCard getCardList={getCardList}></CreateCard>
        </div>
      </div>
    </>
  );
};

export default SwiperContainer;
