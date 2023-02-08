import React, { useState } from 'react';
import axios from 'axios';
// import Modal from '../../components/Modal';
import styles from './ReportModal.module.css';

function ReportUser() {
  const [reason, setReason] = useState('');
  const onReason = (e) => {
    setReason(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    if (reason == '') {
      alert('신고사유를 선택해주세요.');
    } else {
      e.preventDefault();
      axios({
        url: 'https://i8a804.p.ssafy.io/api/report',
        method: 'POST',
        data: reason,
      })
        .then((res) => {
          if (res.data.message === 'success') {
            alert('신고가 접수되었습니다.');
            // 모달창 닫기
          }
        })
        .catch((err) => {
          console.log(err);
          alert('다시 시도해주시기 바랍니다.');
        });
    }
  };
}
return (
  <React.Fragment>
    <div className={modalOpen ? `${styles.modal} ${styles.openModal}` : styles.modal}>
      {modalOpen ? (
        <section>
          <header>신고사유</header>
          <main>
            <fieldset>
              <label>
                <input type="radio" value="first" name="reason" onClick={onReason} />
                욕설 및 비방
              </label>
              <label>
                <input type="radio" value="second" name="reason" onClick={onReason} />
                상업성 스팸 및 홍보
              </label>
              <label>
                <input type="radio" value="third" name="reason" onClick={onReason} />
                성희롱
              </label>
              <label>
                <input type="radio" value="fourth" name="reason" onClick={onReason} />
                불쾌한 표현
              </label>
              <label>
                <input type="radio" value="fifth" name="reason" onClick={onReason} />
                기타
                <textarea></textarea>
              </label>
            </fieldset>
          </main>
          <footer>
            <button className={styles.ok_btn} onClick={onSubmit}>
              확인
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  </React.Fragment>
);
export default ReportUser;
