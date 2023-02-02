import React from 'react';
import { GoogleNewLogin } from '../../api/GoogleNewLogin';

const GoogleButton = () => {
  return (
    <button type="button" onClick={GoogleNewLogin()}>
      <span>구글 로그인</span>
    </button>
  );
};

export default GoogleButton;
