import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoticeIcon() {
  const navigate = useNavigate();
  const NoticeGo = () => {
    navigate(`/notice/`);
  };
  return (
    <div style={{ margin: '1rem', display: 'inline', position: 'fixed', bottom: 0, left: 0, cursor: 'pointer' }}>
      <img
        onClick={NoticeGo}
        className="notice-icon"
        src={'img/공지사항_아이콘.png'}
        style={{ width: 50, height: 60 }}
      ></img>
      <div
        onClick={NoticeGo}
        style={{
          margin: 0,
          fontWeight: 900,
          textAlign: 'center',
          width: 60,
          color: '#endregion',
        }}
      >
        공지사항
      </div>
    </div>
  );
}
export default NoticeIcon;
