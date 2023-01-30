import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoticeIcon() {
  const navigate = useNavigate();
  const NoticeGo = () => {
    navigate(`/notice`);
  };
  return (
    <div className="notice" style={{ margin: 20 }}>
      <img
        onClick={NoticeGo}
        className="notice-icon"
        src={'img/공지사항_아이콘.png'}
        style={{ width: 80, height: 90 }}
      ></img>
      <p onClick={NoticeGo} style={{ margin: 0 }}>
        공지사항
      </p>
    </div>
  );
}
export default NoticeIcon;
