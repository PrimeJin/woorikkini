import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const NoticeDetail = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const params = useParams();
  const [update, setUpdate] = useState("");

  function getDetail() {
    axios({
      url: `https://jsonplaceholder.typicode.com/posts`,
      methods: "GET",
    })
      .then((res) => {
        setTitle(res.data[params.noticeId - 1].title);
        setContent(res.data[params.noticeId - 1].body);
      })
      .catch((err) => {
        console.log(err, "공지사항 디테일 에러");
      });
  }

  useEffect(() => {
    getDetail();
  }, []);

  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");

  useEffect(() => {
    setInputTitle(title);
    setInputContent(content);
  }, [title, content]);

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
      method: "POST",
      url: `/notice/${params.noticeId}`,
      data: {
        noticeId: params.noticeId,
      },
    })
      .then((res) => {
        console.log(params.noticeId, "삭제");
      })
      .catch((err) => {
        console.log("notice 삭제 에러");
      });
  }

  function updateConfirm() {
    if (inputTitle.trim() === "") {
      alert("제목을 입력해주세요");
    } else if (inputContent.trim() === "") {
      alert("내용을 입력해주세요");
    } else {
      // axios({
      //   method: "post",
      //   url: "/notice",
      //   data: {
      //     noticeTitle: inputTitle,
      //     noticeContent: inputContent,
      //   }
      // })
      // .then((res) => {
      //   //리랜더링
      // })
    }
  }

  if (!update) {
    return (
      <div>
        <h1>공지사항</h1>
        <div>
          제목: {title}
          <br />
          내용: {content}
          <br />
          <button onClick={goToUpdate}>수정</button>
          <button onClick={noticeDelete}>삭제</button>
        </div>
        <button onClick={list}>목록으로</button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>공지사항</h1>
        <div>
          <label>제목</label>
          <br />
          <input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <br />
          <label>내용</label>
          <br />
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
          />
          <br />
          <button onClick={updateConfirm}>확인</button>
          <button onClick={back}>취소</button>
        </div>
        <button onClick={list}>목록으로</button>
      </div>
    );
  }
};

export default NoticeDetail;
