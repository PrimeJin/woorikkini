import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Admin.module.css";
import AdminSidebar from "./AdminSidebar";

const AdminNoticeDetail = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [time, setTime] = useState("");
  const params = useParams();
  const [update, setUpdate] = useState("");
  const [modal, setModal] = useState(false);

  function getDetail() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/notice/${params.noticeId}`,
      methods: "GET",
    })
      .then((res) => {
        setTitle(res.data.notice.noticeTitle);
        setContent(res.data.notice.noticeContent);
        setTime(res.data.notice.createdTime.substr(0, 10));
      })
      .catch((err) => {
        if (err.response.data.message === "fail") {
          alert("로그인이 필요한 서비스입니다.");
          navigate("/user/login");
        } else {
          alert("유효하지 않은 요청입니다.");
          console.log(err, "공지사항 디테일 에러");
        }
      });
  }

  useEffect(() => {
    getDetail();
  }, [update]);

  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");

  useEffect(() => {
    setInputTitle(title);
    setInputContent(content);
  }, [title, content, update]);

  const navigate = useNavigate();

  function list() {
    navigate("/admin/notice");
  }

  function goToUpdate() {
    setUpdate("1");
  }

  function back() {
    setUpdate("");
  }

  function noticeDelete() {
    axios({
      method: "DELETE",
      url: `https://i8a804.p.ssafy.io/api/notice/${params.noticeId}/`,
      data: {
        noticeId: params.noticeId,
      },
    })
      .then((res) => {
        alert("삭제가 완료되었습니다.");
        navigate("/admin/notice");
      })
      .catch((err) => {
        console.log("notice 삭제 에러");
      });
  }

  function DeleteModal() {
    setModal(true);
  }
  function modalClose() {
    if (modal === true) {
      setModal(false);
    }
  }

  function updateConfirm() {
    if (inputTitle.trim() === "") {
      alert("제목을 입력해주세요");
    } else if (inputContent.trim() === "") {
      alert("내용을 입력해주세요");
    } else {
      axios({
        method: "put",
        url: `https://i8a804.p.ssafy.io/api/notice/${params.noticeId}`,
        data: {
          noticeId: params.noticeId,
          noticeTitle: inputTitle,
          noticeContent: inputContent,
        },
      })
        .then((res) => {
          alert("수정이 완료되었습니다.");
          setUpdate("");
        })
        .catch((err) => {
          console.log("공지사항 수정 에러", err);
        });
    }
  }

  return (
    <div>
      <div className={styles.admin}></div>
      <div className={styles.admin}></div>
      <AdminSidebar />
      {/* 모달 시작 */}
      {modal ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "fixed",
            backgroundColor: "rgba(0,0,0,0)",
            top: "30%",
          }}
        >
          <div className={styles.delete}>
            <p style={{ width: "100%", marginBottom: 0 }}>
              해당 글을 삭제하시겠습니까?
            </p>
            <button className={styles.modalBtn} onClick={noticeDelete}>
              확인
            </button>
            <button className={styles.modalBtn} onClick={modalClose}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {/* 모달 끝 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexFlow: "wrap row",
          marginBottom: "2%",
          marginLeft: "10%",
        }}
        onClick={modalClose}
      >
        <h1 style={{ width: "100%" }}>공지사항</h1>
        {!update ? (
          //
          // 디테일
          <div className={styles.detail}>
            <p className={styles.title}>{title}</p>
            <div style={{ marginLeft: "80%", marginBottom: "2%" }}>
              <small>작성일자: {time}</small>
            </div>
            <hr />
            <pre className={styles.content}>{content}</pre>
            <button className={styles.btn} onClick={goToUpdate}>
              수정
            </button>
            <button
              className={styles.btn}
              onClick={DeleteModal}
              style={{ backgroundColor: "#FF8D89" }}
            >
              삭제
            </button>
          </div>
        ) : (
          //
          // 수정
          <div className={styles.update}>
            <label className={styles.noticeLabel}>제목</label>
            <br />
            <input
              className={styles.inputTitle}
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
            />
            <br />
            <label className={styles.noticeLabel}>내용</label>
            <br />
            <textarea
              className={styles.inputContent}
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
            />
            <br />
            <button className={styles.upBtn} onClick={updateConfirm}>
              확인
            </button>
            <button className={styles.upBtn} onClick={back}>
              취소
            </button>
          </div>
        )}
      </div>
      <div
        style={{ justifyContent: "left", display: "flex", marginBottom: "2%" }}
      >
        <button className={styles.toList} onClick={list}>
          목록으로
        </button>
      </div>
    </div>
  );
};

export default AdminNoticeDetail;
