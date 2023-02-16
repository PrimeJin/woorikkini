import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PageLogo.module.css';

function Logo() {
  const navigate = useNavigate();
  const MainGo = () => {
    navigate('/room');
  };
  return (
    <div className={styles.mypage_logo_top}>
      <img className={styles.mypage_logo} src={'img/우리끼니로고.png'} onClick={MainGo} />
    </div>
  );
}
export default Logo;
