import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const NoticeDetail = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const params = useParams();
  const [update, setUpdate] = useState('');

  function getDetail() {
    axios({
      url: `http://i8a804.p.ssafy.io:8050/notice/${params.noticeId}`,
      methods: 'GET',
    })
      .then((res) => {
        setTitle(res.data.notice.noticeTitle);
        setContent(res.data.notice.noticeContent);
      })
      .catch((err) => {
        console.log(err, '공지사항 디테일 에러');
      });
  }

  useEffect(() => {
    getDetail();
  }, []);

  const [inputTitle, setInputTitle] = useState('');
  const [inputContent, setInputContent] = useState('');

  useEffect(() => {
    setInputTitle(title);
    setInputContent(content);
  }, [title, content]);

  const navigate = useNavigate();

  function list() {
    navigate('/admin/notice');
  }

  function goToUpdate() {
    setUpdate('1');
  }

  function back() {
    setUpdate('');
  }

  function noticeDelete() {
    axios({
      method: 'DELETE',
      url: `http://i8a804.p.ssafy.io:8050/notice/${params.noticeId}/`,
      data: {
        noticeId: params.noticeId,
      },
    })
      .then((res) => {
        alert('삭제가 완료되었습니다.');
        navigate('/admin/notice');
      })
      .catch((err) => {
        console.log('notice 삭제 에러');
      });
  }

  function updateConfirm() {
    if (inputTitle.trim() === '') {
      alert('제목을 입력해주세요');
    } else if (inputContent.trim() === '') {
      alert('내용을 입력해주세요');
    } else {
      axios({
        method: 'put',
        url: `http://i8a804.p.ssafy.io:8050/notice/${params.noticeId}`,
        data: {
          noticeId: params.noticeId,
          noticeTitle: inputTitle,
          noticeContent: inputContent,
        },
      })
        .then((res) => {
          alert('수정이 완료되었습니다.');
          window.location.replace(`${params.noticeId}`);
        })
        .catch((err) => {
          console.log('공지사항 수정 에러', err);
        });
    }
  }

  //   if (!update) {
  //     return (
  //       <div style={{ display: "flex", flexWrap: "wrap" }}>
  //         <h1>공지사항</h1>
  //         <div className="detail">
  //           제목: {title}
  //           <br />
  //           내용: {content}
  //           <br />
  //           <button onClick={goToUpdate}>수정</button>
  //           <button onClick={noticeDelete}>삭제</button>
  //         </div>
  //         <button onClick={list}>목록으로</button>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div>
  //         <h1>공지사항</h1>
  //         <div>
  //           <label>제목</label>
  //           <br />
  //           <input
  //             type="text"
  //             value={inputTitle}
  //             onChange={(e) => setInputTitle(e.target.value)}
  //           />
  //           <br />
  //           <label>내용</label>
  //           <br />
  //           <input
  //             type="text"
  //             value={inputContent}
  //             onChange={(e) => setInputContent(e.target.value)}
  //           />
  //           <br />
  //           <button onClick={updateConfirm}>확인</button>
  //           <button onClick={back}>취소</button>
  //         </div>
  //         <button onClick={list}>목록으로</button>
  //       </div>
  //     );
  //   }
  // };

  return (
    <div>
      <h1>공지사항</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!update ? (
          <div className="detail">
            <p className="title">{title}</p>
            <hr />
            <p className="content">{content}</p>
            <button className="btn" onClick={goToUpdate}>
              수정
            </button>
            <button className="btn" onClick={noticeDelete} style={{ backgroundColor: '#FF8D89' }}>
              삭제
            </button>
          </div>
        ) : (
          <div className="update">
            <label>제목</label>
            <br />
            <input
              className="inputTitle"
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
            />
            <br />
            <label>내용</label>
            <br />
            <input
              className="inputContent"
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
            />
            <br />
            <button className="upBtn" onClick={updateConfirm}>
              확인
            </button>
            <button className="upBtn" onClick={back}>
              취소
            </button>
          </div>
        )}
      </div>
      <div style={{ justifyContent: 'left', display: 'flex', marginBottom: '2%' }}>
        <button className="toList" onClick={list}>
          목록으로
        </button>
      </div>
    </div>
  );
};

export default NoticeDetail;
