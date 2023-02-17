import styles from './UserManual.module.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// 사진 슬라이드
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

function UserManual() {
  const navigate = useNavigate();
  const goMain = () => {
    navigate('/');
  };
  SwipeCore.use([Navigation, Pagination, Autoplay]);

  return (
    <>
      <header className={styles.manual_header}>
        <img src={'img/우리끼니로고.png'} style={{ width: '80px', height: '90px' }} />에 오신 것을 환영합니다!
      </header>
      <main>
        <div>
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
              <div className={styles.manual_slide}>
                <SwiperSlide>
                  <img src={'img/사용자매뉴얼/roomList_1.png'} className={styles.img} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={'img/사용자매뉴얼/roomList_2.png'} className={styles.img} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={'img/사용자매뉴얼/roomDetail_1.png'} className={styles.img} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={'img/사용자매뉴얼/roomDetail_2.png'} className={styles.img} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={'img/사용자매뉴얼/roomDetail_3.png'} className={styles.img} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={'img/사용자매뉴얼/mypage_1.png'} className={styles.img} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={'img/사용자매뉴얼/mypage_2.png'} className={styles.img} />
                </SwiperSlide>
              </div>

              <div className={styles.slider_buttons}>
                <button className={styles.swiper_button_prev}>Prev</button>
                <button className={styles.swiper_button_next}>Next</button>
              </div>
            </div>
          </Swiper>
        </div>
      </main>
      <footer className={styles.manual_footer}>
        우리끼니를 이용하러 가볼까요?
        <div onClick={goMain} className={styles.container}>
          <div>GO !</div>
        </div>
      </footer>
    </>
  );
}
export default UserManual;
