import React, { useState } from 'react';
import axios from 'axios';
import styles from './ReportModal.module.css';

const ReportUser = (props) => {
  const closeModal = props.closeModal;
  const reportModalOpen = props.reportModalOpen;
  const currentUserId = props.currentUserId;
  const reportedUserId = props.reportedUserId;
  // const { closeModal, reportModalOpen, currentUserId, reportedUser } = props;
  const [reason, setReason] = useState('');
  const [reasonDetail, setReasonDetail] = useState('');
  const onReason = (e) => {
    setReason(e.target.value);
  };
  const onContent = (e) => {
    setReasonDetail(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    if (reason == '') {
      alert('신고사유를 선택해주세요.');
    } else if (reasonDetail == '') {
      alert('신고 내용을 입력해주세요.');
    } else {
      e.preventDefault();
      const reportData = {
        reportCategory: reason,
        reportContent: reasonDetail,
        reportUserId: currentUserId,
        reportedUserId: reportedUserId,
      };
      console.log(reportData);
      axios({
        url: 'https://i8a804.p.ssafy.io/api/report',
        method: 'POST',
        data: reportData,
      })
        .then((res) => {
          console.log(res);
          if (res.data.message === 'success') {
            alert('신고가 접수되었습니다.');
          }
          // 모달창 닫기
          closeModal('close');
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
              <div className={styles.input_set}>
                <div>
                  <input type="radio" value="욕설 및 비방" name="reason" onClick={onReason} />
                  욕설 및 비방
                </div>
                <br />
                <div>
                  <input type="radio" value="상업성 스팸 및 홍보" name="reason" onClick={onReason} />
                  상업성 스팸 및 홍보
                </div>
                <br />
                <div>
                  <input type="radio" value="성희롱" name="reason" onClick={onReason} />
                  성희롱
                </div>
                <br />
                <div>
                  <input type="radio" value="불쾌한 표현" name="reason" onClick={onReason} />
                  불쾌한 표현
                </div>
                <br />
                <div>
                  <input type="radio" value="기타" name="reason" onClick={onReason} />
                  기타
                </div>
                <br />
                <div>
                  <textarea
                    style={{ resize: 'none', width: '90%', height: '80px' }}
                    onChange={onContent}
                    required
                  ></textarea>
                </div>
              </div>
            </main>
            <footer>
              <button value="Yes" className={styles.yes_btn} onClick={onSubmit}>
                신고
              </button>
              <div style={{ width: 20, backgroundColor: '#FEFAEF', justifyContent: 'center' }}></div>
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
