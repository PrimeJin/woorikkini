import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const NaverButton = () => {
  return (
    <Link to="https://i8a804.p.ssafy.io/api/oauth2/authorize/naver?redirect_uri=https://i8a804.p.ssafy.io/oauth/callback/naver">
      <button type="button" className="naver-button">
        <img src={'img/naver_login.png'} width="222" height="50" alt="" />
      </button>
    </Link>
  );
};

export default NaverButton;
