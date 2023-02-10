import React, { useState } from 'react';
// import Modal from '../../components/Modal';
import styles from './BanModal.module.css';

function BanUser() {
  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <React.Fragment>
      <div className={modalOpen ? `${styles.modal} ${styles.openModal}` : styles.modal}>
        {modalOpen ? (
          <section>
            <header>강제퇴장</header>
            <main>
              <div>과반 수 이상의 찬성으로 방에서 강제 퇴장되었습니다.</div>
              <p>이 창은 30초 후 자동으로 닫힙니다.</p>
            </main>
            <footer>
              <button className={styles.ok_btn} onClick={closeModal}>
                확인
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    </React.Fragment>
  );
}
export default BanUser;
