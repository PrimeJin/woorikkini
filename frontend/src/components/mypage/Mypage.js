import './Mypage.css';
import React from 'react';
import Logo from '../PageLogo';
import NoticeIcon from '../NoticeIcon';
import Nav from '../Navbar';
import CardContainer from './CardContainer';

function Mypage() {
  return (
    <div>
      <div className="all">
        <Logo></Logo>
        <div className="title">
          <p style={{ fontSize: 50, marginBottom: 0 }}>나의 먹기록</p>
          <br />
          <p style={{ marginTop: 0 }}>내가 기록하고 싶은 순간들</p>
        </div>
        <Nav></Nav>
      </div>
      <CardContainer></CardContainer>
      <NoticeIcon></NoticeIcon>
    </div>
  );
}

export default Mypage;
