import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import UserVideoComponent from '../room/UserVideoComponent';
import { OpenVidu } from 'openvidu-browser';
import styles from './RoomDetail.module.css';

// modal
import ReportModal from '../room/components/ReportModal';

//style
import CenterLogo from '../styles/CenterLogo';
// import styles from '../room/UserVideo.module.css';
import Messages from '../room/components/Messages';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import Tab from '@mui/material/Tab';
// import TabPanel from '@mui/lab/TabPanel';
// import ChatIcon from '@mui/icons-material/Chat';
// import UserIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import QuestionAnswerTwoToneIcon from '@mui/icons-material/QuestionAnswerTwoTone';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import MicNoneTwoToneIcon from '@mui/icons-material/MicNoneTwoTone';

import { SET_VOTE, RESET_VOTE } from '../store/Vote';
import Timer from '../room/components/Timer';

const OPENVIDU_SERVER_URL = 'https://i8a804.p.ssafy.io:8443'; //도커에 올린 openvidu server
const OPENVIDU_SERVER_SECRET = 'kkini'; //시크릿키값, 바꿔주면 좋음

const EncodeBase64 = (data) => {
  return Buffer.from(data).toString('base64');
};

//redux를 이용한 store에서 state와 reducer 가져오기
//this.props.authData 같은 식으로 사용 가능
const mapStateToProps = (state) => ({
  voteTotal: state.vote.total,
  voteAgree: state.vote.agree,
  voteDisagree: state.vote.disagree,
  currentUserId: state.user.id,
  currentUserNickname: state.user.nickname,
  accessToken: state.token.accessToken,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setVote: (data) => {
      dispatch(SET_VOTE(data));
    },
    resetVote: () => {
      dispatch(RESET_VOTE());
    },
  };
};

class VideoRoom extends Component {
  //초기설정 생성자
  constructor(props) {
    super(props);

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
      mainStreamManager: undefined, // 스트림 종합한 페이지의 메인 비디오
      publisher: undefined, //로컬 웹캠 스트림
      subscribers: [], //다른 사용자의 활성 웹캠 스트림
      isEmpty: false, //세션이 비어있는지 아닌지
      isHost: false, //
      isChatOn: false, //채팅팝업창이 켜져있는지 아닌지
      isListOn: false,
      isVoteOn: false, //투표창이 켜져있는지 아닌지
      token: '', //accessToken
      message: '', //메시지 단일입력
      messages: [], //메시지 로그
      messagesEnd: null,
      users: [], //전체 참여자
      value: '1', //1: 채팅창, 2:참여자 목록
      eventData: '',
      reportModalOpen: false,
      voteModalOpen: false,
      banModalOpen: false,

      reportedUserId: '',

      msgOpen: false,
    };

