//현재 로그인한 유저 정보를 state에 저장해두고 싶다
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    name: '',
    nickname: '',
  },

  reducers: {
    //매개변수 state는 기존 state(initialState)
    //action은 state를 변화시키기 위한 action
    SET_USER: (state, action) => {
      state.id = parseInt(action.payload.id);
      state.name = action.payload.name;
      state.nickname = action.payload.nickname;
    },
    DELETE_USER: (state) => {
      state.id = '';
      state.name = '';
      state.nickname = '';
    },
  },
});

export const { SET_USER, DELETE_USER } = userSlice.actions;

export default userSlice.reducer;
