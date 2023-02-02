import './UserPagesLogo.css';
import React from 'react';
import mainlogo from '../../assets/우리끼니로고.png';

// User 관련 페이지 로고
function Logo() {
  return (
    <div className="logo-top">
      <img className="woori-logo" src={mainlogo} />
    </div>
  );
}

export default Logo;
