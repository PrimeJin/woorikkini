/**
 * 로그아웃 누르면 호출될 페이지
 * 상세기능 구현은 /api/Users.js 참고
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { getCookieToken, removeCookieToken } from '../storage/Cookies';
import { DELETE_TOKEN } from '../store/Auth';
import { DELETE_USER } from '../store/User';
import { logoutUser } from '../api/Users';

const LogoutPage = () => {
  //store에서 Access Token 가져오기
  const { accessToken } = useSelector((state) => state.token);
  const { id } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Cookie에 저장된 Refresh Token 가져오기
  const refreshToken = getCookieToken();

  async function logoutFunc() {
    axios({
      methods: 'GET',
      url: `https://i8a804.p.ssafy.io/api/user/logout/${id}`,
      headers: {
        'Content-type': 'application/json',
      },
      id,
    }).then((response) => {
      if (response.status === 200 || 202) {
        console.log('로그아웃 성공');
        //store에 저장된 Access Token 삭제
        dispatch(DELETE_TOKEN());
        dispatch(DELETE_USER());
        // localStorage.removeItem('userId');
        // localStorage.removeItem('userNickname');
        localStorage.clear();
        //Cookie에 저장된 Refresh Token 삭제
        removeCookieToken();
        navigate('/user/login');
      } else {
        console.log('로그아웃 실패');
        navigate(-1);
      }
    });
  }

  //처음 컴포넌트가 요청된 때만 실행되도록
  useEffect(() => {
    logoutFunc();
  }, []);

  return <div></div>;
};

export default LogoutPage;
