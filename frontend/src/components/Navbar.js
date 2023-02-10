import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Nav() {
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
    alert('로그아웃 되었습니다.');
  };

  return (
    <nav>
      <div className="navbar" onClick={toggleChange}>
        <div style={{ width: 100 }}>
          <text style={{ fontSize: 17 }}>nickname</text>
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
