/**
 * 통합 reducer 관리 모듈
 * /store로 연결하면 자동으로 여기로 연결되서 모든 reducer 모듈을 관리함
 */
import { configureStore } from '@reduxjs/toolkit';
import { tokenSlice } from './Auth';
import { userSlice } from './User';

export default configureStore({
  reducer: {
    token: tokenSlice.reducer,
    user: userSlice.reducer,
  },

  devTools: process.env.NODE_ENV !== 'production',
});
