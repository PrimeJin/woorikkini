import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

const KakaoButton = () => {
  return (
    <Link to="https://i8a804.p.ssafy.io/api/oauth2/authorize/kakao?redirect_uri=https://i8a804.p.ssafy.io/oauth/callback/kakao">
      <button type="button" className="kakao-button">
        <img src={'img/kakao_login.png'} width="222" height="50" alt="" />
      </button>
    </Link>
  );
};

export default KakaoButton;
