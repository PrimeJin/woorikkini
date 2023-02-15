import styles from './Notice.module.css';
import styles1 from './admin/Admin.module.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import Navbar from './Navbar';
import PageLogo from './PageLogo';

function Notice() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState('');
  const navigate = useNavigate();

  function getList() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/notice?page=${page - 1}&limit=10`,
      method: 'GET',
    })
      .then((res) => {
        setList(res.data.noticeList.content);
        setCount(res.data.noticeList.totalPages);
      })
      .catch((err) => {
        if (err.response.data.message === 'fail') {
          alert('로그인이 필요한 서비스입니다.');
          navigate('/user/login');
        } else {
          alert('유효하지 않은 요청입니다.');
          console.log(err, '공지사항 에러');
        }
      });
  }

  useEffect(() => {
    getList();
  }, [page]);

  function pageChange(e, page) {
    setPage(page);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PageLogo />
        <h1 style={{ fontSize: '50px' }}>공지사항</h1>
        <Navbar />
      </div>
      <div
        style={{
          justifyContent: 'center',
          display: 'flex',
          flexFlow: 'wrap row',
        }}
      >
        <div className={`${styles1.noticeTable} ${styles.notice}`}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>번호</th>
                <th style={{ width: '70%' }}>제목</th>
                <th style={{ width: '15%' }}>작성일자</th>
              </tr>
            </thead>
            {list.map((notice, index) => (
              <NoticeList key={index} notice={notice} />
            ))}
          </table>
          <Pagination className={styles.page} count={count} page={page} onChange={pageChange} />
        </div>
      </div>
    </div>
  );
}

export default Notice;

function NoticeList(props) {
  const id = props.notice.noticeId;
  const title = props.notice.noticeTitle;
  const time = props.notice.createdTime.substr(0, 10);

  return (
    <tbody>
      <tr>
        <td>{id}</td>
        <td>
          <Link to={`${props.notice.noticeId}`} style={{ textDecoration: 'none', color: 'black' }}>
            {title}
          </Link>
        </td>
        <td>{time}</td>
      </tr>
    </tbody>
  );
}