/**
 * Cookie를 저장할 Storage
 * 여기에 Refresh Token을 저장하겠습니다
 */
import { Cookies } from 'react-cookie';

const cookies = new Cookies(); // 쿠키 생성

// refresh token 저장하는 메소드(Refresh Token 필요)
export const setRefreshToken = (refreshToken) => {
  const today = new Date();
  const expireDate = today.setDate(today.getDate() + 14); // 유효기간 14일

  return cookies.set('refreshToken', refreshToken, {
    sameSite: 'strict',
    path: '/',
    expires: new Date(expireDate),
  });
};

// 쿠키에 저장된 refresh token 가져오는 메소드
export const getCookieToken = () => {
  return cookies.get('refreshToken');
};

// 쿠키에서 refresh token 제거하는 메소드
export const removeCookieToken = () => {
  return cookies.remove('refreshToken', { sameSite: 'strict', path: '/' });
};
