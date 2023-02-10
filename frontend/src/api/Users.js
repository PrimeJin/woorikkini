/* eslint-disable no-return-await */
/* eslint-disable no-promise-executor-return */
/* eslint-disable max-lines-per-function */
/* eslint-disable radix */
/* eslint-disable no-else-return */
/* eslint-disable spaced-comment */
/**
 * 프론트엔드 <-> 백엔드 정보통신을 위한 상세기능 구현 API
 * LoginPage.js에서 Login버튼을 누르면 userEmail, userPassword를 받아
 * 여기로 보낸 다음 응답을 Backend로 보냅니다
 */

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://i8a804.p.ssafy.io:8040';

//Promise 요청 타임아웃 시간 설정
const TIME_OUT = 300 * 1000;

//상태 에러 발생
const statusError = {
  status: false,
  json: {
    error: ['연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.'],
  },
};

//Backend로 요청할 Promise객체
const requestPromise = (url, option) => {
  return fetch(url, option);
};

//promise 타임아웃 처리
//Promise.race가 Promise객체를 반환함
//둘 중에 먼저 완료된 것의 결과값을 그대로 이행
const timeoutPromise = () => {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TIME_OUT));
};

//promise 요청
const getPromise = async (url, option) => {
  return await Promise.race([requestPromise(url, option), timeoutPromise()]);
};

//Backend로 로그인 요청
export const loginUser = async (code) => {
  const option = {
    method: 'POST', //POST 요청
    headers: {
      'Content-Type': 'application/json;charset=UTF-8', //헤더
    },
    body: JSON.stringify(code),
  };

  //Promise 객체로 응답을 받을거면 이쪽으로
  const data = await getPromise(`${BASE_URL}/user/login`, option).catch(() => {
    return statusError;
  });

  //URL로 토큰이 담겨져서 오면 이쪽으로
  // let code = new URL(window.location.href).searchParams.get('code');

  //200번대 response(성공)
  //백엔드에서 넘어오는 data를 어떻게 가공할것인지
  if (parseInt(Number(data.status) / 100) === 2) {
    console.log(data);
    const status = data.ok; //통신이 성공했는지 여부
    const code = data.status; //응답 코드
    const text = await data.text(); //응답 데이터 전문
    const json = text.length ? JSON.parse(text) : ''; //응답 데이터를 JSON으로
    // const json = data.json();

    return {
      status,
      code,
      json,
    };
  }
  //그 외 response(실패)
  else {
    return statusError;
  }
};

////////////로그아웃///////////
export const logoutUser = async (credentials, accessToken) => {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(credentials),
  };

  const data = await getPromise(`${BASE_URL}/user/logout`, option).catch(() => {
    return statusError;
  });

  if (parseInt(Number(data.status) / 100 === 2)) {
    const status = data.ok;
    const code = data.status;
    const text = await data.text();
    const json = text.length ? JSON.parse(text) : '';
    return {
      status,
      code,
      json,
    };
  } else {
    return statusError;
  }
};

//Refresh Token 재요청
export const requestToken = async (refreshToken) => {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  };
  const data = await getPromise(`${BASE_URL}/user/login`, option).catch(() => {
    return statusError;
  });

  if (parseInt(Number(data.status) / 100) === 2) {
    const status = data.ok;
    const code = data.status;
    const text = await data.text();
    const json = text.length ? JSON.parse(text) : '';

    return {
      status,
      code,
      json,
    };
  } else return statusError;
};

//회원탈퇴
export const DeleteUser = (userId) => {
  const url = `${BASE_URL}/user/${userId}`;
  const accessToken = useSelector((state) => state.accessToken);
  const navigate = useNavigate();
  //useSelector는 React 함수나 Custom Hook 내부에 있어야 하는데
  //함수명을 대문자로 하지 않으면 react에서 react 함수로 인식하지를 않는다
  //use로 시작하지 않으면 react에서 custom hook으로 인식하지 않는다 그래서 오류가 생겼던것

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      authorization: `Bearer ${accessToken}`,
    },
  })
    .then(() => {
      alert('그동안 이용해주셔서 감사합니다.');
      navigate('/'); //메인화면으로 보내기
    })
    .catch((e) => {
      console.log(e);
    });
};
