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
import CenterLogo from '../styles/CenterLogo';
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

  //가능하다면 처음 화면 렌더링할때 기존 유저의 닉네임을 띄워놓는것도
  useEffect(() => {});

  //store에 저장되어있는 user State의 id(email)가져오기
  const nickname = useSelector((state) => state.user.nickname);
  const userId = useSelector((state) => state.user.id);
  //닉네임 중복확인
  const checkNickname = (e) => {
    e.preventDefault();

    console.log(nickname);
    axios({
      method: 'GET',
      url: `https://i8a804.p.ssafy.io/api/user/userNickname=${nickname}`,
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => {
      if (response.data.message === 'success') {
        alert('사용 가능한 닉네임입니다.');
        console.log(response);
        setIsNickname(true);
      } else {
        alert('사용 불가능한 닉네임입니다.');
        console.log(response);
        setIsNickname(false);
      }
    });
  };

  //비밀번호 폼에 입력된 비밀번호 감지
  const onChangeNewPassword = useCallback((e) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    const passwordCurrent = e.target.value;
    setNewPassword(passwordCurrent);

    //주어진 문자열이 정규표현식을 만족하지 못하면
    if (!passwordRegex.test(passwordCurrent)) {
      setPasswordMsg('숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요');
      setIsPassword(false);
    } else {
      setPasswordMsg('안전한 비밀번호입니다');
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

  //회원정보 수정 요청
  const changeUserInfo = (e) => {
    e.preventDefault();
    const nickNameData = { userId: userId, userNickname: nickname };
    const passwordData = { userId: userId, userPassword: newPassword };
    if (!isNickname) {
      alert('닉네임 중복확인을 해주세요');
    } else if (!isPassword) {
      alert('비밀번호를 확인해주세요');
    } else {
      axios({
        url: `https://i8a804.p.ssafy.io/api/user/${userId}/nickname`,
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        data: nickNameData,
      })
        .then((response) => {
          if (response.status === 202) {
            axios({
              url: `https://i8a804.p.ssafy.io/api/user/${userId}/password`,
              method: 'PATCH',
              headers: {
                'Content-type': 'application/json',
              },
              data: passwordData,
            })
              .then((response) => {
                if (response.status === 202) {
                  window.confirm('정보가 수정되었습니다.');
                }
              })
              .catch((err) => {
                console.log('비밀번호 오류' + err);
              });
          }
        })
        .catch((err) => {
          console.log('닉네임 오류' + err);
        });
    }
  };

  return (
    <div className={styles.modify}>
      <div className={styles.logo_box}>
        <CenterLogo />
      </div>
      <form className={styles.modifyform}>
        <p className={styles.userInfoChange}>회원정보 수정</p>
        <div className={styles.nicknameForm}>
          <input type="text" id={styles.changeNickname} onChange={setUserNickname} placeholder="닉네임"></input>
          <button className={styles.checkButton} onClick={checkNickname}>
            중복확인
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
            수정
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
