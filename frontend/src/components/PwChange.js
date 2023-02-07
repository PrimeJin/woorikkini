import React, { useEffect, useState, useCallback } from 'react';
import './Pw.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import QueryString from 'qs';

const PwChange = () => {
  // function confirmToken() {

  // }
  const queryData = QueryString.parse(useLocation().search, { ignoreQueryPrefix: true });
  console.log(queryData);

  const email = queryData.userEmail;
  const code = queryData.passwordCodeContent;

  const useInput = (initial, validate) => {
    const [value, setValue] = useState(initial);
    const inputChange = (event) => {
      setValue(event.target.value);
    };
    return [value, inputChange];
  };

  const [pw, pwInput] = useInput('');
  const [pw2, pwInput2] = useInput('');
  const [errorMessage, setErrorMessage] = useState({
    pwError: '',
    matchError: '',
  });
  const { pwError, matchError } = errorMessage;

  const inputRegexs = {
    pwReg: /^[a-zA-z0-9]{8,12}$/,
  };

  const validationCheck = useCallback(
    (input, regex) => {
      let isValidate = false;
      if (input === '') {
        isValidate = false;
      } else if (regex.test(input)) {
        isValidate = true;
      } else {
        isValidate = false;
      }
      return isValidate;
    },
    [pw],
  );

  // 비밀번호 체크
  useEffect(() => {
    if (validationCheck(pw, inputRegexs.pwReg) || pw === '') {
      setErrorMessage({
        ...errorMessage,
        pwError: '',
      });
    } else {
      setErrorMessage({
        ...errorMessage,
        pwError: '하나 이상의 문자와 숫자를 포함하여 8자 이상이여야 합니다.',
      });
    }
  }, [pw]);

  /* 비밀번호 확인 체크 */
  useEffect(() => {
    if (pw === pw2 || pw2 === '') {
      setErrorMessage({
        ...errorMessage,
        matchError: '',
      });
    } else {
      setErrorMessage({
        ...errorMessage,
        matchError: '비밀번호 확인이 일치하지 않습니다.',
      });
    }
  }, [pw2]);

  const navigate = useNavigate();

  function goPw() {
    if (pwError === '' && matchError === '') {
      axios({
        url: `https://i8a804.p.ssafy.io/api/user/password`,
        method: 'PATCH',
        data: {
          userEmail: email,
          passwordCodeContent: code,
          userPassword: pw,
          userPasswordCheck: pw2,
        },
      })
        .then((res) => {
          alert('비밀번호 변경에 성공하였습니다.');
          navigate('/user/login');
        })
        .catch((err) => {
          console.log(err, 'goPw 에러');
        });
    } else {
      console.log('pwchange error');
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
        <form className="pwForm">
          <p className="pwChange">비밀번호 변경</p>
          <br />
          <div style={{ height: '60px' }}>
            <input className="userInfo" type="password" placeholder="비밀번호" value={pw} onChange={pwInput} />
            <br />
            {pwError ? <span>{pwError}</span> : ''}
          </div>
          <input
            className="userInfo"
            type="password"
            placeholder="비밀번호확인"
            value={pw2}
            onChange={pwInput2}
            style={{ marginTop: '10%' }}
          />
          <br />
          {matchError ? <span>{matchError}</span> : ''}
          <br />
          <input type="button" value="확인" className="check" style={{ cursor: 'pointer' }} onClick={goPw} />
        </form>
      </div>
    </div>
  );
};

export default PwChange;
