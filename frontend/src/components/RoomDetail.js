import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import UserVideoComponent from '../room/UserVideoComponent';
import { OpenVidu } from 'openvidu-browser';

// modal
import ReportModal from '../room/components/ReportModal';

//style
import styles from './RoomDetail.module.css';
import Messages from '../room/components/Messages';
import Button from '@mui/material/Button';
import QuestionAnswerTwoToneIcon from '@mui/icons-material/QuestionAnswerTwoTone';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import MicNoneTwoToneIcon from '@mui/icons-material/MicNoneTwoTone';
import VolumeOffTwoToneIcon from '@mui/icons-material/VolumeOffTwoTone';
import VideocamOffTwoToneIcon from '@mui/icons-material/VideocamOffTwoTone';
import MicOffTwoToneIcon from '@mui/icons-material/MicOffTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';

import Timer from '../room/components/Timer';

const OPENVIDU_SERVER_URL = 'https://i8a804.p.ssafy.io:8443'; //도커에 올린 openvidu server
const OPENVIDU_SERVER_SECRET = 'kkini'; //시크릿키값, 바꿔주면 좋음

const EncodeBase64 = (data) => {
  return Buffer.from(data).toString('base64');
};

//redux를 이용한 store에서 state와 reducer 가져오기
//this.props.authData 같은 식으로 사용 가능
const mapStateToProps = (state) => ({
  currentUserId: state.user.id,
  currentUserNickname: state.user.nickname,
  accessToken: state.token.accessToken,

  userData: state.user,
});

const mapDispatchToProps = (dispatch) => {};

class RoomDetail extends Component {
  //초기설정 생성자
  constructor(props) {
    super(props);

    const roomId = localStorage.getItem('roomId');
    const roomTitle = localStorage.getItem('roomTitle');
    const roomToken = localStorage.getItem('roomToken');
    const sessionId = localStorage.getItem('sessionId');
    const userName = localStorage.getItem('userNickname');
    const userId = localStorage.getItem('userId');

    this.messagesEndRef = React.createRef(null);
    //state
    this.state = {
      mySessionId: roomTitle,
      myUserName: userName,
      myUserId: userId,
      roomId: roomId,
      connections: [],
      connectionId: undefined,
      session: undefined, //현재 접속해있는 세션
      localUser: undefined,
      subscribers: [], //다른 사용자의 활성 웹캠 스트림
      mainStreamManager: undefined, // 스트림 종합한 페이지의 메인 비디오
      publisher: undefined, //로컬 웹캠 스트림
      isEmpty: false, //세션이 비어있는지 아닌지
      isHost: false, //
      isChatOn: false, //채팅팝업창이 켜져있는지 아닌지
      isListOn: false,
      token: '', //accessToken
      message: '', //메시지 단일입력
      messages: [], //메시지 로그
      messagesEnd: null,
      users: [{ userId: userId, userNickname: userName }], //전체 참여자
      reportModalOpen: false,
      voteModalOpen: false,
      banModalOpen: false,
      reportedUserId: '',
      eventData: {},

      //투표 관련 state
      isVoteStart: false, //투표가 시작했는지
      voteUserId: '', //투표한 유저 id
      voteUserNickname: '', //투표한 유저 닉네임
      total: 0, //전체 투표수
      agree: 0, //찬성 수
      disagree: 0, //반대 수

      // 사이드바
      msgOpen: true,
      myVideo: true,
      myAudio: true,
      othersAudio: true,
      // 설정바
      barOpen: false,
    };

    //method
    this.joinSession = this.joinSession.bind(this);
    this.closeSession = this.closeSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.deleteSubscriber = this.deleteSubscriber.bind(this);

    // modal 관련 함수들
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    // 영상바 관련 함수들
    this.clickVolume = this.clickVolume.bind(this);
    this.clickVideo = this.clickVideo.bind(this);
    this.clickMic = this.clickMic.bind(this);
    this.clickMsg = this.clickMsg.bind(this);
    this.settingBarOpen = this.settingBarOpen.bind(this);

    //chat
    this.handleChangeChatMessage = this.handleChangeChatMessage.bind(this);
    this.sendMessageByClick = this.sendMessageByClick.bind(this);
    this.sendMessageByEnter = this.sendMessageByEnter.bind(this);
    this.chatToggle = this.chatToggle.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);

    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.listToggle = this.listToggle.bind(this);

