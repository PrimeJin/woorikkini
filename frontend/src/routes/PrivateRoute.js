/**
 * 인증받은 사용자만 접근할 수 있도록 하는 PrivateRoute
 */
import { Outlet, Navigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { CheckToken } from '../auth/CheckToken';

export default function PrivateRoute() {
  const location = useLocation();
  const { isAuth } = CheckToken(location.key);

  if (isAuth === '인증 실패') {
    return <Navigate to="/user/login" state={{ from: location }} />;
  } else if (isAuth === '인증 중...') {
    return <></>;
  }

  return <Outlet />;
}
