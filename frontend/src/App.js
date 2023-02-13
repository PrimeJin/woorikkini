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
import VideoRoom from './room/VideoRoom';
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

function App() {
  return (
    <>
      <Helmet>
        <title>우리끼니</title>
      </Helmet>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/user/signup" element={<Signup />} />
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/user/logout" element={<LogoutPage />} />
          <Route path="/user/modify" element={<ModifyPage />} />
          <Route path="/user/findpw" element={<PwFind />} />
          <Route path="/user/password" element={<PwChange />} />
          <Route path="/user/delete" element={<DeletePage />} />
          <Route path="/oauth/callback/kakao" element={<Kakao />} />
          <Route path="/oauth/callback/naver" element={<Naver />} />
          <Route path="/oauth/callback/google" element={<Google />} />
          <Route path="/test" element={<VideoRoom />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/report" element={<AdminReport />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/allUsers" element={<AdminAllUsers />} />
          <Route path="/admin/notice" element={<AdminNotice />} />
          <Route path="/admin/notice/:noticeId" element={<AdminNoticeDetail />} />
          <Route path="/admin/notice/create" element={<AdminNoticeCreate />} />
          <Route path="/room" element={<Room />} />
          <Route path="/room/:roomId" element={<RoomDetail />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/notice/:noticeId" element={<NoticeDetail />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
