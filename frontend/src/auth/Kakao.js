/**
 * 카카오 로그인을 한 후, 카카오 인증서버로부터 인가 코드를 받아온 후에
 * 리다이렉트할 화면
 */

import { useDispatch } from 'react-redux';
import { SET_TOKEN } from '../store/Auth';
import { SET_USER } from '../store/User';
import { setRefreshToken } from '../storage/Cookies';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Kakao = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const id = new URL(window.location.href).searchParams.get('userId');
  const nickname = new URL(window.location.href).searchParams.get('nickName');
  const accessToken = new URL(window.location.href).searchParams.get('accessToken');
  const refreshToken = new URL(window.location.href).searchParams.get('refreshToken');

  dispatch(SET_USER({ id: id, nickname: nickname }));
  setRefreshToken(refreshToken);
  dispatch(SET_TOKEN(accessToken));

  useEffect(() => {
    navigate('/room');
  });
};

export default Kakao;
