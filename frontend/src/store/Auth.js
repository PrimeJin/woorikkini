/**
 * createSlice를 활용해서 state, reducer를 동시에 관리하는 모듈
 * DUCKS 패턴과 유사하나 액션타입, 액션생성함수를 따로 정의하지 않아도 되서 편리함
 * Token 관련 액션을 관리하는 모듈
 */
import { createSlice } from '@reduxjs/toolkit';

//토큰 만료 시간
export const TOKEN_TIME_OUT = 600 * 1000 * 1000;

export const tokenSlice = createSlice({
  name: 'token', //접근할때 state.token으로 접근하면 되는것
  //초기 상태(initial state)
  //Access Token을 여기에 저장
  initialState: {
    authenticated: false,
    accessToken: null,
    expireTime: null,
  },

  //reducers
  reducers: {
    //토큰 생성 액션
    SET_TOKEN: (state, action) => {
      state.authenticated = true;
      state.accessToken = action.payload;
      state.expireTime = new Date().getTime() + TOKEN_TIME_OUT;
    },

    RESET_TOKEN: (state, action) => {
      state.authenticated = true;
      state.accessToken = action.payload.accessToken;
      state.expireTime = state.expireTime;
    },
    //토큰 삭제 액션
    DELETE_TOKEN: (state) => {
      state.authenticated = false;
      state.accessToken = null;
      state.expireTime = null;
    },
  },
});

export const { SET_TOKEN, RESET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;
