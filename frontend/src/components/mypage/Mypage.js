import styles from './Mypage.module.css';
import React from 'react';
import Logo from '../PageLogo';
import NoticeIcon from '../NoticeIcon';
import Nav from '../Navbar';
import CardContainer from './CardContainer';

function Mypage() {
  return (
    <div>
      <Logo />
      <Nav></Nav>
      <div className={styles.mypage}>
        <div className={styles.title}>
          <p style={{ fontSize: 50, marginBottom: 0 }}>나의 먹기록</p>
          <br />
          <p style={{ marginTop: 0, fontSize: 20 }}>내가 기록하고 싶은 순간들</p>
        </div>
      </div>
      <CardContainer></CardContainer>
      <NoticeIcon></NoticeIcon>
    </div>
  );
}

export default Mypage;
