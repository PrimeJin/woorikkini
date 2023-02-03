import React from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div>
      <h1>홈페이지</h1>
      <Link to="/user/login">로그인 테스트</Link>
      <br />
      <Link to="/user/logout">로그아웃 테스트</Link>
    </div>
  );
}

export default MainPage;
