/* eslint-disable no-return-await */
/* eslint-disable no-promise-executor-return */
/* eslint-disable max-lines-per-function */
/* eslint-disable radix */
/* eslint-disable no-else-return */
/* eslint-disable spaced-comment */
/**
 * 로그인/로그아웃 정보통신을 위한 상세기능 구현 API
 * LoginPage.js에서 Login버튼을 누르면 userEmail, userPassword를 받아
 * 여기로 보낸 다음 응답을 Backend로 보냅니다
 */
import axios from 'axios';
import { SET_TOKEN } from '../store/Auth';
import { setRefreshToken } from '../storage/Cookies';

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
//그냥 fetch를 쓰는것과 똑같지만 코드의 가독성을 위해
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
export const loginUser = async (credentials) => {
  const option = {
    method: 'POST', //POST 요청
    headers: {
      'Content-Type': 'application/json;charset=UTF-8', //헤더
    },
    body: JSON.stringify(credentials), //credentials 인자를 JSON으로 처리해서 싣어보냄
  };

  const data = await getPromise('/user/login', option).catch(() => {
    return statusError;
  });

  //200번대 response(성공)
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

  const data = await getPromise('/logout', option).catch(() => {
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

  const data = await getPromise('/user/login', option).catch(() => {
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

////////////////카카오 소셜 로그인/////////////////////

//1. 인가코드를 백엔드로 보낸다
//2. 백엔드에서 인가코드를 카카오 인증서버로 보내서 자체 토큰발행
//3. 백엔드에서 카카오로부터 받은 토큰을 기반으로 Access Token 발행해서 프론트로 리턴
//4. 우리가 받게 되는건 백엔드에서 자체 생성한 Access Token
export const kakaoLogin = (code) => {
  return function (dispatch, getState, { history }) {
    axios({
      method: 'GET',
      //FE -> BE로 인가코드를 싣어서 요청을 보내기
      url: `70.12.247.235/oauth/callback/kakao?code=${code}`,
    })
      .then((response) => {
        console.log(response); //Access Token 확인용

        // const ACCESS_TOKEN = response.data.accessToken;
        // localStorage.setItem('accessToken', ACCESS_TOKEN); //로컬스토리지에 임시저장(안해도됨)
        //Cookie에 Refresh Token 저장
        setRefreshToken(response.json.refresh_token);
        //store에 Access Token 저장하도록 Action Dispatch
        //참고: /store/Auth.js
        dispatch(SET_TOKEN(response.json.access_token));

        history.replace('/'); //로그인
      })
      .catch((err) => {
        console.log('소셜 로그인 에러', err);
        window.alert('로그인에 실패하였습니다');
        history.replace('/user/login'); //로그인 실패했으니 다시 로그인 화면으로
      });
  };
};
