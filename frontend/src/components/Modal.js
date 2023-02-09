import React from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const Modal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, register, header } = props;

  Modal.propsTypes = {
    props: PropTypes.node.isRequired,
  };

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? `${styles.modal} ${styles.openModal}` : styles.modal}>
      {open ? (
        <section>
          <header>
            {header}
            <button className={styles.close_top} onClick={close}>
              &#10006;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button className={styles.register} onClick={register}>
              등록하기
            </button>
            <div style={{ width: 30 }}></div>
            <button className={styles.close_bottom} onClick={close}>
              취소하기
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;
