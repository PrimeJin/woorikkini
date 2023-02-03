import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoticeIcon() {
  const navigate = useNavigate();
  const NoticeGo = () => {
    navigate(`/notice/`);
  };
  return (
    <div className="notice" style={{ margin: '2rem', display: 'inline', position: 'sticky' }}>
      <img
        onClick={NoticeGo}
        className="notice-icon"
        src={'img/공지사항_아이콘.png'}
        style={{ width: 80, height: 90 }}
      ></img>
      <div
        onClick={NoticeGo}
        style={{
          margin: 0,
          fontFamily: 'NanumSquareRound',
          fontWeight: 900,
          textAlign: 'center',
          width: 80,
          color: '#endregion',
          paddingLeft: '1.5rem',
        }}
      >
        공지사항
      </div>
    </div>
  );
}
export default NoticeIcon;
