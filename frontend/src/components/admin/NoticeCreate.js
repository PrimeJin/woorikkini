import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Notice.css";

const NoticeCreate = (props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  function save(e) {
    e.preventDefault();
    if (title.trim() === "") {
      alert("제목을 입력해주세요");
    } else if (content.trim() === "") {
      alert("내용을 입력해주세요");
    } else {
      axios({
        method: "post",
        url: "http://i8a804.p.ssafy.io:8050/notice/",
        data: {
          noticeTitle: title,
          noticeContent: content,
        },
      })
        .then((res) => {
          alert("공지사항 등록이 완료되었습니다.");
          navigate("/admin/notice");
        })
        .catch((err) => {
          console.log("공지사항 create에러", err);
        });
    }
  }

  function back() {
    navigate("/admin/notice");
  }

  return (
    <div>
      <h1>공지사항</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2%",
        }}
      >
        <div className="update">
          <label>제목</label>
          <br />
          <input
            className="inputTitle"
            type="text"
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <br />
          <label>내용</label>
          <br />
          <textarea
            className="inputContent"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <br />
          <button className="upBtn" onClick={save}>
            저장
          </button>
          <button className="upBtn" onClick={back}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeCreate;
