import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageLogo.css';

function Logo(props) {
  const navigate = useNavigate();
  const MainGo = () => {
    navigate(`/${props}`);
  };
  return (
    <div className="mypage-logo-top">
      <img className="mypage-logo" src={'img/우리끼니로고.png'} onClick={MainGo} />
    </div>
  );
}
export default Logo;
