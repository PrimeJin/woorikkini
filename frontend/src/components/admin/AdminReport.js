import styles from "./Admin.module.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";

function AdminReport() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  function getList() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/report`,
      method: "GET",
    })
      .then((res) => {
        setList(res.data.reportList);
      })
      .catch((err) => {
        if (err.response.data.message === "fail") {
          alert("로그인이 필요한 서비스입니다.");
          navigate("/user/login");
        } else {
          alert("유효하지 않은 요청입니다.");
          console.log(err, "관리자 신고 내역 조회 에러");
        }
      });
  }

  function changeRefresh() {
    refresh ? setRefresh(false) : setRefresh(true);
  }

  useEffect(() => {
    getList();
  }, [refresh]);

  return (
    <div>
      <div className={styles.admin}></div>
      <AdminSidebar />
      <div
        style={{
          marginLeft: "10%",
          marginBottom: "5%",
          justifyContent: "center",
          display: "flex",
          flexFlow: "wrap row",
        }}
      >
        <h1 style={{ width: "100%" }}>신고 내역</h1>
        <div className={styles.noticeTable}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "10%" }}>신고일</th>
                <th style={{ width: "10%" }}>카테고리</th>
                <th style={{ width: "20%" }}>내용</th>
                <th style={{ width: "10%" }}>피신고인</th>
                <th style={{ width: "10%" }}>신고당한 횟수</th>
                <th style={{ width: "10%" }}></th>
              </tr>
            </thead>
            {list.map((report, index) => (
              <AdminReportList
                key={index}
                report={report}
                changeRefresh={changeRefresh}
              />
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReport;

function AdminReportList(props) {
  const reportDate = props.report.createdTime.slice(0, 10);
  const category = props.report.reportCategory;
  const content = props.report.reportContent;
  const reportedUser = props.report.reportedUser;
  const count = props.report.reportedCount;
  const id = props.report.reportId;
  const activation = props.report.userActivation;
  const [more, setMore] = useState("");
  const changeRefresh = props.changeRefresh;

  useEffect(() => {
    if (content.length > 15) {
      setMore(true);
    } else {
      setMore(false);
    }
  }, []);

  function suspend() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/report/suspend?reportId=${id}`,
      method: "GET",
      data: {
        reportId: id,
      },
    })
      .then((res) => {
        res.data.message === "success" &&
          alert(`${reportedUser}의 활동 정지가 완료되었습니다`);
        changeRefresh();
      })
      .catch((err) => {
        console.log(err, "활동 정지 에러");
      });
  }

  function whole(e) {
    e.target.className === styles.hide
      ? (e.target.className = styles.full)
      : (e.target.className = styles.hide);
  }

  return (
    <tbody>
      <tr>
        <td>{reportDate}</td>
        <td>{category}</td>
        <td>
          {more ? (
            <p className={styles.hide} onClick={whole}>
              {content}
            </p>
          ) : (
            <p>{content}</p>
          )}
        </td>
        <td>{reportedUser}</td>
        <td>{count}</td>
        <td>
          {activation ? (
            <button
              className={styles.reportBtn}
              style={{ backgroundColor: "gray", cursor: "not-allowed" }}
              disabled
            >
              활동정지
            </button>
          ) : (
            <button className={styles.reportBtn} onClick={suspend}>
              활동정지
            </button>
          )}
        </td>
      </tr>
    </tbody>
  );
}
