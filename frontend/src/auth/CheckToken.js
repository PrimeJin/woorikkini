/* eslint-disable max-lines-per-function */
/**
 * 로그인된 유저 전용 페이지를 만들기위해
 * JWT토큰 인증을 확인하는 페이지
 * 인증됐는지 여부를 판단하는 isAuth state 반환
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCookieToken, removeCookieToken } from '../storage/Cookies';
import { requestToken } from '../api/Users';
import { SET_TOKEN, DELETE_TOKEN } from '../store/Auth';

export const CheckToken = (key) => {
  const [isAuth, setIsAuth] = useState('인증 중...');
  const { authenticated, expireTime } = useSelector((state) => state.token);
  const refreshToken = getCookieToken();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthToken = async () => {
      //Refresh Token이 없음
      if (refreshToken === undefined) {
        dispatch(DELETE_TOKEN());
        setIsAuth('인증 실패');
        console.log('인증 실패: 리프레시 토큰 없음');
      } else {
        //토큰이 인증됐고, 만료가 아직 안됐으면
        if (authenticated && new Date().getTime() < expireTime) {
          setIsAuth('인증 성공');
          console.log('인증 성공: 유효기간 확인');
        } else {
          //Refresh Token을 활용해서 Access Token 재발급 요청
          // const response = await requestToken(refreshToken);

          // if (response.status / 100 === 2) {
          //   const accessToken = response.json.access_token;
          //   console.log(response);
          //   dispatch(SET_TOKEN(accessToken));
          //   setIsAuth('인증 성공');
          //   console.log('인증 성공: 토큰 재발급');
          // }
          // } else {
          dispatch(DELETE_TOKEN());
          removeCookieToken();
          setIsAuth('인증 실패');
          console.log('인증 실패: 토큰 유효기간 만료');
        }
      }
    };
    checkAuthToken();
  }, [refreshToken, dispatch, key]);

  return {
    isAuth,
  };
};
