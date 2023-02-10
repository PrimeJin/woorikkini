import { createSlice } from '@reduxjs/toolkit';

export const voteSlice = createSlice({
  name: 'vote',
  initialState: {
    total: 0, //전체 투표수
    agree: 0, //찬성 수
    disagree: 0, //반대 수
  },
  reducers: {
    SET_VOTE: (state, { payload }) => {
      state.total = payload.total;
      state.agree = payload.agree;
      state.disagree = payload.disagree;
    },
    RESET_VOTE: (state) => {
      state.total = 0;
      state.agree = 0;
      state.disagree = 0;
    },
  },
});

export const { SET_VOTE, RESET_VOTE } = voteSlice.actions;

export default voteSlice.reducer;
