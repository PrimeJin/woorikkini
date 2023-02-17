import React from 'react';
import { Link } from 'react-router-dom';

const GoogleButton = () => {
  return (
    <a href="https://i8a804.p.ssafy.io/api/oauth2/authorize/google?redirect_uri=https://i8a804.p.ssafy.io/oauth/callback/google">
      <div className="google-button">
        <img src={'img/구글로그인버튼.png'} height="100%" alt="google" />
      </div>
    </a>
  );
};

export default GoogleButton;
