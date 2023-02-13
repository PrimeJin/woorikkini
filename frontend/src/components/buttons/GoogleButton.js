import React from 'react';
import { Link } from 'react-router-dom';

const GoogleButton = () => {
  return (
    <Link to="https://i8a804.p.ssafy.io/api/oauth2/authorize/google?redirect_uri=https://i8a804.p.ssafy.io/oauth/callback/google">
      <button type="button" className="google-button">
        <img src={'img/google_login.png'} width="222" height="50" alt="google" />
      </button>
    </Link>
  );
};

export default GoogleButton;
