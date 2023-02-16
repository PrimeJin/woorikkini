import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';

function Admin() {
  const [noticeList, setNoticeList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [statsList, setStatsList] = useState({
    ageStatsList: [],
    genderStatsList: [],
    keywordStatsList: [],
  });

  function getList() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/notice?page=0&limit=5`,
      method: 'GET',
    })
      .then((res) => {
        setNoticeList(res.data.noticeList.content);
      })
      .catch((err) => {
        console.log(err, '대시보드 공지사항 에러');
      });

    axios({
      url: `https://i8a804.p.ssafy.io/api/report`,
      method: 'GET',
    })
      .then((res) => {
        setReportList(res.data.reportList);
      })
      .catch((err) => {
        console.log(err, '대시보드 신고내역 에러');
      });
    axios({
      url: `https://i8a804.p.ssafy.io/api/user/`,
      method: 'GET',
    })
      .then((res) => {
        setUsersList(res.data.userList);
      })
      .catch((err) => {
        console.log(err, '대시보드 회원조회 에러');
      });
    axios({
      url: `https://i8a804.p.ssafy.io/api/stats`,
      method: 'GET',
    })
      .then((res) => {
        setStatsList(res.data);
      })
      .catch((err) => {
        console.log(err, '대시보드 회원통계 에러');
      });
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <div className={styles.admin}></div>
      <AdminSidebar />
      <div
        style={{
          marginLeft: '150px',
          justifyContent: 'center',
          display: 'flex',
          flexFlow: 'wrap row',
        }}
      >
        <h1 style={{ width: '100%' }}>대시보드</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            marginInline: '5%',
            marginBlock: '1%',
            height: '600px',
            width: '100%',
            gridGap: '5%',
          }}
        >
          <Link to="notice" className={styles.dash}>
            <h4>공지사항</h4>
            {noticeList.map((notice, i) => (
              <div key={i}>
                <span>{notice.createdTime.substr(0, 10)}</span>
                <span>{notice.noticeTitle}</span>
              </div>
            ))}
          </Link>
          <Link to="allUsers" className={styles.dash}>
            <h4>회원조회</h4>
            {usersList.map((user, i) => (
              <div key={i} style={{ justifyContent: 'space-between' }}>
                <span>{user.userName}</span>
                <span>{user.userEmail}</span>
                <span>{user.createdTime.slice(0, 10)}</span>
              </div>
            ))}
          </Link>
          <Link to="report" className={styles.dash}>
            <h4>신고내역</h4>
            {reportList.map((report, i) => (
              <div key={i}>
                <span>{report.createdTime.slice(0, 10)}</span>
                <span>{report.reportContent}</span>
              </div>
            ))}
          </Link>
          <Link to="stats" className={styles.dash}>
            <h4>회원통계</h4>
            <div>
              <div
                style={{
                  width: '300px',
                  height: '130px',
                  flexFlow: 'row wrap',
                  justifyContent: 'center',
                  margin: 0,
                }}
              >
                <h5 style={{ width: '100%', marginTop: 0, marginBottom: 5 }}>연령 통계</h5>
                <ResponsivePie
                  data={statsList.ageStatsList}
                  sortByValue={true}
                  colors={{ scheme: 'nivo' }}
                  arcLabelsSkipAngle={1}
                  arcLabel={function (e) {
                    return e.id + ' (' + e.value + ')';
                  }}
                  enableArcLinkLabels={false}
                  arcLabelsTextColor="black"
                />
              </div>
              <div
                style={{
                  width: '300px',
                  height: '130px',
                  flexFlow: 'row wrap',
                  margin: 0,
                }}
              >
                <h5 style={{ width: '100%', marginTop: 0, marginBottom: 5 }}>키워드 통계</h5>
                <ResponsivePie
                  data={statsList.keywordStatsList}
                  sortByValue={true}
                  colors={{ scheme: 'paired' }}
                  arcLabel={function (e) {
                    return e.id + ' (' + e.value + ')';
                  }}
                  enableArcLinkLabels={false}
                  arcLabelsSkipAngle={1}
                  arcLabelsTextColor="black"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Admin;
