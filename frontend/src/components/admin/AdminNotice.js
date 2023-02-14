import styles from "./Admin.module.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import AdminSidebar from "./AdminSidebar";

function AdminNotice() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

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
        if (err.response.data.message === "fail") {
          alert("로그인이 필요한 서비스입니다.");
          navigate("/user/login");
        } else {
          alert("유효하지 않은 요청입니다.");
          console.log(err, "관리자 공지사항 에러");
        }
      });
  }

  useEffect(() => {
    getList();
  }, [page]);

  function save() {
    navigate("create");
  }

  function pageChange(e, page) {
    setPage(page);
  }

  return (
    <div>
      <div className={styles.admin}></div>
      <AdminSidebar />
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexFlow: "wrap column",
          marginLeft: "10%",
        }}
      >
        <h1 style={{ width: "100%" }}>공지사항</h1>
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
        <div className={styles.noticeTable} style={{ marginTop: "1%" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "15%" }}>번호</th>
                <th style={{ width: "65%" }}>제목</th>
                <th style={{ width: "20%" }}>작성일자</th>
              </tr>
            </thead>
            {list.map((notice, index) => (
              <AdminNoticeList key={index} notice={notice} />
            ))}
          </table>
          <Pagination count={count} page={page} onChange={pageChange} />
        </div>
      </div>
    </div>
  );
}

export default AdminNotice;

function AdminNoticeList(props) {
  const id = props.notice.noticeId;
  const title = props.notice.noticeTitle;
  const time = props.notice.createdTime.substr(0, 10);

  return (
    <tbody>
      <tr>
        <td>{id}</td>
        <td>
          <Link
            to={`${props.notice.noticeId}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            {title}
          </Link>
        </td>
        <td>{time}</td>
      </tr>
    </tbody>
  );
}
