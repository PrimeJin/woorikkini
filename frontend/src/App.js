import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Kakao from './auth/Kakao';
import Naver from './auth/Naver';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/oauth/callback/kakao" element={<Kakao />} />
        <Route path="/oauth/callback/naver" element={<Naver />} />
      </Routes>
    </Router>
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
