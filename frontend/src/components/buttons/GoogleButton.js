import React from 'react';
import { Link } from 'react-router-dom';

const GoogleButton = () => {
  return (
    <Link to="http://i8a804.p.ssafy.io:8040/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth/callback/google">
      <div className="google-button">
        <img src={'img/구글로그인버튼.png'} height="100%" alt="google" />
      </div>
    </Link>
  );
};

export default GoogleButton;
