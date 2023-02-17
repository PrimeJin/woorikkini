/**
 * 회원정보 수정 페이지
 * 들어가야할 기능
 *
 * 닉네임 중복확인
 * 비밀번호 일치확인
 */
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/ModifyPage.module.css';

function ModifyPage() {
  const [userNickname, setUserNickname] = useState(''); //닉네임 상태
  const [isNickname, setIsNickname] = useState(false); //닉네임 유효성 검사
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(''); //비밀번호 상태 확인 메시지

  // const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmPasswordMsg, setConfirmPasswordMsg] = useState(''); //비밀번호확인 상태 메시지
  const [isPassword, setIsPassword] = useState(false); //비밀번호 유효성 검사
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const navigate = useNavigate();

  //store에 저장되어있는 user State의 id(email)가져오기
  const nickname = useSelector((state) => state.user.nickname);
  const userId = useSelector((state) => state.user.id);

  //닉네임 중복확인
  const checkNickname = (e) => {
    e.preventDefault();
    userNickname
      ? axios({
          method: 'GET',
          url: `https://i8a804.p.ssafy.io/api/user/${userNickname}`,
          headers: {
            'Content-type': 'application/json',
          },
          data: {
            userNickname: userNickname,
          },
        })
          .then((response) => {
            if (response.data.message === 'success') {
              alert('사용 가능한 닉네임입니다.');
              setIsNickname(true);
            }
          })
          .catch((err) => {
            alert('사용 불가능한 닉네임입니다.');
            setIsNickname(false);
            console.log('닉네임 중복 확인 에러', err);
          })
      : alert('변경할 닉네임을 입력해주세요');
  };

  //비밀번호 폼에 입력된 비밀번호 감지
  const onChangeNewPassword = useCallback((e) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,12}$/;
    const passwordCurrent = e.target.value;
    setNewPassword(passwordCurrent);

    //주어진 문자열이 정규표현식을 만족하지 못하면
    if (!passwordRegex.test(passwordCurrent)) {
      setPasswordMsg('영문, 숫자, 특수문자를 조합하여 8~12자로 입력해주세요');
      setIsPassword(false);
    } else {
      setPasswordMsg('안전한 비밀번호 입니다');
      setIsPassword(true);
    }
  }, []);

  //비밀번호 일치여부 확인용
  const onChangeConfirmNewPassword = useCallback(
    (e) => {
      const confirmPasswordCurrent = e.target.value;
      // setConfirmNewPassword(confirmPasswordCurrent);

      if (newPassword === confirmPasswordCurrent) {
        setConfirmPasswordMsg('비밀번호가 일치합니다.');
        setIsConfirmPassword(true);
      } else {
        setConfirmPasswordMsg('비밀번호가 일치하지 않습니다.');
        setIsConfirmPassword(false);
      }
    },
    [newPassword],
  );

  // 닉네임 변경
  function changeNickname(e) {
    e.preventDefault();
    isNickname
      ? axios({
          url: `https://i8a804.p.ssafy.io/api/user/${userId}/nickname`,
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json',
          },
          data: {
            userId: userId,
            userNickname: userNickname,
          },
        })
          .then((res) => {
            res.data.message === 'success' && alert('닉네임 변경이 완료되었습니다');
            localStorage.removeItem('userNickname');
            localStorage.setItem('userNickname', userNickname);
          })
          .catch((err) => {
            console.log('닉네임 변경 에러', err);
          })
      : alert('닉네임 중복확인을 해주세요');
  }

  //비밀번호 변경
  const changeUserInfo = (e) => {
    e.preventDefault();
    isPassword && isConfirmPassword
      ? axios({
          url: `https://i8a804.p.ssafy.io/api/user/${userId}/password`,
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json',
          },
          data: {
            userId: userId,
            userPassword: newPassword,
          },
        })
          .then((res) => {
            res.data.message === 'success' && alert('비밀번호 변경이 완료되었습니다');
          })
          .catch((err) => {
            console.log('비밀번호 변경 오류', err);
          })
      : alert('비밀번호를 확인해주세요');
  };

  function goToMain() {
    navigate('/room');
  }

  return (
    <div className={styles.modify}>
      <img className={styles.logo} src={`${process.env.PUBLIC_URL}/logo.png`} alt="이미지없음" onClick={goToMain} />
      <form className={styles.modifyform}>
        <p className={styles.userInfoChange}>회원정보 변경</p>
        <div className={styles.nicknameForm}>
          <input
            value={userNickname}
            type="text"
            id={styles.changeNickname}
            onChange={(e) => setUserNickname(e.target.value)}
            placeholder={nickname}
          ></input>
          <button className={styles.check} onClick={checkNickname}>
            중복확인
          </button>
          <button className={styles.checkButton} onClick={changeNickname}>
            변경
          </button>
        </div>
        <div className={styles.passwordForm}>
          <div className={styles.passwords}>
            <input
              type="password"
              id={styles.changePassword}
              onChange={onChangeNewPassword}
              placeholder="새 비밀번호"
            />
            {newPassword.length > 0 && (
              <div className={`${isPassword ? styles.messageSuccess : styles.messageError}`}>{passwordMsg}</div>
            )}
            <input
              type="password"
              id={styles.changePasswordCheck}
              onChange={onChangeConfirmNewPassword}
              placeholder="새 비밀번호 확인"
            />
            {confirmPasswordMsg.length > 0 && (
              <div className={`${isConfirmPassword ? styles.messageSuccess : styles.messageError}`}>
                {confirmPasswordMsg}
              </div>
            )}
          </div>
          <button className={styles.modifyButton} onClick={changeUserInfo}>
            변경
          </button>
        </div>

        <Link
          to="/user/delete"
          style={{
            color: 'gray',
            textDecoration: 'none',
            textAlign: 'left',
            marginLeft: '14%',
          }}
        >
          <small>회원 탈퇴</small>
        </Link>
      </form>
    </div>
  );
}

export default ModifyPage;
