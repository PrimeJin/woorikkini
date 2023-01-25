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
