import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import React from 'react';
import Signup from './components/user/Signup';
import Mypage from './components/mypage/Mypage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ModifyPage from './pages/ModifyPage';
import Kakao from './auth/Kakao';
import Naver from './auth/Naver';
import Google from './auth/Google';
import DeletePage from './pages/DeletePage';
import ErrorPage from './pages/ErrorPage';
import PwFind from './components/PwFind';
import PwChange from './components/PwChange';
import AdminNotice from './components/admin/AdminNotice';
import AdminNoticeDetail from './components/admin/AdminNoticeDetail';
import AdminNoticeCreate from './components/admin/AdminNoticeCreate';
import AdminAllUsers from './components/admin/AdminAllUsers';
import AdminStats from './components/admin/AdminStats';
import AdminReport from './components/admin/AdminReport';
import Admin from './components/admin/Admin';
import Room from './components/Room';
import RoomDetail from './components/RoomDetail';
import Notice from './components/Notice';
import NoticeDetail from './components/NoticeDetail';
import { useDispatch } from 'react-redux';
import { SET_USER } from './store/User';
import { RESET_TOKEN } from './store/Auth';
import './App.css';
import { useEffect } from 'react';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import UserManual from './components/user/UserManual';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userNickname = localStorage.getItem('userNickname');
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(
        RESET_TOKEN({
          accessToken,
        }),
      );
      dispatch(SET_USER({ id: userId, nickname: userNickname }));
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <title>우리끼니</title>
      </Helmet>
      <BrowserRouter>
        <Routes>
          <Route
            path="/user/logout"
            element={
              <PrivateRoute>
                <LogoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/modify"
            element={
              <PrivateRoute>
                <ModifyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/delete"
            element={
              <PrivateRoute>
                <DeletePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <Mypage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/report"
            element={
              <PrivateRoute>
                <AdminReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <PrivateRoute>
                <AdminStats />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/allUsers"
            element={
              <PrivateRoute>
                <AdminAllUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/notice"
            element={
              <PrivateRoute>
                <AdminNotice />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/notice/:noticeId"
            element={
              <PrivateRoute>
                <AdminNoticeDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/notice/create"
            element={
              <PrivateRoute>
                <AdminNoticeCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/notice"
            element={
              <PrivateRoute>
                <Notice />
              </PrivateRoute>
            }
          />
          <Route
            path="/notice/:noticeId"
            element={
              <PrivateRoute>
                <NoticeDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/room"
            element={
              <PrivateRoute>
                <Room />
              </PrivateRoute>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <PrivateRoute>
                <RoomDetail />
              </PrivateRoute>
            }
          />
          <Route path="/user/password" element={<PwChange />} />
          <Route path="/user/findpw" element={<PwFind />} />
          <Route path="/user/signup" element={<Signup />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/oauth/callback/kakao" element={<Kakao />} />
          <Route path="/oauth/callback/naver" element={<Naver />} />
          <Route path="/oauth/callback/google" element={<Google />} />
          <Route path="/usermanual" element={<UserManual />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
