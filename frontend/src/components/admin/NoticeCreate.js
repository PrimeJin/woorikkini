import React, { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      // axios({
      //   method: "post",
      //   url: "/notice",
      //   data: {
      //     noticeTitle: title,
      //     noticeContent: content,
      //   }
      // })
      // .then((res) => {
      //   navigate("/notice")
      // })
      navigate("/admin/notice");
    }
  }

  return (
    <div>
      <form>
        <label>제목</label>
        <br />
        <input
          type="text"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <br />
        <label>내용</label>
        <br />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></input>
        <br />
        <button onClick={save}>저장</button>
      </form>
    </div>
  );
};

export default NoticeCreate;
