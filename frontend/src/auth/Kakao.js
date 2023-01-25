/**
 * 카카오 로그인을 한 후, 카카오 인증서버로부터 인가 코드를 받아온 후에
 * 리다이렉트할 화면
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { KakaoLogin } from '../api/KakaoLogin';
const Kakao = (props) => {
  const dispatch = useDispatch();

  //인가코드(code?뒷부분이 인가코드이므로 따온다)
  let code = new URL(window.location.href).searchParams.get('code');

  //인가코드를 받아오면 백엔드로 넘기기
  // v 이렇게 쓰지말래
  // React.useEffect(async () => {
  //   await dispatch(kakaoLogin(code));
  // }, []);
  React.useEffect(() => {
    async function fetchData() {
      await dispatch(KakaoLogin(code));
    }
    fetchData();
  }, []);
};

export default Kakao;
