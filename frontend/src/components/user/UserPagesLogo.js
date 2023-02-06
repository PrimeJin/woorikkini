import './UserPagesLogo.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import mainlogo from '../../assets/우리끼니로고.png';

// User 관련 페이지 로고
function Logo() {
  const navigate = useNavigate();
  const MainGo = () => {
    navigate(`/`);
  };
  return (
    <div className="logo-top">
      <img className="woori-logo" src={mainlogo} alt="" onClick={MainGo} />
    </div>
  );
}

export default Logo;
