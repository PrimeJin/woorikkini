import React, { useState } from 'react';
import axios from 'axios';
// import Modal from '../../components/Modal';
import styles from './ReportModal.module.css';

const ReportUser = (props) => {
  const { closeModal, reportModalOpen, currentUserId, reportedUser } = props;
  // const reportModalOpen = props.reportModalOpen;
  const [reason, setReason] = useState('');
  const [reasonDetail, setReasonDetail] = useState('');
  const onReason = (e) => {
    console.log('이유가 뭐야', e.target.value);
    setReason(e.target.value);
  };
  const onContent = (e) => {
    console.log('자세한 이유?', e.currentTarget.value);
    setReasonDetail(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    if (reason == '') {
      alert('신고사유를 선택해주세요.');
    } else {
      e.preventDefault();
      const reportData = {
        reportCategory: reason,
        reportContent: reasonDetail,
        reportUser: currentUserId,
        reportedUser: reportedUser,
      };
      console.log(reportData);
      axios({
        url: 'https://i8a804.p.ssafy.io/api/report',
        method: 'POST',
        data: reportData,
      })
        .then((res) => {
          if (res.data.message === 'success') {
            alert('신고가 접수되었습니다.');
            // 모달창 닫기
            closeModal();
          }
        })
        .catch((err) => {
          console.log(err);
          alert('다시 시도해주시기 바랍니다.');
        });
    }
  };
  return (
    <>
      <div className={reportModalOpen ? `${styles.modal} ${styles.openModal}` : styles.modal}>
        {reportModalOpen ? (
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
                </label>
                <textarea style={{ resize: 'none', width: '90%' }} onChange={onContent} required></textarea>
              </fieldset>
            </main>
            <footer>
              <button value="Yes" className={styles.yes_btn} onClick={onSubmit}>
                신고
              </button>
              <div style={{ width: 30, backgroundColor: '#FEFAEF' }}></div>
              <button value="No" className={styles.no_btn} onClick={closeModal}>
                취소
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    </>
  );
};

export default ReportUser;
