import React, { useState } from "react";
import "./Pw.css";
import axios from "axios";

const PwFind = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const inputEmail = (e) => {
    setEmail(e.target.value);
    check();
  };
  const inputName = (e) => {
    setName(e.target.value);
  };

  const check = () => {
    const emailCheck =
      /([\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$/;
    if (!email.match(emailCheck)) {
      setErrMsg("올바른 이메일 형식을 입력해주세요.");
    } else {
      setErrMsg("");
    }
  };
  // };

  const getInfo = () => {
    axios({
      // url: `http://localhost3000/${email}/password`,
      url: `https://jsonplaceholder.typicode.com/users`,
      method: "GET",
    })
      .then((res) => {
        if (res.data[0].name === name) {
          // 이메일 보내는 거 -> 이메일 확인하라는 알람창
          alert("해당 이메일로 비밀번호 변경 페이지의 링크를 보냈습니다.");
        } else {
          alert("해당 하는 회원이 없습니다. 확인 후 다시 입력해주세요");
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "getInfo에러");
      });
  };

  return (
    <div>
      {/* <img className="logo" src="logo.png" alt="이미지없음" /> */}
      <p className="logo">
        우리
        <br />
        끼니
      </p>
      <div className="all">
        <form>
          <p className="pwChange">비밀번호 찾기</p>
          <br />
          <div style={{ height: "60px" }}>
            <input
              className="userInfo"
              type="email"
              placeholder="이메일"
              value={email}
              onChange={inputEmail}
            />
            <br />
            {errMsg ? <span>{errMsg}</span> : ""}
          </div>
          <input
            className="userInfo"
            type="text"
            placeholder="이름"
            value={name}
            onChange={inputName}
            style={{ marginTop: "10%" }}
          />
          <br />
          <input
            type="button"
            value="확인"
            className="check"
            onClick={getInfo}
            style={{ cursor: "pointer" }}
          />
        </form>
      </div>
    </div>
  );
};

export default PwFind;
