import AdminNoticeList from "./AdminNoticeList";
import styles from "./AdminNotice.module.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";

function Notice() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState("");

  function getList() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/notice?page=${page - 1}&limit=10`,
      method: "GET",
    })
      .then((res) => {
        setList(res.data.noticeList.content);
        setCount(res.data.noticeList.totalPages);
      })
      .catch((err) => {
        console.log(err, "공지사항 에러");
      });
  }

  useEffect(() => {
    getList();
  }, [page]);

  const navigate = useNavigate();
  function save() {
    navigate("create");
  }

  function pageChange(e, page) {
    setPage(page);
  }

  return (
    <div>
      <h1 style={{ margin: "1%", marginTop: "3%" }}>공지사항</h1>
      <div
        style={{
          justifyContent: "right",
          display: "flex",
          marginRight: "5%",
          marginBottom: 0,
        }}
      >
        <button className={styles.new} onClick={save}>
          새 글 작성
        </button>
      </div>

      <div
        style={{
          justifyContent: "center",
          display: "flex",
          margin: "1%",
          flexFlow: "wrap",
        }}
      >
        <table>
          <tr>
            <th style={{ width: "10%" }}>번호</th>
            <th style={{ width: "70%" }}>제목</th>
            <th style={{ width: "20%" }}>작성일자</th>
          </tr>
          {list.map((notice, index) => (
            <AdminNoticeList key={index} notice={notice} />
          ))}
        </table>
        <Pagination count={count} page={page} onChange={pageChange} />
      </div>
    </div>
  );
}

export default Notice;
