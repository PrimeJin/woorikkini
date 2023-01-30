import './Mypage.css';
import React from 'react';

function Logo() {
  return (
    <div className="mypage-logo-top">
      <img className="mypage-logo" src={'img/우리끼니로고.png'} />
    </div>
  );
}

function Nav(props) {
  return (
    <nav className="navbar">
      <div>nickname</div>
      <button
        className="logout-btn"
        onClick={(event) => {
          event.preventDefault();
          props.onChangeMode();
        }}
      >
        LOGOUT
      </button>
    </nav>
  );
}

function CardListContainer() {
  return (
    <div className="cardlist-top">
      <Card></Card>
      <Card></Card>
      <CreateCard></CreateCard>
    </div>
  );
}

function Card() {
  return (
    <div className="card">
      <div style={{ width: 291, height: 300, position: 'relative' }}>이미지 들어갈 자리</div>
      {/* <div style={{ position: 'absolute' }}> */}
      <button>수정</button>
      <button>삭제</button>
      {/* </div> */}
      <p>날짜</p>
      <h3>제목을 입력하세요.</h3>
      <div>내용을 입력하세요.</div>
    </div>
  );
}

function CreateCard() {
  return (
    <div className="create-card">
      <p>추가하기</p>
      <p>+</p>
    </div>
  );
}

function NoticeIcon() {
  return (
    <div className="notice" style={{ margin: 20 }}>
      <img className="notice-icon" src={'img/공지사항_아이콘.png'}></img>
      <p style={{ margin: 0 }}>공지사항</p>
    </div>
  );
}

function Mypage() {
  return (
    <div>
      <div className="all">
        <Logo></Logo>
        <div className="title">
          <p style={{ fontSize: 50, marginBottom: 0 }}>나의 먹기록</p>
          <br />
          <p style={{ marginTop: 0 }}>내가 기록하고 싶은 순간들이야!</p>
        </div>
        <Nav
          onChangeMode={() => {
            alert('로그아웃 되었습니다.');
          }}
        ></Nav>
      </div>
      <CardListContainer></CardListContainer>
      <NoticeIcon></NoticeIcon>
    </div>
  );
}

export default Mypage;
