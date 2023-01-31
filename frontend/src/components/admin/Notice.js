import NoticeList from "./NoticeList";
import "./Notice.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoticeCreate from "./NoticeCreate";

function Notice() {
  const [list, setList] = useState([]);

  function getList() {
    axios({
      url: `https://jsonplaceholder.typicode.com/posts`,
      methods: "GET",
    })
      .then((res) => {
        setList(res.data);
      })
      .catch((err) => {
        console.log(err, "공지사항 에러");
      });
  }

  useEffect(() => {
    getList();
  }, []);

  const navigate = useNavigate();
  function save() {
    navigate("create");
  }

  return (
    <div>
      <h1>공지사항</h1>
      <div style={{ justifyContent: "right", display: "flex" }}>
        <button onClick={save}>새 글 작성</button>
      </div>

      <ul>
        <strong>제목</strong>
        {list.map((notice, index) => (
          <NoticeList key={index} notice={notice} />
        ))}
      </ul>
    </div>
  );
}

export default Notice;
