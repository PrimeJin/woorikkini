import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Notice.module.css';
import styles1 from './admin/Admin.module.css';
import Navbar from './Navbar';
import PageLogo from './PageLogo';

const NoticeDetail = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');
  const params = useParams();

  function getDetail() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/notice/${params.noticeId}`,
      methods: 'GET',
    })
      .then((res) => {
        setTitle(res.data.notice.noticeTitle);
        setContent(res.data.notice.noticeContent);
        setTime(res.data.notice.createdTime.substr(0, 10));
      })
      .catch((err) => {
        if (err.response.data.message === 'fail') {
          alert('로그인이 필요한 서비스입니다.');
          navigate('/user/login');
        } else {
          alert('유효하지 않은 요청입니다.');
          console.log(err, '공지사항 디테일 에러');
        }
      });
  }

  useEffect(() => {
    getDetail();
  }, []);

  const navigate = useNavigate();

  function list() {
    navigate('/notice');
  }

  return (
    <div>
      <PageLogo />
      <Navbar />
      <h1 style={{ fontSize: '50px' }}>공지사항</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexFlow: 'wrap row',
        }}
      >
        <div className={styles.noticeDetail}>
          <div className={styles.detailBox}>
            <p className={styles1.title}>{title}</p>
            <div style={{ marginLeft: '80%', marginBottom: '2%' }}>
              <small>작성일자: {time}</small>
            </div>
            <hr />
            <pre className={styles1.content}>{content}</pre>
          </div>
          <div
            style={{
              width: '100%',
            }}
          >
            <button className={styles.btn} onClick={list}>
              목록으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
