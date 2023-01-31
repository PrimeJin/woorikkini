/**
 * 인증받지 않은 사용자(비회원)도 접근할 수 있는 페이지를 위한 라우트
 */
import React from 'react';
import { Navigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { CheckToken } from '../auth/CheckToken';

export default function PublicRoute({ children }) {
  const location = useLocation();
  const { isAuth } = CheckToken(location.key);

  if (isAuth === '인증 성공') {
    return <Navigate to="/" state={{ from: location }} />;
  } else if (isAuth === '인증 중...') {
    return <></>;
  }
  return children;
}
