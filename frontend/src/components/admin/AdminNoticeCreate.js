import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import AdminSidebar from "./AdminSidebar";

const AdminNoticeCreate = (props) => {
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
        url: "https://i8a804.p.ssafy.io/api/notice/",
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
          if (err.response.data.message === "fail") {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/user/login");
          } else {
            alert("유효하지 않은 요청입니다.");
            console.log(err, "공지사항 create에러");
          }
        });
    }
  }

  function back() {
    navigate("/admin/notice");
  }

  return (
    <div>
      <div className={styles.admin}></div>
      <AdminSidebar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexFlow: "wrap row",
          marginBottom: "2%",
          marginLeft: "10%",
        }}
      >
        <h1 style={{ width: "100%" }}>공지사항</h1>
        <div className={styles.update}>
          <label className={styles.noticeLabel}>제목</label>
          <input
            className={styles.inputTitle}
            type="text"
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <br />
          <label className={styles.noticeLabel}>내용</label>
          <textarea
            className={styles.inputContent}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <br />
          <button className={styles.upBtn} onClick={save}>
            저장
          </button>
          <button className={styles.upBtn} onClick={back}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeCreate;
