//딱히 이럴 이유까진 없지만 코드의 간결화를 위해 로그인버튼 컴포넌트 분리
//버튼 스타일을 디자인하고 싶다면 여기서 따로 관리해주면 더 좋다
import React from 'react';
import { KAKAO_AUTH_URL } from '../../data/OAuth';
import { KakaoNewLogin } from '../../api/KakaoNewLogin';
import './Button.css';
import { Link } from 'react-router-dom';
import Kakao from '../../auth/Kakao';

const KakaoButton = () => {
  return (
    // <button type="button" className="kakao-button" onClick={KakaoNewLogin()}>
    //   <img src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg" width="222" alt="" />
    // </button>
    <Link to="http://i8a804.p.ssafy.io:8040/oauth2/authorize/kakao?redirect_uri=http://localhost:3000/oauth/callback/kakao">
      <button type="button" className="kakao-button">
        <img src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg" width="222" alt="" />
      </button>
    </Link>
  );
};

export default KakaoButton;