    //method
    this.joinSession = this.joinSession.bind(this);
    this.closeSession = this.closeSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);

    // modal 관련 함수들
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    // 영상 바 관련 함수들
    this.clickVolume = this.clickVolume.bind(this);
    this.clickVideo = this.clickVideo.bind(this);
    this.clickMic = this.clickMic.bind(this);
    this.clickMsg = this.clickMsg.bind(this);

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
    window.addEventListener('beforeunload', this.onbeforeunload);
    this.scrollToBottom();
    this.getUserList();
    //방 리스트를 띄워야 합니다
  }

  //컴포넌트가 업데이트 될 때마다 실행
  //디버깅용
  componentDidUpdate() {
    // this.getUserList();
    // console.log('createSession');
    // console.log(this.state.session.sessionId); //현재 세션값
    // console.log('createToken');
    // console.log(this.state.token); //현재 토큰값
  }

  //컴포넌트 언마운트 직전
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
    //세션에 아무도 없으면 퇴장
    if (!this.state.isEmpty) {
      this.closeSession();
    }
  }

  onbeforeunload(event) {
    this.closeSession();
  }

  //submit버튼을 클릭하면 방(세션)에 참여

  //session에 자신의 stream을 publish(게시).
  //session을 subscribe(구독)함으로써 session에 publish된 stream들을 불러오는 것이 가능함
  //즉 session에 입장하면 우선 자신의 stream publish => session을 subscribe해서 타인의 stream 불러오기
  joinSession() {
    // --- OpenVidu 객체 호출 및 세션 초기화---
    this.OV = new OpenVidu();
    this.OV.enableProdMode();

    this.setState({ session: this.OV.initSession() }, () => {
      const roomId = this.state.roomId;
      // const roomTitle = this.state.roomTitle;
      const userId = this.state.myUserId;
      const userNickname = this.state.myUserName;
      console.log('방번호: ', roomId);
      // OpenVidu 환경에서 토큰 발급받기
      //방 상세정보 제공받기
      axios({
        url: `https://i8a804.p.ssafy.io/api/room/${roomId}`,
        methods: 'GET',
      }).then((res) => {
        //subscribe
        this.state.session.on('streamCreated', (event) => {
          const newSubscriber = this.state.session.subscribe(
            event.stream,
            undefined,
            // console.log(JSON.parse(event.stream.connection.data)),
            // JSON.parse(event.stream.connection.data).clientData,
          );

          const newSubscribers = this.state.subscribers;
          newSubscribers.push(newSubscriber);

          const newConnection = event.stream.connection;
          const newConnections = this.state.connections;
          newConnections.push(newConnection);
          console.log(newConnections);

          const newUser = JSON.parse(event.stream.connection.data);
          const newUsers = this.state.users;
          newUsers.push(newUser);

          //중복 제거
          const usersSet = new Set(newUsers);
          const subscribersSet = new Set(newSubscribers);
          const users = [...usersSet];
          const subscribers = [...subscribersSet];
          this.setState({
            users: users,
            subscribers: subscribers,
            connections: newConnections,
          });
        });

        this.state.session.on('reconnecting', () => console.warn('Oops! Trying to reconnect to the session'));
        this.state.session.on('reconnected', () => console.log('Hurray! You successfully reconnected to the session'));
        this.state.session.on('sessionDisconnected', (event) => {
          if (event.reason === 'networkDisconnect') {
            console.warn('Dang-it... You lost your connection to the session');
          } else {
            // Disconnected from the session for other reason than a network drop
          }
        });

        //사용자가 화상회의를 떠나면 Session객체에서 소멸된 stream을 받아와
        //subscribers 상태값 업데이트
        this.state.session.on('streamDestroyed', (event) => {
          event.preventDefault();
          this.deleteSubscriber(event.stream.streamManager);
        });

        this.state.session.on('exception', (event) => {
          if (event.name === 'ICE_CONNECTION_FAILED') {
            var stream = event.origin;
            console.warn('Stream ' + stream.streamId + ' broke!');
            console.warn('Reconnection process automatically started');
          }
          if (event.name === 'ICE_CONNECTION_DISCONNECTED') {
            var stream = event.origin;
            console.warn('Stream ' + stream.streamId + ' disconnected!');
            console.warn('Giving it some time to be restored. If not possible, reconnection process will start');
          }
        });

        // this.state.session.on('connectionCreated', (event) => {
        //   this.setState({ connection: event.connection });
        // });

        this.getToken(res.data.result.roomTitle).then((token) => {
          this.state.session
            .connect(token, { userId: userId, userNickname: userNickname, connection: this.state.connection })
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
          });

          //투표 시작 signal 받기
          this.state.session.on('signal:voteStart', (event) => {
            //event.data에 누구를 추방할지에 대한 정보
            //각 사용자에게 투표 모달창을 띄움
            console.log('voteStart 신호 수신');
            const result = JSON.parse(event.data);

            const data = {
              isVoteStart: true,
              voteUserId: result.voteUserId,
              voteUserNickname: result.voteUserNickname,
              total: result.total,
              agree: result.agree,
              disagree: result.disagree,
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
            // console.log('누군가 투표함');
            // console.log(JSON.parse(event.data));
            // this.setVoteUser(JSON.parse(event.data)); //store의 voteresult값을 1 늘려줌(store/vote.js 참고)
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
              if (data.total == this.state.subscribers.length + 1) {
                this.state.session.signal({
                  data: JSON.stringify(data),
                  to: [],
                  type: 'endVote',
                });
              }
            }, 1000);
          });

          this.state.session.on('signal:endVote', (event) => {
            console.log('투표 종료');
            const result = JSON.parse(event.data);
            console.log(result);
            this.setState({
              voteUserId: result.voteUserId,
              voteUserNickname: result.voteUserNickname,
              total: result.total,
              agree: result.total,
              disagree: result.disagree,
            });

            this.voteComplete(result);
          });

          this.state.session.on('signal:getout', (event) => {
            alert('추방되었습니다!');
            this.leaveSession();
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
    console.log('!', this.state.subscribers);
    // this.subscriber.subscribeToAudio(); // true to unmute the audio track, false to mute it
  }
  clickVideo() {
    console.log('!!', this.state.publisher);
    console.log('!!', this.state.publisher.stream.audioActive);
    this.setState({
      // publisher.stream.audioActiv
    });
    // this.setState({
    //   publishVideo: !this.publishVideo, // true to enable the video track, false to disable it
    // });
  }
  clickMic() {
    console.log('!!!', this.publisher);
    // this.publisher.publishAudio(!this.publishAudio); // true to unmute the audio track, false to mute it
  }

  clickMsg(e) {
    console.log(e);
    this.setState({
      msgOpen: !this.state.msgOpen,
    });
    console.log('@@', this.state.msgOpen);
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
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  //userList 호출
  getUserList() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `${'https://i8a804.p.ssafy.io:8443/openvidu/api/sessions/'}${this.state.mySessionId}/connection`,
        headers: {
          Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
        },
      })
        .then((response) => {
          let content = response.data.content;
          content.sort((a, b) => a.createdAt - b.createdAt); //들어온 순서대로 정리
          this.setState({
            users: content,
          });
        })
        .catch((error) => reject(error));
    });
  }

  //참여자 리스트 리턴
  userList(users) {
    const list = users.map((user, index) => (
      <li>
        <Box>
          <Stack direction="row" spacing={3}>
            {/* userId */}
            {/* <div>1{user.clientData.split(',')[0].split(':')[1]}</div> */}
            {/* userNickname */}
            <div>{user.clientData.split(',')[1].split(':')[1].split('"')[1]}</div>
            <Button
              name="report"
              value={user.clientData.split(',')[0].split(':')[1]}
              variant="contained"
              color="error"
              size="small"
              onClick={this.openModal}
            >
              신고
            </Button>
            <Button
              // onClick={() => this.startVote(user.clientData.split(',')[1].split(':')[1].split('"')[1])}
              onClick={() => this.startVote(user.clientData)}
              name="vote"
              value={user.clientData.split(',')[0].split(':')[1]}
              variant="contained"
              color="error"
              size="small"
            >
              강퇴
            </Button>
          </Stack>
        </Box>
      </li>
    ));
    return <ul>{list}</ul>;
  }

  listToggle() {
    this.getUserList(); //추가로 유저가 들어왔다 나갈때도 자동으로 갱신될 수 있게
    this.setState({ isListOn: !this.state.isListOn });
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

  //submit버튼을 클릭하면 방(세션)에 참여

  //session에 자신의 stream을 publish(게시).
  //session을 subscribe(구독)함으로써 session에 publish된 stream들을 불러오는 것이 가능함
  //즉 session에 입장하면 우선 자신의 stream publish => session을 subscribe해서 타인의 stream 불러오기
  joinSession() {
    // --- OpenVidu 객체 호출 및 세션 초기화---
    this.OV = new OpenVidu();

    this.setState({ session: this.OV.initSession() }, () => {
      // OpenVidu 환경에서 토큰 발급받기
      this.getToken().then((token) => {
        //토큰을 받았으면 connect(token)으로 세션에 연결할 수 있게 된다
        //2번째 파라미터로 세션에 있는 모든 사용자에게 넘길 데이터를 공유할 수 있다
        this.state.session
          .connect(token, { userId: this.state.myUserId, userNickname: this.state.myUserName })
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
              this.getUserList();
              this.setState({
                mainStreamManager: newPublisher,
                publisher: newPublisher,
              });
            });
          })
          .catch((error) => {
            console.log('세션연결 오류:', error.code, error.message);
          });
      });

      //관심있는 세션 이벤트 구독(subscribe)
      this.state.session.on('streamCreated', (event) => {
        let newSubscriber = this.state.session.subscribe(
          event.stream,
          JSON.parse(event.stream.connection.data).clientData,
        );
        let newSubscribers = this.state.subscribers;
        newSubscribers.push(newSubscriber);

        this.setState({
          subscribers: [...newSubscribers],
        });
        this.getUserList();
        // console.log('subscribers ' + this.subscribers); //등록 확인용
      });

      this.state.session.on('signal:chat', (event) => {
        let chatdata = event.data.split(','); //위에서 송신한 `${this.state.myUserName}, ${this.state.message}`를 분리

        if (chatdata[0] !== this.state.myUserName) {
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
      });

      //사용자가 화상회의를 떠나면 Session객체에서 소멸된 stream을 받아와
      //subscribers 상태값 업데이트
      this.state.session.on('streamDestroyed', (event) => {
        this.deleteSubscriber(event.stream.streamManager);
        this.getUserList(); //참여자 목록 갱신
      });

      //투표 시작 signal 받기
      this.state.session.on('signal:voteStart', (event) => {
        //투표창 모달 띄우기
        // console.log('투표 시작모달 띄우기');
        //event.data에 누구를 추방할지에 대한 정보
        //각 사용자에게 투표 모달창을 띄움
        // console.log(event.data);
        this.setState({
          isVoteOn: true,
          eventData: event.data,
        });
        // console.log(this.state.eventData);
      });

      //누군가가 투표버튼을 누르면 모든 사용자에게 event 송신
      this.state.session.on('signal:sendVote', (event) => {
        // console.log('누군가 투표함');
        // console.log(JSON.parse(event.data));
        this.setVoteUser(JSON.parse(event.data)); //store의 voteresult값을 1 늘려줌(store/vote.js 참고)
        console.log(event.data);
        //투표후 결과값을 받아와보자
        //변경된 state값을 바로 받아오지 못하므로 setTimeout
        setTimeout(() => {
          const userId = JSON.parse(event.data).userId;
          const userNickname = JSON.parse(event.data).userNickname;
          const total = this.props.voteTotal;
          const agree = this.props.voteAgree;
          const disagree = this.props.voteDisagree;
          const result = {
            userId: userId,
            userNickname: userNickname,
            total: total, //전체 투표수
            agree: agree, //찬성 수
            disagree: disagree, //반대 수
          };
          //모두 투표했을 경우 투표 종료
          if (total == this.state.subscribers.length + 1) {
            this.voteComplete(result);
            this.resetVoteUser(); //투표값 초기화
          }
        }, 1000);
      });
    });
  }

  //투표시작 신호(강퇴버튼을 누르면 시작함)
  //추방할 사람
  startVote(voteWho) {
    const userId = voteWho.userId;
    const userNickname = voteWho.userNickname;
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
    };

    // console.log('투표 시작: ');
    // console.log(voteResult);
    this.state.session.signal({
      data: JSON.stringify(voteResult),
      to: [], //투표 당사자 제외해야하는거 아닌가?
      type: 'voteStart', //signal:voteStart로 연결
    });
  }

  //vote state값 변경
  setVoteUser = (data) => {
    this.props.setVote(data);
  };

  //vote state값 초기화
  resetVoteUser = () => {
    this.props.resetVote();
  };

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
      data: JSON.stringify(voteInfo),
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
      data: JSON.stringify(voteInfo),
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
    const voteInfo = JSON.parse(data);
    // console.log('모달 띄움');
    // console.log(voteInfo);

    return (
      <div className={this.state.isVoteOn ? `${styles.modal} ${styles.openModal}` : styles.modal}>
        <section>
          <header>투표하기</header>
          <main>{voteInfo.userNickname}님의 강제 퇴장을 찬성하시나요?</main>
          <p>이 창은 30초 후 자동으로 닫힙니다.</p>
          <Timer onComplete={() => this.disagree(voteInfo)} />
          <footer>
            <Button
              value="agree"
              className={styles.ok_btn}
              onClick={() => this.agree(voteInfo)}
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
              onClick={() => this.disagree(voteInfo)}
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

    this.setState({
      isVoteStart: false,
      voteUserId: '',
      voteUserNickname: '',
      total: 0,
      agree: 0,
      disagree: 0,
    });

    const roomId = localStorage.getItem('roomId');
    const accessToken = this.props.accessToken;
    if (result.agree / result.total >= 0.5) {
      // 백엔드 및 openvidu 서버에 추방 요청을 보냄
      axios({
        url: `https://i8a804.p.ssafy.io/api/room/exit/${roomId}/${result.voteUserId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          if (res.status == 200 || 202) {
            alert(`${result.voteUserNickname}님이 추방되었습니다`);
            this.state.connections.map((connection) => {
              const connectionUser = JSON.parse(connection.data);
              if (connectionUser.userId == result.voteUserId && connectionUser.userNickname == result.voteUserNickname)
                this.state.session.signal({
                  data: result.voteUserNickname,
                  to: [connection],
                  type: 'getout',
                });
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert(`추방 투표가 부결되었습니다`);
    }

    //백엔드에 결과 전송 후 퇴장처리
  }

  //방 퇴장(혼자만, 세션은 그대로 있어야함)
  leaveSession() {
    const mySession = this.state.session;

    mySession.disconnect();
    this.OV = null; //Openvidu 객체 삭제
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined,
    });
    // window.location.reload();
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
      this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  render() {
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;
    const messages = this.state.messages;
    const myUserId = this.state.myUserId;

    return (
      <div className={styles.container}>
        <div className={styles.inmain}>
          <div className={styles.inbody}>
            <div id="video-container" className={`${styles.videobox} ${'col-md-12 col-xs-12'}`}>
              {this.state.isVoteStart && this.state.eventData.voteUserId !== this.state.myUserId
                ? this.showVoteModal(this.state.eventData)
                : null}
              {this.state.publisher !== undefined ? (
                <div
                  className="stream-container col-md-4 col-xs-4"
                  style={{
                    cursor: 'pointer',
                    width: '80%',
                    minHeight: '150px',
                    position: 'relative',
                  }}
                  title={this.state.myUserName}
                  // onClick={() => this.handleMainVideoStream(this.state.publisher)}
                >
                  <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null}
              {this.state.subscribers.map((sub, i) => {
                return (
                  <div
                    key={i}
                    className="stream-container col-md-4 col-xs-4"
                    style={{
                      cursor: 'pointer',
                      width: '80%',
                      minHeight: '150px',
                      position: 'relative',
                    }}
                    title={this.state.users[i].userNickname}
                    // onClick={() => this.handleMainVideoStream(sub)}
                  >
                    <UserVideoComponent streamManager={sub} mainVideoStream={this.handleMainVideoStream} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles.inmain}>
            <div className={styles.inbody}>
              <div id="video-container" className={`${styles.videobox} ${'col-md-12 col-xs-12'}`}>
                {this.state.isVoteOn ? this.showVoteModal(this.state.eventData) : null}
                {this.state.publisher !== undefined ? (
                  <div
                    className="stream-container col-md-4 col-xs-4"
                    onClick={() => this.handleMainVideoStream(this.state.publisher)}
                  >
                    <UserVideoComponent streamManager={this.state.publisher} />
                  </div>
                ) : null}
                {this.state.subscribers.map((sub, i) => (
                  <div
                    key={i}
                    className="stream-container col-md-4 col-xs-4"
                    onClick={() => this.handleMainVideoStream(sub)}
                  >
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
              </div>
              <div
                className={styles.video_setting_bar}
                onChange={this.handleChange}
                aria-label="icon label tabs example"
              >
                <div className={styles.icons}>
                  <div className={styles.icon} onClick={this.clickVolume} name="audio">
                    <VolumeUpTwoToneIcon fontSize="large" />
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2" sx={{ background: '#ffd4c3' }}>
                <div className={`${styles.chatWrapper} ${styles.chatbox__active}`}>
                  <div className={styles.chatHeader}>
                    <h2 style={{ marginBottom: '2%' }}>참여자 목록</h2>
                  </div>
                  <div className={styles.userListBox}>
                    {this.state.users.map((user, index) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '90%',
                            margin: '2%',
                          }}
                        >
                          <div style={{ textOverflow: 'ellipsis' }}>{user.userNickname}</div>
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
                    })}
                  </div>
                  <div className={styles.icon} onClick={this.clickMsg}>
                    <QuestionAnswerTwoToneIcon fontSize="large" />
                  </div>
                  <div className={styles.icon}>
                    <PeopleAltTwoToneIcon fontSize="large" />
                  </div>
                </div>
              </div>
            </div>

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

            <div className={styles.outIcon}>
              <div onClick={this.leaveSession}>
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
        )}
      </div>
    );
  }

  //createSession 응답이 오면 createToken을 실행하게 해서
  //token이 undefined인채로 getToken을 실행하는 일을 막아요
  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions`, data, {
          headers: {
            Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log('세션을 만들었어요');
          console.log(response);
          resolve(response.data.id);
        })
        .catch((response) => {
          let error = { ...response };
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
      let data = {};
      axios
        .post(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`, data, {
          headers: {
            Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoRoom);
