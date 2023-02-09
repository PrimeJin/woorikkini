import React, { Component } from 'react';

import axios from 'axios';
import UserVideoComponent from './UserVideoComponent';
import { OpenVidu } from 'openvidu-browser';

//style
import CenterLogo from '../styles/CenterLogo';
import styles from './VideoRoom.module.css';
import Messages from './components/Messages';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import ChatIcon from '@mui/icons-material/Chat';
import UserIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { SET_VOTE, RESET_VOTE } from '../store/Vote';
import { connect } from 'react-redux';

const OPENVIDU_SERVER_URL = 'https://i8a804.p.ssafy.io:8443'; //도커에 올린 openvidu server
const OPENVIDU_SERVER_SECRET = 'kkini'; //시크릿키값, 바꿔주면 좋음

const EncodeBase64 = (data) => {
  return Buffer.from(data).toString('base64');
};

//useSelector 선언할곳
// const dispatch = useDispatch();

//redux를 이용한 store에서 state와 reducer 가져오기
//this.props.authData 같은 식으로 사용 가능
const mapStateToProps = (state) => ({
  voteTotal: state.vote.total,
  voteAgree: state.vote.yes,
  voteDisagree: state.vote.no,
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
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
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
    };

    //method
    this.joinSession = this.joinSession.bind(this);
    this.closeSession = this.closeSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);

    //chat
    this.handleChangeChatMessage = this.handleChangeChatMessage.bind(this);
    this.sendMessageByClick = this.sendMessageByClick.bind(this);
    this.sendMessageByEnter = this.sendMessageByEnter.bind(this);
    this.chatToggle = this.chatToggle.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);

    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.getUserList = this.getUserList.bind(this);
    this.userList = this.userList.bind(this);
    this.listToggle = this.listToggle.bind(this);

    this.handleChange = this.handleChange.bind(this);

    //투표
    this.startVote = this.startVote.bind(this);
    this.showVoteModal = this.showVoteModal.bind(this);
    this.voteComplete = this.voteComplete.bind(this);
    this.agree = this.agree.bind(this);
    this.disagree = this.disagree.bind(this);
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
    // this.scrollToBottom();
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
        <Box sx={{ '& Button': { m: 0.5 } }}>
          <Stack direction="row" spacing={3}>
            <div>{user.clientData.split('"')[3]}</div>
            <Button value={index} variant="contained" color="error" size="small">
              신고
            </Button>
            <Button value={index} variant="contained" color="error" size="small" disabled>
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
  joinSession() {
    // --- 1) OpenVidu 객체 호출 ---
    this.OV = new OpenVidu();

    this.setState({ session: this.OV.initSession() }, () => {
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

        console.log('subscribers ' + this.subscribers); //등록 확인용
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
        console.log('투표 시작모달 띄우기');
        //event.data에 누구를 추방할지에 대한 정보
        //각 사용자에게 투표 모달창을 띄움
        console.log(event.data);
        this.setState({
          isVoteOn: true,
          eventData: event.data,
        });
        console.log(this.state.eventData);
      });

      //누군가가 투표버튼을 누르면 모든 사용자에게 event 송신
      this.state.session.on('signal:sendVote', (event) => {
        console.log('누군가 투표함');
        console.log(JSON.parse(event.data));
        this.setVoteUser(JSON.parse(event.data)); //store의 voteresult값을 1 늘려줌(store/vote.js 참고)

        //투표후 결과값을 받아와보자
        // console.log('투표 수: ', total, yes, no); //확인용
        setTimeout(() => {
          const total = this.props.voteTotal;
          const yes = this.props.voteAgree;
          const no = this.props.voteDisagree;
          const result = {
            who: '', //누굴 추방할지
            total: total, //전체 투표수
            yes: yes, //찬성 수
            no: no, //반대 수
          };
          console.log(this.props.voteTotal);
          console.log(this.props.voteAgree);
          console.log(this.props.voteDisagree);
          //모두 투표했을 경우 투표 종료
          if (total == this.state.subscribers.length + 1) {
            this.voteComplete(result);
            this.resetVoteUser(); //투표값 초기화
          }
        }, 1000);
      });

      // OpenVidu 환경에서 토큰 발급받기
      this.getToken().then((token) => {
        // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        this.state.session
          .connect(token, { clientData: this.state.myUserName })
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
              // this.getUserList();
              this.setState({
                // mainStreamManager: newPublisher,
                publisher: newPublisher,
              });
            });
          })
          .catch((error) => {
            console.log('세션연결 오류:', error.code, error.message);
          });
      });
    });
  }

  //투표시작 신호(강퇴버튼을 누르면 시작함)
  //추방할 사람
  startVote(voteWho) {
    this.resetVoteUser();
    const voteResult = {
      who: voteWho,
      total: this.props.voteTotal,
      yes: this.props.voteAgree,
      no: this.props.voteDisagree,
    };

    console.log('투표 시작: ');
    console.log(voteResult);
    this.state.session.signal({
      data: JSON.stringify(voteResult),
      to: [], //투표 당사자 제외해야하는거 아닌가?
      type: 'voteStart', //signal:voteStart로 연결
    });
  }

  setVoteUser = (data) => {
    this.props.setVote(data);
  };

  resetVoteUser = () => {
    this.props.resetVote();
  };

  //찬성표(유저 전체에게 신호가 감)
  agree(voteInfo) {
    voteInfo.total += 1;
    voteInfo.yes += 1;
    this.state.session.signal({
      data: JSON.stringify(voteInfo),
      to: [],
      type: 'sendVote',
    });
    this.setState({
      isVoteOn: false,
    });
  }

  //반대표(유저 전체에게 신호가 감)
  disagree(voteInfo) {
    voteInfo.total += 1;
    voteInfo.no += 1;
    this.state.session.signal({
      data: JSON.stringify(voteInfo),
      to: [],
      type: 'sendVote',
    });
    this.setState({
      isVoteOn: false,
    });
  }
  //참여자 모두에게 보낼 추방투표 모달
  showVoteModal(data) {
    //voteInfo(누굴 추방할지)에 대한 투표모달창을 띄움
    const voteInfo = JSON.parse(data);
    console.log('모달 띄움');
    console.log(voteInfo);

    return (
      <div>
        <header>투표하기</header>
        <main>
          <div>{voteInfo.voteWho}님의 강제 퇴장을 찬성하시나요?</div>
          <p>이 창은 30초 후 자동으로 닫힙니다.</p>
        </main>
        <footer>
          <button value="Yes" className={styles.ok_btn} onClick={() => this.agree(voteInfo)}>
            찬성
          </button>
          <div style={{ width: 30 }}></div>
          <button value="No" className={styles.close_bottom} onClick={() => this.disagree(voteInfo)}>
            반대
          </button>
        </footer>
      </div>
    );

    // this.state.session
    //   .signal({
    //     data: voteInfo,
    //     to: [],
    //     type: 'sendVote',
    //   })
    //   .then(() => {
    //     console.log('투표 완료!');
    //   })
    //   .catch((error) => console.log('투표 결과 전송오류'));
  }

  //투표 결과 집계
  voteComplete(result) {
    //과반수 이상이 찬성
    if (result.yes / result.total >= 0.5) {
      //백엔드 및 openvidu 서버에 추방 요청을 보냄
      alert(`${result.who}님이 추방되었습니다`);
    } else {
      alert(`추방 투표가 부결되었습니다`);
    }
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
    window.location.reload();
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
        window.location.reload();
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

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <CenterLogo />
          <h2 id="session-title">{mySessionId}</h2>
        </div>
        {/** 세션이 없을 경우 띄우는 화면
         * RoomList.js가 여기를 대체할 수 있도록 하기
         */}

        {this.state.session === undefined ? (
          <div className={styles.omain}>
            <div className={styles.obody}>
              <div id="join">
                <div id="join-dialog" className="jumbotron vertical-center">
                  <form className={styles.form_group} onSubmit={this.joinSession}>
                    <p>
                      <label>참가자명: </label>
                      <input
                        className="form-control"
                        type="text"
                        id="userName"
                        value={myUserName}
                        onChange={this.handleChangeUserName}
                        required
                      />
                    </p>
                    <p>
                      <label> 세션명: </label>
                      <input
                        className="form-control"
                        type="text"
                        id="sessionId"
                        value={mySessionId}
                        onChange={this.handleChangeSessionId}
                        required
                      />
                    </p>
                    <p className="text-center">
                      <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.main}>
            <div className={styles.body}>
              <div id="video-container" className={`${styles.videobox} ${'col-md-9'}`}>
                <button onClick={() => this.startVote('추방할 사람')}>투표 시작</button>
                {this.state.isVoteOn ? this.showVoteModal(this.state.eventData) : null}
                {this.state.publisher !== undefined ? (
                  <div
                    className="stream-container col-md-6 col-xs-6"
                    onClick={() => this.handleMainVideoStream(this.state.publisher)}
                  >
                    <UserVideoComponent streamManager={this.state.publisher} />
                  </div>
                ) : null}
                {this.state.subscribers.map((sub, i) => (
                  <div
                    key={i}
                    className="stream-container col-md-6 col-xs-6"
                    onClick={() => this.handleMainVideoStream(sub)}
                  >
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.sidebar}>
              <TabContext value={this.state.value} sx={{ background: '#ffd4c3' }}>
                <TabPanel value="1" sx={{ background: '#ffd4c3' }}>
                  <div className={`${styles.chatWrapper} ${styles.chatbox__active}`}>
                    <div className={styles.chatHeader}>
                      <h2>채팅</h2>
                    </div>
                    <div className={styles.chatLogBox}>
                      <Messages messages={messages} />
                      <div ref={this.messagesEndRef} />
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
                        보내기
                      </button>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="2" sx={{ background: '#ffd4c3' }}>
                  <div className={`${styles.chatWrapper} ${styles.chatbox__active}`}>
                    <div className={styles.chatHeader}>
                      <h2>참여자 목록</h2>
                    </div>

                    <div className={styles.userListBox}>
                      {this.userList(this.state.users)}
                      {/* <div ref={this.messagesEndRef} /> */}
                    </div>
                  </div>
                </TabPanel>
                <TabList
                  onChange={this.handleChange}
                  aria-label="icon label tabs example"
                  sx={{ background: '#ffd4c3' }}
                >
                  <Tab icon={<ChatIcon />} label="채팅" value="1" sx={{ background: '#ffd4c3' }} />
                  <Tab icon={<UserIcon />} label="참여자목록" value="2" sx={{ background: '#ffd4c3' }} />
                  <Tab icon={<CancelIcon />} label="퇴장" onClick={this.leaveSession} sx={{ background: '#ffd4c3' }} />
                </TabList>
              </TabContext>
            </div>
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
          resolve(response.data.id);
        })
        .catch((response) => {
          let error = { ...response };
          if (error.response) {
            if (error.response.status === 409) {
              resolve(sessionId);
              console.log('이미 있는 세션입니다');
            } else if (
              window.confirm(
                `OpenVidu 서버와 연결되지 않았습니다. 인증서 오류 일 수도 있습니다. "${OPENVIDU_SERVER_URL}을"\n\n 확인해주세요.` +
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
          });
        })
        .catch((error) => reject(error));
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoRoom);
