/**
 * 네이버 로그인을 한 후, 네이버 인증서버로부터 인가 코드를 받아온 후에
 * 리다이렉트할 화면
 */

import { useDispatch } from 'react-redux';
import { SET_TOKEN } from '../store/Auth';
import { setRefreshToken } from '../storage/Cookies';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Naver = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = new URL(window.location.href).searchParams.get('accessToken');
  const refreshToken = new URL(window.location.href).searchParams.get('refreshToken');
  console.log('access_Token: ' + accessToken);
  console.log('refresh_Token: ' + refreshToken);

  setRefreshToken(refreshToken);
  //store에 Access Token 저장하도록 Action Dispatch
  //참고: /store/Auth.js
  dispatch(SET_TOKEN(accessToken));

  useEffect(() => {
    navigate('/mypage');
  });
};

export default Naver;
