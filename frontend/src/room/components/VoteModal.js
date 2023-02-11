import React from 'react';
// import Modal from '../../components/Modal';
import styles from './VoteModal.module.css';

function VoteUser() {
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <React.Fragment>
      <div className={modalOpen ? `${styles.modal} ${styles.openModal}` : styles.modal}>
        {modalOpen ? (
          <section>
            <header>투표하기</header>
            <main>
              <div>{User1}님의 강제 퇴장을 찬성하시나요?</div>
              <p>이 창은 30초 후 자동으로 닫힙니다.</p>
            </main>
            <footer>
              <button value="Yes" className={styles.ok_btn} onClick={onSubmit}>
                찬성
              </button>
              <div style={{ width: 30 }}></div>
              <button value="No" className={styles.close_bottom} onClick={onSubmit}>
                반대
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    </React.Fragment>
  );
}
export default VoteUser;
