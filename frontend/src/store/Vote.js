import { createSlice } from '@reduxjs/toolkit';

export const voteSlice = createSlice({
  name: 'vote',
  initialState: {
    total: 0, //전체 투표수
    yes: 0, //찬성 수
    no: 0, //반대 수
  },
  reducers: {
    SET_VOTE: (state, { payload }) => {
      state.total = payload.total;
      state.yes = payload.yes;
      state.no = payload.no;
    },
    RESET_VOTE: (state) => {
      state.total = 0;
      state.yes = 0;
      state.no = 0;
    },
  },
});

export const { SET_VOTE, RESET_VOTE } = voteSlice.actions;

export default voteSlice.reducer;
