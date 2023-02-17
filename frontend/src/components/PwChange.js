import React, { useEffect, useState, useCallback } from 'react';
import styles from './Pw.module.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import QueryString from 'qs';

const PwChange = () => {
  const [check, setCheck] = useState(false);

  const queryData = QueryString.parse(useLocation().search, {
    ignoreQueryPrefix: true,
  });

  const email = queryData.userEmail;
  const code = queryData.passwordCodeContent;

  function goCheck() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/user/password?userEmail=${email}&passwordCodeContent=${code}`,
      method: 'GET',
      data: {
        userEmail: email,
        passwordCodeContent: code,
      },
    })
      .then((res) => {
        if (res.data.message === 'success') {
          setCheck(true);
        } else {
          alert('만료된 링크입니다.');
        }
      })
      .catch((err) => {
        if (err.response.data.message === 'fail') {
          alert('유효하지 않은 요청입니다.');
        } else {
          alert('유효하지 않은 요청입니다.');
          console.log(err, 'pwchange check 에러');
        }
      });
  }

  useEffect(() => {
    goCheck();
  }, []);

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
    pwReg: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,12}$/,
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
    if (!validationCheck(pw, inputRegexs.pwReg) && pw != '') {
      setErrorMessage({
        ...errorMessage,
        pwError: '영문, 숫자, 특수문자를 조합하여 8~12자로 입력해주세요',
      });
    } else {
      setErrorMessage({
        ...errorMessage,
        pwError: '안전한 비밀번호 입니다',
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
        matchError: '비밀번호가 일치하지 않습니다.',
      });
    }
  }, [pw2]);

  const navigate = useNavigate();

  function goPw() {
    pw
      ? pw2
        ? pwError === '안전한 비밀번호 입니다' && matchError === ''
          ? axios({
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
              })
          : errorMessage.pwError
          ? alert(pwError)
          : alert(matchError)
        : alert('비밀번호 확인을 입력해주세요.')
      : alert('비밀번호를 입력해주세요.');
  }

  function goToMain() {
    navigate('/user/login');
  }

  return (
    <div>
      {check && (
        <div>
          <img className={styles.logo} src={`${process.env.PUBLIC_URL}/logo.png`} alt="이미지없음" onClick={goToMain} />
          <div className={styles.all}>
            <form className={styles.pwForm}>
              <p className={styles.pwChange}>비밀번호 변경</p>
              <br />
              <div style={{ height: '60px' }}>
                <input
                  className={styles.userInfo}
                  type="password"
                  placeholder="비밀번호"
                  value={pw}
                  onChange={pwInput}
                />
                <br />
                {pwError === '안전한 비밀번호 입니다' ? (
                  <h5
                    style={{
                      color: 'green',
                      textAlign: 'left',
                      margin: 0,
                      marginLeft: '10%',
                    }}
                  >
                    {pwError}
                  </h5>
                ) : (
                  <h5
                    style={{
                      color: 'red',
                      textAlign: 'left',
                      margin: 0,
                      marginLeft: '10%',
                    }}
                  >
                    {pwError}
                  </h5>
                )}
              </div>
              <input
                className={styles.userInfo}
                type="password"
                placeholder="비밀번호확인"
                value={pw2}
                onChange={pwInput2}
                style={{ marginTop: '10%' }}
                onKeyDown={(e) => e.key === 'Enter' && goPw()}
              />
              <br />
              {matchError ? (
                <h5
                  style={{
                    color: 'red',
                    textAlign: 'left',
                    margin: 0,
                    marginLeft: '10%',
                  }}
                >
                  {matchError}
                </h5>
              ) : (
                ''
              )}
              <br />
              <input type="button" value="확인" className={styles.check} style={{ cursor: 'pointer' }} onClick={goPw} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PwChange;
