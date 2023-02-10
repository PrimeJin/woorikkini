import React, { useEffect, useState, useCallback } from "react";
import "./Pw.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PwChange = () => {
  // function confirmToken() {

  // }
  const useInput = (initial, validate) => {
    const [value, setValue] = useState(initial);
    const inputChange = (event) => {
      setValue(event.target.value);
    };
    return [value, inputChange];
  };

  const [pw, pwInput] = useInput("");
  const [pw2, pwInput2] = useInput("");
  const [errorMessage, setErrorMessage] = useState({
    pwError: "",
    matchError: "",
  });
  const { pwError, matchError } = errorMessage;

  const inputRegexs = {
    pwReg: /^[a-zA-z0-9]{8,12}$/,
  };

  const validationCheck = useCallback(
    (input, regex) => {
      let isValidate = false;
      if (input === "") {
        isValidate = false;
      } else if (regex.test(input)) {
        isValidate = true;
      } else {
        isValidate = false;
      }
      return isValidate;
    },
    [pw]
  );

  // 비밀번호 체크
  useEffect(() => {
    if (validationCheck(pw, inputRegexs.pwReg) || pw === "") {
      setErrorMessage({
        ...errorMessage,
        pwError: "",
      });
    } else {
      setErrorMessage({
        ...errorMessage,
        pwError: "하나 이상의 문자와 숫자를 포함하여 8자 이상이여야 합니다.",
      });
    }
  }, [pw]);

  /* 비밀번호 확인 체크 */
  useEffect(() => {
    if (pw === pw2 || pw2 === "") {
      setErrorMessage({
        ...errorMessage,
        matchError: "",
      });
    } else {
      setErrorMessage({
        ...errorMessage,
        matchError: "비밀번호 확인이 일치하지 않습니다.",
      });
    }
  }, [pw2]);

  const navigate = useNavigate();

  function goPw() {
    // state에 userId가 있다는 가정하에
    const userId = this.state.userId;

    if (pwError === "" && matchError === "") {
      axios({
        url: `http://localhost3000/${userId}/password`,
        method: "POST",
        data: pw,
      })
        .then((res) => {
          alert("비밀번호 변경에 성공하였습니다.");
          navigate("/login");
        })
        .catch((err) => {
          console.log(err, "goPw 에러");
        });
    } else {
      console.log("뭔가 에러가 있음");
      console.log(errorMessage);
    }
  }

  return (
    <div>
      {/* <img className="logo" src="logo.png" alt="이미지없음" /> */}
      <p className="logo">
        우리
        <br />
        끼니
      </p>
      <div className="all">
        <form
          action="/123"
          method="post"
          // onSubmit={function (e) {
          //   console.log(e.target);
          //   alert("비밀번호 변경이 완료되었습니다.");
          //   this.props.onSubmit(e.target);
          // }.bind(this)}
        >
          <p className="pwChange">비밀번호 변경</p>
          <br />
          <div style={{ height: "60px" }}>
            <input
              className="userInfo"
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={pwInput}
            />
            <br />
            {pwError ? <span>{pwError}</span> : ""}
          </div>
          <input
            className="userInfo"
            type="password"
            placeholder="비밀번호확인"
            value={pw2}
            onChange={pwInput2}
            style={{ marginTop: "10%" }}
          />
          <br />
          {matchError ? <span>{matchError}</span> : ""}
          <br />
          <input
            type="button"
            value="확인"
            className="check"
            style={{ cursor: "pointer" }}
            onClick={goPw}
          />
        </form>
      </div>
    </div>
  );
};

export default PwChange;
