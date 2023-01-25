/**
 * 로그아웃 누르면 호출될 페이지
 * 상세기능 구현은 /api/Users.js 참고
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCookieToken, removeCookieToken } from '../storage/Cookies';
import { DELETE_TOKEN } from '../store/Auth';
import { logoutUser } from '../api/Users';

const LogoutPage = () => {
  //store에서 Access Token 가져오기
  const { accessToken } = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Cookie에 저장된 Refresh Token 가져오기
  const refreshToken = getCookieToken();

  async function logoutFunc() {
    //Backend에서 넘어온 응답
    const response = await logoutUser({ refresh_token: refreshToken }, accessToken);

    //응답이 있을 경우
    if (response.status) {
      //store에 저장된 Access Token 삭제
      dispatch(DELETE_TOKEN());
      //Cookie에 저장된 Refresh Token 삭제
      removeCookieToken();
      return navigate('/');
    } else {
      window.location.reload();
    }
  }

  //처음 컴포넌트가 요청된 때만 실행되도록
  useEffect(() => {
    logoutFunc();
  }, []);

  return (
    <div>
      <Link to="/" />
    </div>
  );
};

export default LogoutPage;
