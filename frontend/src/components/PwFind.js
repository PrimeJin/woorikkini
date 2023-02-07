import React, { useState } from 'react';
import './Pw.css';
import axios from 'axios';

const PwFind = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const inputEmail = (e) => {
    setEmail(e.target.value);
    check();
  };
  const inputName = (e) => {
    setName(e.target.value);
  };

  const check = () => {
    const emailCheck = /([\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$/;
    if (!email.match(emailCheck)) {
      setErrMsg('올바른 이메일 형식을 입력해주세요.');
    } else {
      setErrMsg('');
    }
  };
  // };

  const getInfo = () => {
    axios({
      url: `http://i8a804.p.ssafy.io:8040/user/${email}/password?userName=${name}`,
      method: 'GET',
    })
      .then((res) => {
        console.log(res);
        alert('해당 이메일로 비밀번호 변경 페이지의 링크를 보냈습니다.');
      })
      .catch((err) => {
        console.log(err, 'getInfo에러');
        // alert("해당 하는 회원이 없습니다. 확인 후 다시 입력해주세요");
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
        <form className="pwForm">
          <p className="pwChange">비밀번호 찾기</p>
          <br />
          <div style={{ height: '60px' }}>
            <input className="userInfo" type="email" placeholder="이메일" value={email} onChange={inputEmail} />
            <br />
            {errMsg ? <h5 style={{ color: 'red', textAlign: 'left', margin: 0 }}>{errMsg}</h5> : ''}
          </div>
          <input
            className="userInfo"
            type="text"
            placeholder="이름"
            value={name}
            onChange={inputName}
            style={{ marginTop: '10%' }}
          />
          <br />
          <input type="button" value="확인" className="check" onClick={getInfo} style={{ cursor: 'pointer' }} />
        </form>
      </div>
    </div>
  );
};

export default PwFind;
