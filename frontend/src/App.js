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

import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Google from './auth/Google';
import DeletePage from './pages/DeletePage';
import ErrorPage from './pages/ErrorPage';
import PwFind from './components/PwFind';

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
          <Route path="/user/delete" element={<DeletePage />} />
          <Route path="/oauth/callback/kakao" element={<Kakao />} />
          <Route path="/oauth/callback/naver" element={<Naver />} />
          <Route path="/oauth/callback/google" element={<Google />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );

  // 백엔드랑 연결하면 이거 쓰기
  // return (
  //   <Router>
  //     <Routes>
  //       <Route element={<PrivateRoute />}>
  //         <Route path="/" element={<MainPage />} />
  //         <Route path="/logout" element={<LogoutPage />} />
  //       </Route>
  //       <Route
  //         path="/user/login"
  //         element={
  //           <PublicRoute>
  //             <LoginPage />
  //           </PublicRoute>
  //         }
  //       />
  //     </Routes>
  //   </Router>
  // );
}

export default App;
