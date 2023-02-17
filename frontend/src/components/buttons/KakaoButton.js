//딱히 이럴 이유까진 없지만 코드의 간결화를 위해 로그인버튼 컴포넌트 분리
//버튼 스타일을 디자인하고 싶다면 여기서 따로 관리해주면 더 좋다
import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

const KakaoButton = () => {
  return (
    <a href="https://i8a804.p.ssafy.io/api/oauth2/authorize/kakao?redirect_uri=https://i8a804.p.ssafy.io/oauth/callback/kakao">
      <div className="kakao-button">
        <img src={'img/카카오로그인버튼.png'} height="100%" alt="" />
      </div>
    </a>
  );
};

export default KakaoButton;
