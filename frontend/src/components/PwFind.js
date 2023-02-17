import React, { useState } from 'react';
import styles from './Pw.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const getInfo = () => {
    axios({
      url: `https://i8a804.p.ssafy.io/api/user/${email}/password?userName=${name}`,
      method: 'GET',
    })
      .then((res) => {
        alert('해당 이메일로 비밀번호 변경 페이지의 링크를 보냈습니다.');
      })
      .catch((err) => {
        if (err.response && err.response.data.message !== 'fail') {
          // message가 fail로 온 게 아니라 다른 문제가 있을 때
          console.log(err, 'getInfo에러');
        }
        alert('해당 하는 회원이 없습니다. 확인 후 다시 입력해주세요');
      });
  };

  const navigate = useNavigate();
  function goToMain() {
    navigate('/user/login');
  }

  return (
    <div className={styles.change}>
      <img className={styles.logo} src={`${process.env.PUBLIC_URL}/logo.png`} alt="이미지없음" onClick={goToMain} />
      <div className={styles.all}>
        <form className={styles.pwForm}>
          <p className={styles.pwChange}>비밀번호 찾기</p>
          <br />
          <div style={{ height: '60px' }}>
            <input className={styles.userInfo} type="email" placeholder="이메일" value={email} onChange={inputEmail} />
            <br />
            {errMsg ? <div style={{ color: 'red', textAlign: 'left', marginLeft: '8%' }}>{errMsg}</div> : ''}
          </div>
          <input
            className={styles.userInfo}
            type="text"
            placeholder="이름"
            value={name}
            onChange={inputName}
            style={{ marginTop: '10%' }}
            onKeyDown={(e) => e.key === 'Enter' && getInfo()}
          />
          <br />
          <input type="button" value="확인" className={styles.check} onClick={getInfo} style={{ cursor: 'pointer' }} />
        </form>
      </div>
    </div>
  );
};

export default PwFind;
