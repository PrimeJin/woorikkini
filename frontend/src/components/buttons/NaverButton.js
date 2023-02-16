//딱히 이럴 이유까진 없지만 코드의 간결화를 위해 로그인버튼 컴포넌트 분리
//버튼 스타일을 디자인하고 싶다면 여기서 따로 관리해주면 더 좋다
import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const NaverButton = () => {
  return (
    <a href="https://i8a804.p.ssafy.io/api/oauth2/authorize/naver?redirect_uri=https://i8a804.p.ssafy.io/oauth/callback/naver">
      <div className="naver-button">
        <img src={'img/네이버로그인버튼.png'} height="100%" alt="" />
      </div>
    </a>
  );
};

export default NaverButton;
