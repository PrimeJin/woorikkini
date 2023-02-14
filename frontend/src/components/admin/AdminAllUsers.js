import styles from "./Admin.module.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";

function AdminAllUsers() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  function getList() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/user/`,
      method: "GET",
    })
      .then((res) => {
        setList(res.data.userList);
      })
      .catch((err) => {
        if (err.response.data.message === "fail") {
          alert("로그인이 필요한 서비스입니다.");
          navigate("/user/login");
        } else {
          alert("유효하지 않은 요청입니다.");
          console.log(err, "관리자 회원조회 에러");
        }
      });
  }

  useEffect(() => {
    getList();
  }, []);

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
        <h1 style={{ width: "100%" }}>회원 조회</h1>
        <div className={styles.noticeTable}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "15%" }}>이메일</th>
                <th style={{ width: "10%" }}>이름</th>
                <th style={{ width: "10%" }}>닉네임</th>
                <th style={{ width: "10%" }}>출생년도</th>
                <th style={{ width: "10%" }}>성별</th>
                <th style={{ width: "15%" }}>가입일자</th>
                <th style={{ width: "10%" }}>활동정지 유무</th>
              </tr>
            </thead>
            {list.map((user, index) => (
              <AdminAllUsersList key={index} user={user} />
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAllUsers;

function AdminAllUsersList(props) {
  const email = props.user.userEmail;
  const name = props.user.userName;
  const nickname = props.user.userNickname;
  const birthday = props.user.userBirthYear;
  const gender = props.user.userGender;
  const joinDate = props.user.createdTime.slice(0, 10);
  const activation = props.user.userActivation;

  return (
    <tbody>
      <tr>
        <td>{email}</td>
        <td>{name}</td>
        <td>{nickname}</td>
        <td>{birthday}</td>
        <td>{gender}</td>
        <td>{joinDate}</td>
        <td>{activation}</td>
      </tr>
    </tbody>
  );
}
