/**
 * 인증받은 사용자만 접근할 수 있도록 하는 PrivateRoute
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export default function PrivateRoute({ children }) {
  // const location = useLocation();
  // const { isAuth } = CheckToken(location.key);

  const accessToken = useSelector((state) => state.token.accessToken);

  return accessToken === undefined ? <Navigate to="/user/login" /> : children;
}
