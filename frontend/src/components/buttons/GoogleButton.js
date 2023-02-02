import React from 'react';
import { GoogleNewLogin } from '../../api/GoogleNewLogin';
import { GOOGLE_AUTH_URL } from '../../data/OAuth';

const GoogleButton = () => {
  return (
    <button type="button" onClick={GoogleNewLogin()}>
      <span>구글 로그인</span>
    </button>
  );
};

export default GoogleButton;
