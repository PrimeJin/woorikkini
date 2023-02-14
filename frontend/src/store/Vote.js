import { createSlice } from '@reduxjs/toolkit';

export const voteSlice = createSlice({
  name: 'vote',
  initialState: {
    isVoteStart: false, //투표가 시작했는지
    voteUserId: '', //투표한 유저 id
    voteUserNickname: '', //투표한 유저 닉네임
    total: 0, //전체 투표수
    agree: 0, //찬성 수
    disagree: 0, //반대 수
  },
  reducers: {
    START_VOTE: (state, action) => {
      state.isVoteStart = true;
      state.voteUserId = action.payload.userId;
      state.voteUserNickname = action.payload.userNickname;
    },

    AGREE_VOTE: (state) => {
      state.total = state.total++;
      state.agree = state.agree++;
      state.disagree = state.disagree;
    },
    DISAGREE_VOTE: (state) => {
      state.total = state.total++;
      state.agree = state.agree;
      state.disagree = state.disagree++;
    },

    SET_VOTE: (state, action) => {
      state.isVoteStart = action.payload.isVoteStart;
      state.voteUserId = action.payload.voteUserId;
      state.voteUserNickname = action.payload.voteUserNickname;
      state.total = action.payload.total;
      state.agree = action.payload.agree;
      state.disagree = action.payload.disagree;
    },

    RESET_VOTE: (state) => {
      state.isVoteStart = false;
      state.voteUserId = '';
      state.voteUserNickname = '';
      state.total = 0;
      state.agree = 0;
      state.disagree = 0;
    },
  },
});

export const { START_VOTE, AGREE_VOTE, DISAGREE_VOTE, RESET_VOTE, SET_VOTE } = voteSlice.actions;

export default voteSlice.reducer;
