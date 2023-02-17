/* eslint-disable max-lines-per-function */
/* eslint-disable spaced-comment */
/**
 * 로그인 페이지
 * 로그인 상세기능 구현은 /api/Users.js 참고
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { setRefreshToken } from '../storage/Cookies';
import { Link } from 'react-router-dom';

import { SET_USER } from '../store/User';
import { SET_TOKEN } from '../store/Auth';

import KakaoButton from '../components/buttons/KakaoButton';
import NaverButton from '../components/buttons/NaverButton';
import GoogleButton from '../components/buttons/GoogleButton';
import logo from '../assets/우리끼니로고.png';
import styles from '../styles/LoginPage.module.css';
import axios from '../../node_modules/axios/index';
// import Logo from '../components/user/UserPagesLogo';
import mainlogo from '../assets/우리끼니로고.png';
import { useState } from 'react';
import { useEffect } from 'react';

const LoginPage = () => {
  //React Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  //onSubmit 요청에 동작할 코드
  //Backend로 유저정보를 전달
  const onValid = async ({ userEmail, userPassword }) => {
    //response 객체
    //참고: /api/Users.js
    const data = {
      userEmail,
      userPassword,
    };

    axios({
      url: `https://i8a804.p.ssafy.io/api/user/login`,
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      data,
    })
      .then((response) => {
        //요청 응답이 오면 응답상태를 체크
        //response.status가 true면 응답이 200번대(성공)
        if (response.status === 200 || 202) {
          //Cookie에 Refresh Token 저장
          setRefreshToken(response.data.refreshToken);
          //store에 Access Token 저장하도록 Action Dispatch
          //참고: /store/Auth.js
          dispatch(SET_TOKEN(response.data.accessToken));
          dispatch(SET_USER({ id: response.data.userId, nickname: response.data.userNickname }));
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userNickname', response.data.userNickname);

          // 관리자인지 일반 사용자인지 구분
          if (response.data.userRole === 'ROLE_USER') {
            // 방 목록 페이지로 이동(메인)
            navigate('/room');
          } else if (response.data.userRole === 'ROLE_ADMIN') {
            // 관리자 페이지로 이동
            navigate('/admin');
          }
        } else {
          window.confirm('로그인에 실패했습니다. 다시 시도해주세요.');

          navigate('/user/login');
        }
        if (response.status === 204) {
          alert('활동이 정지된 회원입니다.');
        }
      })
      .catch((err) => {
        window.confirm('로그인에 실패했습니다. 다시 시도해주세요.');
      });

    //input폼 비워주는 코드
    setValue('userId', '');
    setValue('userPassword', '');
  };

  const onSignUp = () => {
    navigate('/user/signup');
  };

  const goHome = () => {
    navigate('/');
  };

  // 로고 클릭 -> 로그인 폼 나타내기
  const [logoClick, setLogoClick] = useState(false);
  const onLogoClick = () => {
    setLogoClick(!logoClick);
  };

  useEffect(() => {
    if (!logoClick)
      setTimeout(() => {
        onLogoClick();
      }, 2000);
  });

  return (
    <div className={styles.login}>
      <div className={logoClick ? styles.sentence_pause : styles.sentence}>
        <span>식</span>
        <span>구</span>
        <span>가</span>
        <span>&nbsp;</span>
        <span>필</span>
        <span>요</span>
        <span>해</span>
        <span>?</span>
      </div>
      <div className={logoClick ? styles.login_logo_pause : styles.login_logo} onClick={onLogoClick}>
        <img src={mainlogo} style={{ width: 150, height: 165 }} />
      </div>
      {logoClick ? (
        <form className={styles.loginform} onSubmit={handleSubmit(onValid)}>
          <div className={styles.inputform}>
            <div className={styles.inputs}>
              <input
                id={styles.userEmail}
                type="email"
                placeholder="이메일을 입력하세요"
                {...register('userEmail', {
                  required: '이메일은 필수 입력사항입니다.',
                  pattern: {
                    value: /\S+@\S+\.\S+/, //정규식
                    message: '이메일이 형식에 맞지 않습니다.',
                  },
                })}
              />

              {errors.email && <small role="alert">{errors.email.message}</small>}
              <input
                id={styles.userPassword}
                type="password"
                placeholder="비밀번호를 입력하세요"
                {...register('userPassword', {})}
              />
              {errors.password && <small role="alert">{errors.password.message}</small>}
            </div>

            <button className={styles.loginButton} type="submit" disabled={isSubmitting}>
              로그인
            </button>
          </div>

          <button className={styles.signUpButton} onClick={onSignUp}>
            회원가입
          </button>
          <Link
            to="/user/findpw"
            style={{
              position: 'relative',
              color: 'blue',
              textDecoration: 'none',
              marginBottom: '10%',
            }}
          >
            <div
              style={{
                padding: '2% 0% 5% 30%',
                position: 'absolute',
                width: '100px',
                left: 40,
                top: 10,
                fontSize: 'small',
              }}
            >
              비밀번호 찾기
            </div>
          </Link>
          <div className={styles.socialLogin}>
            <NaverButton />
            <KakaoButton />
            <GoogleButton />
          </div>
        </form>
      ) : (
        <div style={{ display: 'none' }}></div>
      )}
    </div>
  );
};

export default LoginPage;
