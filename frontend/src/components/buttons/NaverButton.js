//딱히 이럴 이유까진 없지만 코드의 간결화를 위해 로그인버튼 컴포넌트 분리
//버튼 스타일을 디자인하고 싶다면 여기서 따로 관리해주면 더 좋다
import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const NaverButton = () => {
  return (
    <Link to="http://i8a804.p.ssafy.io:8040/oauth2/authorize/naver?redirect_uri=http://localhost:3000/oauth/callback/naver">
      <button type="button" className="naver-button">
        <img src="https://static.nid.naver.com/oauth/big_g.PNG?version=js-2.0.1" width="222" alt="" />
      </button>
    </Link>
  );
};

export default NaverButton;