    this.handleChange = this.handleChange.bind(this);

    //투표
    this.startVote = this.startVote.bind(this);
    this.showVoteModal = this.showVoteModal.bind(this);
    this.voteComplete = this.voteComplete.bind(this);
    this.agreeVote = this.agreeVote.bind(this);
    this.disagreeVote = this.disagreeVote.bind(this);
  }

  //라이프 사이클

  //컴포넌트 마운트 직후
  componentDidMount() {
    // const openViduLayoutOptions = {};

    window.addEventListener('beforeunload', this.onbeforeunload);
    this.scrollToBottom();
    if (this.state.session == undefined) this.joinSession();

    //방 리스트를 띄워야 합니다
  }

  //컴포넌트 언마운트 직전
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
    //세션에 아무도 없으면 퇴장
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  sendRecentUser() {
    const roomId = this.state.roomId;
    const recentUser = this.state.users.length;
    axios({
      url: `https://i8a804.p.ssafy.io/api/room/${roomId}?roomRecentUser=${recentUser}`,
      methods: 'PATCH',
    });
  }

  //session에 자신의 stream을 publish(게시).
  //session을 subscribe(구독)함으로써 session에 publish된 stream들을 불러오는 것이 가능함
  //즉 session에 입장하면 우선 자신의 stream publish => session을 subscribe해서 타인의 stream 불러오기
  joinSession() {
    // --- OpenVidu 객체 호출 및 세션 초기화---
    this.OV = new OpenVidu();
    this.OV.enableProdMode();

    this.setState({ session: this.OV.initSession(), connections: [], subscribers: [] }, () => {
      const roomId = this.state.roomId;
      // const roomTitle = this.state.roomTitle;
      const userId = this.state.myUserId;
      const userNickname = this.state.myUserName;
      // OpenVidu 환경에서 토큰 발급받기
      //방 상세정보 제공받기
      axios({
        url: `https://i8a804.p.ssafy.io/api/room/${roomId}`,
        methods: 'GET',
      }).then((res) => {
        //subscribe
        this.state.session.on('streamCreated', (event) => {
          this.sendRecentUser();
          const newSubscriber = this.state.session.subscribe(event.stream, undefined);

          const newSubscribers = this.state.subscribers;
          newSubscribers.push(newSubscriber);

          // if (
          //   newSubscribers.filter((sub) => sub.userId === JSON.parse(newSubscriber.stream.connection.data).userId) ===
          //   []
          // )

          const newUser = JSON.parse(newSubscriber.stream.connection.data);
          const newUsers = this.state.users;
          newUsers.push(newUser);
          // if (newUsers.filter((user) => user.userId === newUser.userId) === []) newUsers.push(newUser);

          //중복 제거

          const users = [...new Set(newUsers)];
          const subscribers = [...new Set(newSubscribers)];

          this.setState({
            users: users,
            subscribers: subscribers,
          });
        });

        //사용자가 화상회의를 떠나면 Session객체에서 소멸된 stream을 받아와
        //subscribers 상태값 업데이트
        this.state.session.on('streamDestroyed', (event) => {
          event.preventDefault();
          this.deleteSubscriber(event.stream.streamManager);
          this.sendRecentUser();
        });

        this.state.session.on('exception', () => {
          this.sendRecentUser();
        });

        this.createToken(String(this.state.roomId)).then((token) => {
          this.state.session
            .connect(token, { userId: userId, userNickname: userNickname })
            .then(async () => {
              this.OV.getUserMedia({
                audioSource: false,
                videoSource: undefined,
                resolution: '640x480',
                frameRate: 30,
              }).then((mediaStream) => {
                let videoTrack = mediaStream.getVideoTracks()[0];

                //stream 게시(화면 출력)
                let newPublisher = this.OV.initPublisher(this.state.myUserName, {
                  audioSource: undefined,
                  videoSource: videoTrack,
                  publishAudio: true,
                  publishVideo: true,
                  insertMode: 'APPEND',
                  mirror: true, //좌우반전 옵션
                });
                this.state.session.publish(newPublisher);

                this.setState({
                  mainStreamManager: newPublisher,
                  publisher: newPublisher,
                });
              });
            })
            .catch((error) => {
              console.log('세션연결 오류:', error.code, error.message);
            });

          this.state.session.on('signal:chat', (event) => {
            const chatdata = event.data.split(','); //위에서 송신한 `${this.state.myUserName}, ${this.state.message}`를 분리

            if (chatdata[0] !== userNickname) {
              this.setState({
                messages: [
                  ...this.state.messages,
                  {
                    userName: chatdata[0],
                    text: chatdata[1],
                    chatClass: 'messages__item--visitor',
                  },
                ],
              });
            }
            this.scrollToBottom();
          });

          //투표 시작 signal 받기
          this.state.session.on('signal:voteStart', (event) => {
            //event.data에 누구를 추방할지에 대한 정보
            //각 사용자에게 투표 모달창을 띄움
            const result = JSON.parse(event.data);

            const data = {
              isVoteStart: true,
              voteUserId: result.voteUserId,
              voteUserNickname: result.voteUserNickname,
              total: result.total,
              agree: result.agree,
              disagree: result.disagree,
              start: result.start,
            };

            this.setState({
              eventData: data,
              isVoteStart: true,
              voteUserId: result.voteUserId,
              voteUserNickname: result.voteUserNickname,
              total: result.total,
              agree: result.agree,
              disagree: result.disagree,
            });
          });

          //누군가가 투표버튼을 누르면 모든 사용자에게 event 송신
          this.state.session.on('signal:sendVote', (event) => {
            const result = JSON.parse(event.data);
            console.log(result);
            this.setState({
              voteUserId: result.voteUserId,
              voteUserNickname: result.voteUserNickname,
              total: result.total,
              agree: result.total,
              disagree: result.disagree,
            });
            //투표후 결과값을 받아와보자

            //변경된 state값을 바로 받아오지 못하므로 setTimeout
            setTimeout(() => {
              const data = {
                voteUserId: this.state.voteUserId,
                voteUserNickname: this.state.voteUserNickname,
                total: this.state.total,
                agree: this.state.agree,
                disagree: this.state.disagree,
              };
              //모두 투표했을 경우 투표 종료
              if (data.total >= this.state.users.length - 1) {
                this.voteComplete(data);
              }
            }, 1000);
          });

          this.state.session.on('signal:getout', (event) => {
            const result = JSON.parse(event.data);
            const userName = localStorage.getItem('userNickname');
            if (result.voteUserNickname === userName) {
              alert('추방되었습니다!');
              this.leaveSession();
            } else {
              alert(`${result.voteUserNickname}님이 추방되었습니다`);
            }
          });
        });
      });
    });
  }

  // 모달 관련 함수들
  openModal(e) {
    if (e.target.name === 'report') {
      this.setState({
        reportModalOpen: true,
      });
      this.setState({
        reportedUserId: e.target.value,
      });
    } else if (e.target.name === 'vote') {
      this.setState({
        voteModalOpen: true,
      });
    }
  }

  closeModal(e) {
    if (e == 'close' || e.target.value === 'No') {
      this.setState({
        reportModalOpen: false,
      });
    }
  }

  // 아이콘 클릭 시 변경되는 사항
  clickVolume() {
    this.state.subscribers.forEach((subscriber) => {
      if (this.state.othersAudio) {
        subscriber.subscribeToAudio(false);
        this.setState({
          othersAudio: false,
        });
      } else {
        subscriber.subscribeToAudio(true);
        this.setState({
          othersAudio: true,
        });
      }
    });
  }
  clickVideo() {
    const publisher = this.state.publisher;
    if (this.state.myVideo) {
      publisher.publishVideo(false);
      this.setState({
        myVideo: false,
      });
    } else {
      publisher.publishVideo(true);
      this.setState({
        myVideo: true,
      });
    }
  }
  clickMic() {
    const publisher = this.state.publisher;
    if (this.state.myAudio) {
      publisher.publishAudio(false);
      this.setState({
        myAudio: false,
      });
    } else {
      publisher.publishAudio(true);
      this.setState({
        myAudio: true,
      });
    }
  }

  clickMsg() {
    this.setState({
      msgOpen: !this.state.msgOpen,
    });
  }

  settingBarOpen() {
    this.setState({
      barOpen: !this.state.barOpen,
    });
  }

  //메소드

  //방 이름 폼에 적으면 반영
  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  //유저 닉네임 폼에 적으면 반영(쓸일 없음)
  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  //chat input form 반영
  handleChangeChatMessage(e) {
    this.setState({
      message: e.target.value,
    });
  }

  //클릭해서 채팅보내기
  sendMessageByClick() {
    const newMessages = [...this.state.messages];
    newMessages.push({
      userName: this.state.myUserName,
      text: this.state.message,
      chatClass: 'messages__item--operator',
    });

    this.setState({
      messages: newMessages,
    });

    const mySession = this.state.session;

    if (this.state.message !== '')
      mySession
        .signal({
          data: `${this.state.myUserName},${this.state.message}`, //signal의 실질적 메시지
          to: [], //Session.on('signal')을 subscribe한 참여자들에게 전달됨. []거나 undefined일 경우, 전체 참여자에게 전달됨
          type: 'chat', //signal 타입. Session.on('signal:type') 이벤트를 subscribe한 참여자들에게 전달
        })
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    this.scrollToBottom();
    //message창 초기화
    this.setState({
      message: '',
    });
  }

  //엔터쳐서 채팅보내기
  sendMessageByEnter(e) {
    if (e.key === 'Enter') {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            userName: this.state.myUserName,
            text: this.state.message,
            chatClass: 'messages__item--operator',
          },
        ],
      });

      const mySession = this.state.session;
      if (this.state.message !== '')
        mySession
          .signal({
            data: `${this.state.myUserName},${this.state.message}`, //signal의 실질적 메시지
            to: [], //Session.on('signal')을 subscribe한 참여자들에게 전달됨. []거나 undefined일 경우, 전체 참여자에게 전달됨
            type: 'chat', //signal 타입. Session.on('signal:type') 이벤트를 subscribe한 참여자들에게 전달
          })
          .then(() => {})
          .catch((error) => {
            console.error(error);
          });
      this.scrollToBottom();
      //message창 초기화
      this.setState({
        message: '',
      });
    }
  }

  //선택한 화면(stream)을 메인으로 띄우기
  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    // const remoteUsers = this.state.subscribers;
    // const users = this.state.users;
    // const subStream = remoteUsers.filter((user) => user === streamManager)[0];
    // const index = remoteUsers.indexOf(subStream, 0);

    // const userStream = this.state.users.filter(
    //   (user) => user.userId === JSON.parse(subStream.stream.connection.data).userId,
    // );
    // const uindex = users.indexOf(userStream, 0);

    // console.log('subscriber 삭제');
    // console.log(index, uindex);
    // if (index > -1 && uindex > -1) {
    //   remoteUsers.splice(index, 1);
    //   users.splice(uindex, 1);
    //   this.setState({
    //     subscribers: remoteUsers,
    //     users: users,
    //   });
    // }
    const remoteUsers = this.state.subscribers;
    const users = this.state.users;
    const subStream = remoteUsers.filter((user) => user === streamManager)[0];
    const index = remoteUsers.indexOf(subStream, 0);
    const userStream = users.filter((user) => user.userId === JSON.parse(subStream.stream.connection.data).userId);
    const uindex = users.indexOf(userStream, 0);

    if (index > -1) {
      remoteUsers.splice(index, 1);
      users.splice(uindex, 1);
      this.setState({
        subscribers: remoteUsers,
        users: users,
      });
    }
  }

  listToggle() {
    this.setState({ isListOn: true });
  }

  //채팅창 팝업 열고 닫기
  chatToggle() {
    this.setState({ isChatOn: !this.state.isChatOn });
  }

  //채팅, 리스트 전환용 토글
  handleChange(event, newValue) {
    this.setState({
      value: newValue,
    });
  }

  //투표시작 신호(강퇴버튼을 누르면 시작함)
  //추방할 사람
  startVote(voteWho) {
    const userId = voteWho.userId;
    const userNickname = voteWho.userNickname;
    const myName = localStorage.getItem('userNickname');
    this.setState({
      isVoteStart: false,
      voteUserId: userId,
      voteUserNickname: userNickname,
      total: 0,
      agree: 0,
      disagree: 0,
    });
    const data = {
      isVoteStart: false,
      voteUserId: userId,
      voteUserNickname: userNickname,
      total: 0,
      agree: 0,
      disagree: 0,
      start: myName,
    };
    setTimeout(() => {
      console.log('투표 시작: ');
      console.log(data);
      this.state.session.signal({
        data: JSON.stringify(data),
        to: [], //투표 당사자 제외해야하는거 아닌가?
        type: 'voteStart', //signal:voteStart로 연결
      });
    }, 10);
  }

  //찬성표(유저 전체에게 신호가 감)
  agreeVote() {
    const data = {
      voteUserId: this.state.voteUserId,
      voteUserNickname: this.state.voteUserNickname,
      total: this.state.total + 1,
      agree: this.state.agree + 1,
      disagree: this.state.disagree,
    };
    this.state.session.signal({
      data: JSON.stringify(data),
      to: [],
      type: 'sendVote',
    });
    this.setState({
      isVoteStart: false,
    });
  }

  //반대표(유저 전체에게 신호가 감)
  disagreeVote() {
    const data = {
      voteUserId: this.state.voteUserId,
      voteUserNickname: this.state.voteUserNickname,
      total: this.state.total + 1,
      agree: this.state.agree,
      disagree: this.state.disagree + 1,
    };
    this.state.session.signal({
      data: JSON.stringify(data),
      to: [],
      type: 'sendVote',
    });
    this.setState({
      isVoteStart: false,
    });
  }
  //참여자 모두에게 보낼 추방투표 모달
  showVoteModal(data) {
    //voteInfo(누굴 추방할지)에 대한 투표모달창을 띄움
    console.log('모달 띄움');
    console.log(data);

    return (
      <div className={this.state.isVoteStart ? `${styles.modal} ${styles.openModal}` : styles.modal}>
        <section>
          <header>투표하기</header>
          <main>{data.voteUserNickname}님의 강제 퇴장을 찬성하시나요?</main>
          <p>이 창은 30초 후 자동으로 닫힙니다.</p>
          <Timer onComplete={() => this.disagreeVote()} />
          <footer>
            <Button
              value="agree"
              className={styles.ok_btn}
              onClick={() => this.agreeVote()}
              variant="contained"
              color="primary"
              size="large"
            >
              찬성
            </Button>
            <div style={{ width: 30 }}></div>
            <Button
              value="disagree"
              className={styles.close_bottom}
              onClick={() => this.disagreeVote()}
              variant="contained"
              color="error"
              size="large"
            >
              반대
            </Button>
          </footer>
        </section>
      </div>
    );
  }

  //투표 결과 집계
  voteComplete(result) {
    //과반수 이상이 찬성
    console.log('찬성 : ' + result.agree);
    console.log('전체 : ' + result.total);
    console.log('누구 : ' + result.voteUserNickname);

    const myName = localStorage.getItem('userNickname');
    this.setState({
      isVoteStart: false,
      voteUserId: '',
      voteUserNickname: '',
      total: 0,
      agree: 0,
      disagree: 0,
    });

    const roomId = localStorage.getItem('roomId');
    const accessToken = localStorage.getItem('accessToken');
    if (result.agree > result.disagree) {
      if (this.state.eventData.start === myName) {
        // 백엔드 및 openvidu 서버에 추방 요청을 보냄
        this.state.session.signal({
          data: JSON.stringify({ voteUserNickname: result.voteUserNickname }),
          to: [],
          type: 'getout',
        });
        axios({
          url: `https://i8a804.p.ssafy.io/api/room/exit/${roomId}/${result.voteUserId}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            authorization: `Bearer ${accessToken}`,
          },
        }).then(() => {});
      }
    } else {
      alert(`추방 투표가 부결되었습니다`);
    }

    //백엔드에 결과 전송 후 퇴장처리
    // window.location.
  }

  //방 퇴장(혼자만, 세션은 그대로 있어야함)
  leaveSession() {
    const mySession = this.state.session;
    const accessToken = this.props.accessToken;
    const roomId = localStorage.getItem('roomId');

    this.sendRecentUser();
    axios({
      url: `https://i8a804.p.ssafy.io/api/room/exit/${roomId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${accessToken}`,
      },
    }).then(() => {
      if (mySession) mySession.disconnect();
      this.OV = null; //Openvidu 객체 삭제
      this.setState({
        session: undefined,
        subscribers: [],
        mySessionId: 'SessionA',
        myUserName: 'Participant' + Math.floor(Math.random() * 100),
        mainStreamManager: undefined,
        publisher: undefined,
        localUser: undefined,
      });
    });
    window.location.replace('/room');
  }

  //세션 닫기(세션의 모든 참가자 퇴장)
  closeSession() {
    //백엔드에 퇴장 요청 보내기
    axios
      .delete(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${this.state.mySessionId}`, {
        headers: {
          Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        // //모든 속성(프로퍼티) 초기화
        this.OV = null; //Openvidu 객체 삭제
        this.setState({
          // session: undefined,
          subscribers: [],
          mySessionId: 'SessionA',
          myUserName: 'Participant' + Math.floor(Math.random() * 100),
          mainStreamManager: undefined,
          publisher: undefined,
        });
        // window.location.reload();
      });
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter((device) => device.kind === 'videoinput');

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId,
        );

        if (newVideoDevice.length > 0) {
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          await this.state.session.unpublish(this.state.mainStreamManager);

          await this.state.session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  //채팅창 스크롤 자동으로 내려주는 기능
  scrollToBottom = () => {
    //componentDidUpdate() 생명주기는 수시로 호출되기 때문에
    //호출될 때마다 messagesEndRef.current가 없을 수도 있으므로 체크해줘야 한다
    //안그러면 TypeError: Cannot read property 'scrollIntoView' of null가 표시될 수 있음
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  render() {
    const messages = this.state.messages;

    return (
      <div className={styles.container}>
        <div className={styles.inmain}>
          <div className={styles.inbody}>
            <div id="video-container" className={`${styles.videobox} ${'col-md-12 col-xs-12'}`}>
              {this.state.isVoteStart && this.state.eventData.voteUserId !== this.state.myUserId
                ? this.showVoteModal(this.state.eventData)
                : null}
              {this.state.publisher !== undefined ? (
                <UserVideoComponent
                  streamManager={this.state.publisher}
                  style={{
                    cursor: 'pointer',
                  }}
                  title={this.state.myUserName}
                />
              ) : null}
              {this.state.subscribers.map((sub, i) => {
                return (
                  <UserVideoComponent
                    streamManager={sub}
                    mainVideoStream={this.handleMainVideoStream}
                    title={this.state.users[i].userNickname}
                    style={{
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </div>
            {this.state.barOpen ? (
              <div
                className={styles.video_setting_bar}
                onChange={this.handleChange}
                aria-label="icon label tabs example"
              >
                <div className={styles.icons}>
                  <div className={styles.icon} onClick={this.clickVolume} name="audio">
                    {this.state.othersAudio ? (
                      <VolumeUpTwoToneIcon fontSize="large" />
                    ) : (
                      <VolumeOffTwoToneIcon fontSize="large" />
                    )}
                  </div>
                  <div className={styles.icon} onClick={this.clickVideo}>
                    {this.state.myVideo ? (
                      <VideocamTwoToneIcon fontSize="large" />
                    ) : (
                      <VideocamOffTwoToneIcon fontSize="large" />
                    )}
                  </div>
                  <div className={styles.icon} onClick={this.clickMic}>
                    {this.state.myAudio ? (
                      <MicNoneTwoToneIcon fontSize="large" />
                    ) : (
                      <MicOffTwoToneIcon fontSize="large" />
                    )}
                  </div>
                  {this.state.msgOpen ? (
                    <div className={styles.icon} style={{ cursor: 'default' }}>
                      <QuestionAnswerTwoToneIcon fontSize="large" />
                    </div>
                  ) : (
                    <div className={styles.icon} onClick={this.clickMsg}>
                      <QuestionAnswerTwoToneIcon fontSize="large" />
                    </div>
                  )}

                  {!this.state.msgOpen ? (
                    <div className={styles.icon} style={{ cursor: 'default' }}>
                      <PeopleAltTwoToneIcon fontSize="large" />
                    </div>
                  ) : (
                    <div className={styles.icon} onClick={this.clickMsg}>
                      <PeopleAltTwoToneIcon fontSize="large" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'none' }}></div>
            )}
          </div>

          <div className={styles.sidebar}>
            {this.state.msgOpen ? (
              <div className={styles.chatdiv}>
                <div className={styles.chatHeader}>
                  <h2>채팅</h2>
                </div>
                <div className={`${styles.chatLogBox} ${styles.scroll}`}>
                  <div className={this.state.writerMe ? styles.myMessage : styles.otherMessage}>
                    <Messages messages={messages} />
                    <div ref={this.messagesEndRef} />
                  </div>
                </div>
                <div className={styles.chatFooter}>
                  <input
                    id={styles.chatInputForm}
                    type="text"
                    placeholder="메시지를 입력하세요"
                    onChange={this.handleChangeChatMessage}
                    onKeyPress={this.sendMessageByEnter}
                    value={this.state.message}
                  />
                  <button className={styles.chatSendButton} onClick={this.sendMessageByClick}>
                    전송하기
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.chatdiv}>
                <div className={styles.chatHeader}>
                  <h2 style={{ marginBottom: '2%' }}>참여자 목록</h2>
                </div>
                <div className={`${styles.userListBox} ${styles.scroll}`}>
                  {this.state.users.map((user, index) => {
                    if (user.userNickname === this.state.myUserName) {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '90%',
                            margin: '2%',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ textOverflow: 'ellipsis' }}>{user.userNickname}</span>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '90%',
                            margin: '2%',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ textOverflow: 'ellipsis' }}>{user.userNickname}</span>
                          <div style={{ display: 'flex' }}>
                            <button
                              name="report"
                              value={user.userId}
                              onClick={this.openModal}
                              className={styles.listBtn}
                            >
                              신고
                            </button>
                            <button
                              onClick={() => this.startVote({ userId: user.userId, userNickname: user.userNickname })}
                              name="vote"
                              value={user.userId}
                              className={styles.listBtn}
                              style={{ backgroundColor: '#FF8D89' }}
                            >
                              강퇴
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
            <div className={styles.outIcon}>
              <div onClick={this.settingBarOpen} className={styles.settingBarBtn} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: 'small', color: '#090936', fontWeight: '900' }}>설정하기</div>
                <SettingsTwoToneIcon fontSize="large" style={{ marginTop: '10%', paddingTop: '5%' }} />
              </div>
              <div onClick={this.leaveSession} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: 'small', color: '#090936', fontWeight: '900', margin: '10% 0' }}>방 나가기</div>
                <img src={'img/방나가기아이콘.png'} style={{ width: '50px', height: '50px' }} />
              </div>
            </div>
            {this.state.reportModalOpen ? (
              <ReportModal
                reportModalOpen={this.state.reportModalOpen}
                closeModal={this.closeModal}
                currentUserId={this.props.currentUserId}
                reportedUserId={this.state.reportedUserId}
              ></ReportModal>
            ) : (
              <div style={{ display: 'none' }}></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  //createSession 응답이 오면 createToken을 실행하게 해서
  //token이 undefined인채로 getToken을 실행하는 일을 막아요
  async getToken(id) {
    const sessionId = await this.createSession(id);
    return await this.createToken(sessionId);
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
          { customSessionId: sessionId },
          {
            headers: {
              Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => {
          console.log('createSession');
          resolve(response.data.id);
        })
        .catch((response) => {
          const error = { ...response };
          // console.log('세션을 못만듬');
          // console.log(response);
          if (error.response) {
            if (error.response.status === 409) {
              resolve(localStorage.getItem('roomTitle'));
              console.log('이미 있는 세션입니다');
            } else if (
              window.confirm(
                `OpenVidu 서버와 연결되지 않았습니다. 인증서 오류 일 수도 있습니다. "${OPENVIDU_SERVER_URL}"\n\n 확인해주세요.` +
                  `만약 인증 문제를 찾을 수 없다면, OpenVidu 서버가 열려 있는지 확인해주세요`,
              )
            ) {
              window.location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      const data = {};
      axios
        .post(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`, data, {
          headers: {
            Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          resolve(response.data.token);
          this.setState({
            token: response.data.token,
            connectionId: response.data.connectionId,
          });
        })
        .catch((error) => reject(error));
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomDetail);
