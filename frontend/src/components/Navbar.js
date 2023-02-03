import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

// import { LogoutPage } from '../pages/LogoutPage';

function Nav() {
  // store에서 현재 로그인한 사용자의 userId 가져오기
  const nickname = useSelector((state) => state.user.nickname);

  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleBar, setToggleBar] = useState(true);
  const navigate = useNavigate();

  // 클릭시, 토글 메뉴들 보이도록
  const toggleChange = () => {
    setToggleMenu(!toggleMenu);
    setToggleBar(!toggleBar);
  };

  // 클릭시, 토글 메뉴들 사라지도록
  const onMenuClick = () => {
    setToggleMenu(!toggleMenu);
    setToggleBar(!toggleBar);
  };

  const MypageGo = () => {
    navigate(`/mypage`);
  };

  const UserUpdateGo = () => {
    navigate(`/user/update`);
  };

  const logOut = () => {
    navigate('/user/logout');
    alert('로그아웃 되었습니다.');
  };

  return (
    <nav>
      <div className="navbar" onClick={toggleChange}>
        <div style={{ width: 100 }}>
          <text style={{ fontSize: 17 }}>{nickname}</text>
        </div>
        {toggleMenu && (
          <div mode="horizontal" onClick={onMenuClick} className="toggle-menu">
            <div onClick={MypageGo} style={{ textAlign: 'center', height: 25, lineHeight: 2 }}>
              마이페이지
            </div>
            <div onClick={UserUpdateGo} style={{ textAlign: 'center', height: 25, lineHeight: 2 }}>
              개인 정보 변경
            </div>
          </div>
        )}
      </div>
      <button className="logout-btn" onClick={logOut}>
        LOGOUT
      </button>
    </nav>
  );
}
export default Nav;
