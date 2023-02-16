/**
 * 구글 로그인을 한 후, 구글 인증서버로부터 인가 코드를 받아온 후에
 * 리다이렉트할 화면
 */

import { useDispatch } from 'react-redux';
import { SET_TOKEN } from '../store/Auth';
import { SET_USER } from '../store/User';
import { setRefreshToken } from '../storage/Cookies';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Google = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // //인가코드(code?뒷부분이 인가코드이므로 따온다)
  // let code = new URL(window.location.href).searchParams.get('code');

  //url에 있는 accessToken refreshToken 따오기
  const id = new URL(window.location.href).searchParams.get('userId');
  const nickname = new URL(window.location.href).searchParams.get('nickName');

  const accessToken = new URL(window.location.href).searchParams.get('accessToken');
  const refreshToken = new URL(window.location.href).searchParams.get('refreshToken');

  console.log('userId: ' + id);
  console.log('nickname: ' + nickname);
  console.log('access_Token: ' + accessToken);
  console.log('refresh_Token: ' + refreshToken);

  dispatch(SET_USER({ id: id, nickname: nickname }));
  localStorage.clear();
  localStorage.setItem('userId', id);
  localStorage.setItem('userNickname', nickname);
  localStorage.setItem('accessToken', accessToken);

  setRefreshToken(refreshToken);
  //store에 Access Token 저장하도록 Action Dispatch
  //참고: /store/Auth.js
  dispatch(SET_TOKEN(accessToken));

  useEffect(() => {
    navigate('/room');
  });
  //인가코드를 받아오면 백엔드로 넘기기
  // React.useEffect(() => {
  //   async function fetchData() {
  //     await dispatch(GoogleLogin(code));
  //   }
  //   fetchData();
  // }, []);
};

export default Google;
