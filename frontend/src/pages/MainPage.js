import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MainPage() {
  const id = useSelector((state) => state.user.id);

  return (
    <div>
      <h1>홈페이지</h1>
      <h2>회원{id} 님 환영합니다</h2>
      <Link to="/user/login">로그인 테스트</Link>
      <br />
      <Link to="/user/logout">로그아웃 테스트</Link>
      <br />
      <Link to="/user/signup">회원가입 테스트</Link>
      <br />
      <Link to="/mypage">마이페이지 테스트</Link>
      <br />
      <Link to="/user/modify">회원정보수정 테스트</Link>
      <br />
      <Link to="/user/delete">회원탈퇴 테스트</Link>
      <br />
      <Link to="/user/findpw">비밀번호 찾기 테스트</Link>
      <br />
      <Link to="/test">Openvidu 테스트</Link>
      <br />
      <Link to="/admin">관리자 테스트</Link>
      <br />
      <Link to="/room">방 테스트</Link>
    </div>
  );
}

export default MainPage;
