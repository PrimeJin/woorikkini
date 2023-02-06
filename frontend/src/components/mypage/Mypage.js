import './Mypage.css';
import React from 'react';
import Logo from '../PageLogo';
import NoticeIcon from '../NoticeIcon';
import Nav from '../Navbar';
import CardContainer from './CardContainer';

function Mypage() {
  return (
    <div>
      <div className="mypage">
        <Logo />
        <div className="title">
          <p style={{ fontSize: 50, marginBottom: 0 }}>나의 먹기록 &#127860; &#10024;</p>
          <br />
          <p style={{ marginTop: 0, fontSize: 20 }}>내가 기록하고 싶은 순간들 &#128248;</p>
        </div>
        <Nav></Nav>
      </div>
      <CardContainer></CardContainer>
      <NoticeIcon></NoticeIcon>
    </div>
  );
}

export default Mypage;
