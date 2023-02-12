import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  OV: null,
  session: undefined, //현재 접속해있는 세션
  sessionId: '', //세션 ID
  sessionTitle: '',
  myUserName: '',
  myUserId: '',
  mainStreamManager: undefined, // 스트림 종합한 페이지의 메인 비디오
  publisher: undefined, //로컬 웹캠 스트림
  subscribers: [], //다른 사용자의 활성 웹캠 스트림
  isEmpty: false, //세션이 비어있는지 아닌지
  isHost: false, //
  isChatOn: false, //채팅팝업창이 켜져있는지 아닌지
  isListOn: false,
  isVoteOn: false, //투표창이 켜져있는지 아닌지
  ovtoken: '', //openvidu용 accessToken
  message: '', //메시지 단일입력
  messages: [], //메시지 로그
  messagesEnd: null,
  users: [], //전체 참여자
  eventData: '',
  reportModalOpen: false,
  voteModalOpen: false,
  banModalOpen: false,
  reportedUserId: '',
};

export const openviduSlice = createSlice({
  name: 'openvidu',
  initialState,
  reducers: {
    SET_USERNAME: (state, action) => {
      state.myUserName = action.payload;
    },

    SET_SESSION: (state, action) => {
      state.sessionId = action.payload;
    },

    SET_PUBLISHER: (state, action) => {
      state.mainStreamManager = action.payload;
      state.publisher = action.payload;
    },

    SET_SUBSCRIBERS: (state, action) => {
      state.subscribers = [...action.payload];
    },

    SET_MESSAGE: (state, action) => {
      state.message = action.payload;
    },

    SET_MESSAGES: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },

    SET_OVTOKEN: (state, action) => {
      state.ovtoken = action.payload;
    },

    SET_USERS: (state, action) => {
      state.users = action.payload;
    },

    LEAVE_SESSION: (state) => {
      state.OV = null;
      state.session = undefined;
      state.subscribers = [];
      state.mainStreamManager = undefined;
      state.publisher = undefined;
    },

    SET_REPORTMODAL: (state, action) => {
      state.reportModalOpen = true;
      state.reportedUserId = action.payload;
    },

    SET_VOTEMODAL: (state) => {
      state.voteModalOpen = true;
    },

    SET_ISLIST: (state) => {
      state.isListOn = !state.isListOn;
    },

    SET_ISCHAT: (state) => {
      state.isChatOn = !state.isChatOn;
    },
  },
});

export const {
  SET_USERNAME,
  SET_SESSION,
  SET_PUBLISHER,
  SET_SUBSCRIBERS,
  SET_MESSAGE,
  SET_MESSAGES,
  SET_OVTOKEN,
  SET_USERS,
  LEAVE_SESSION,
  SET_REPORTMODAL,
  SET_VOTEMODAL,
  SET_ISLIST,
  SET_ISCHAT,
} = openviduSlice.actions;

export default openviduSlice.reducer;
