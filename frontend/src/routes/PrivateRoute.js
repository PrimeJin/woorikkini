/**
 * 인증받은 사용자만 접근할 수 있도록 하는 PrivateRoute
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { CheckToken } from '../auth/CheckToken';

export default function PrivateRoute({ children }) {
  // const location = useLocation();
  // const { isAuth } = CheckToken(location.key);

  const isAuthenticated = useSelector((state) => state.token.authenticated);

  return isAuthenticated === null || isAuthenticated === false ? <Navigate to="/user/login" /> : children;
}
