import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { useRef } from 'react';

import UserVideoComponent from '../room/UserVideoComponent';

// modal
import ReportModal from '../room/components/ReportModal';

//style
import CenterLogo from '../styles/CenterLogo';
import styles from '../room/VideoRoom.module.css';
import Messages from '../room/components/Messages';
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

import Timer from '../room/components/Timer';
import Room from '../components/Room';

import {
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
} from '../store/openvidu';
import { START_VOTE, AGREE_VOTE, DISAGREE_VOTE, SET_VOTE, RESET_VOTE } from '../store/Vote';

const OPENVIDU_SERVER_URL = 'https://i8a804.p.ssafy.io:8443'; //도커에 올린 openvidu server
const OPENVIDU_SERVER_SECRET = 'kkini'; //시크릿키값, 바꿔주면 좋음

const EncodeBase64 = (data) => {
  return Buffer.from(data).toString('base64');
};

const RoomDetail = () => {
  const [tab, setTab] = useState('1');
  const params = useParams();
  const roomId = params.roomId;
  const [OV, setOV] = useState(undefined);
  const [session, setSession] = useState(undefined);

  const OVState = useSelector((state) => state.openvidu);
  const token = useSelector((state) => state.openvidu.ovtoken);
  const ltoken = localStorage.getItem('token');
  const vote = useSelector((state) => state.vote);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  function getDetail() {
    const newOV = new OpenVidu();
    newOV.enableProdMode();
    const newSession = newOV.initSession();
    setOV(newOV);
    setSession(newSession);

    axios({
      url: `https://i8a804.p.ssafy.io/api/room/${roomId}`,
      methods: 'GET',
    })
      .then(() => {
        newSession
          .connect(ltoken, { userId: user.id, userNickname: user.nickname })
          .then(async (res) => {
            console.log(res);

            newOV
              .getUserMedia({
                audioSource: false,
                videoSource: undefined,
                resolution: '640x480',
                frameRate: 30,
              })
              .then((mediaStream) => {
                const videoTrack = mediaStream.getVideoTracks()[0];

                //stream 게시(화면 출력)
                const newPublisher = newOV.initPublisher(OVState.myUserName, {
                  audioSource: undefined,
                  videoSource: videoTrack,
                  publishAudio: true,
                  publishVideo: true,
                  insertMode: 'APPEND',
                  mirror: true, //좌우반전 옵션
                });
                newSession.publish(newPublisher);
                getUserList();
                dispatch(SET_PUBLISHER(newPublisher));
              });
          })
          .catch((error) => {
            console.log('세션연결 오류:', error.code, error.message);
          });

        //관심있는 세션 이벤트 구독(subscribe)
        newSession.on('streamCreated', (event) => {
          const newSubscriber = OVState.session.subscribe(
            event.stream,
            JSON.parse(event.stream.connection.data).clientData,
          );
          const newSubscribers = OVState.subscribers;
          newSubscribers.push(newSubscriber);

          dispatch(SET_SUBSCRIBERS(newSubscribers));
          getUserList();
        });

        newSession.on('signal:chat', (event) => {
          const chatdata = event.data.split(','); //위에서 송신한 `${this.state.myUserName}, ${this.state.message}`를 분리

          if (chatdata[0] !== OVState.myUserName) {
            const data = { userName: chatdata[0], text: chatdata[1], chatClass: 'messages__item--visitor' };

            dispatch(SET_MESSAGES(data));
          }
        });

        //사용자가 화상회의를 떠나면 Session객체에서 소멸된 stream을 받아와
        //subscribers 상태값 업데이트
        newSession.on('streamDestroyed', (event) => {
          deleteSubscriber(event.stream.streamManager);
          getUserList(); //참여자 목록 갱신
        });

        //투표 시작 signal 받기
        newSession.on('signal:voteStart', (event) => {
          //투표창 모달 띄우기
          dispatch(START_VOTE(event.data));
        });

        //누군가가 투표버튼을 누르면 모든 사용자에게 event 송신
        newSession.on('signal:sendVote', (event) => {
          dispatch(SET_VOTE(JSON.parse(event.data)));

          //변경된 state값을 바로 받아오지 못하므로 setTimeout
          setTimeout(() => {
            const data = {
              isVoteStart: false, //투표가 시작했는지
              voteUserId: vote.voteUserId, //투표한 유저 id
              voteUserNickname: vote.voteUserNickname, //투표한 유저 닉네임
              total: vote.total, //전체 투표수
              agree: vote.agree, //찬성 수
              disagree: vote.disagree, //반대 수
            };

            //모두 투표했을 경우 투표 종료
            if (vote.total == OVState.subscribers.length + 1) {
              endVote(data);
              dispatch(RESET_VOTE()); //투표값 초기화
            }
          }, 1000);
        });
      })
      .catch((err) => {
        console.log(err, '방 디테일 에러');
      });
  }

  //startVote 신호 발생
  function startVote(voteWho) {
    const userId = voteWho.split(',')[0].split(':')[1];
    const userNickname = voteWho.split(',')[1].split(':')[1].split('"')[1];
    const voteResult = {
      userId: userId,
      userNickname: userNickname,
    };

    const newSession = session;
    // console.log('투표 시작: ');
    // console.log(voteResult);
    newSession.signal({
      data: JSON.stringify(voteResult),
      to: [], //투표 당사자 제외해야하는거 아닌가?
      type: 'voteStart', //signal:voteStart로 연결
    });
  }

  //찬성표(유저 전체에게 신호가 감)
  function agreeVote() {
    dispatch(AGREE_VOTE());

    const data = {
      isVoteStart: vote.isVoteStart, //투표가 시작했는지
      voteUserId: vote.voteUserId, //투표한 유저 id
      voteUserNickname: vote.voteUserNickname, //투표한 유저 닉네임
      total: vote.total, //전체 투표수
      agree: vote.agree, //찬성 수
      disagree: vote.disagree, //반대 수
    };

    const newSession = session;
    newSession.signal({
      data: JSON.stringify(data),
      to: [],
      type: 'sendVote',
    });
  }

  function disagreeVote() {
    dispatch(DISAGREE_VOTE());

    const data = {
      isVoteStart: vote.isVoteStart, //투표가 시작했는지
      voteUserId: vote.voteUserId, //투표한 유저 id
      voteUserNickname: vote.voteUserNickname, //투표한 유저 닉네임
      total: vote.total, //전체 투표수
      agree: vote.agree, //찬성 수
      disagree: vote.disagree, //반대 수
    };

    const newSession = session;
    newSession.signal({
      data: JSON.stringify(data),
      to: [],
      type: 'sendVote',
    });
  }

  function endVote(result) {
    //과반수 이상이 찬성
    console.log('찬성 : ' + result.agree);
    console.log('전체 : ' + result.total);
    console.log('누구 : ' + result.userNickname);
    if (result.agree / result.total >= 0.5) {
      //백엔드 및 openvidu 서버에 추방 요청을 보냄
      // axios({
      //   url: `https://i8a804.p.ssafy.io/api/room/exit/${OVState.sessionId}/${result.userId}`,
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json; charset=UTF-8',
      //     authorization: `Bearer ${this.props.accessToken}`,
      //   },
      // })
      //   .then(() => {
      //     alert(`${result.userNickname}님이 추방되었습니다`);
      //   })
      //   .catch((err) => console.log(err));
      alert(`${result.userNickname}님이 추방되었습니다`);
    } else {
      alert(`추방 투표가 부결되었습니다`);
    }

    //백엔드에 결과 전송 후 퇴장처리
  }

  //세션에 참여하기 위한 토큰 만들기
  function createToken(sessionId) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
          {},
          {
            headers: {
              Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => {
          resolve(response.data.token);
          dispatch(SET_OVTOKEN(response.data.token));
        })
        .catch((error) => reject(error));
    });
  }

  useEffect(() => {
    getDetail();
  }, []);

  function goOut() {
    navigate('/room');
  }

  // 모달 관련 함수들
  function openModal(e) {
    if (e.target.name === 'report') {
      dispatch(SET_REPORTMODAL(e.target.value));
    } else if (e.target.name === 'vote') {
      dispatch(SET_VOTEMODAL());
    }
  }

  function closeModal(e) {
    if (e == 'close' || e.target.value === 'No') {
      dispatch(SET_REPORTMODAL());
    }
  }

  //메소드

  //방 이름 폼에 적으면 반영
  // function handleChangeSessionId(e) {
  //   this.setState({
  //     mySessionId: e.target.value,
  //   });
  // }

  //유저 닉네임 폼에 적으면 반영(쓸일 없음)
  // function handleChangeUserName(e) {
  //   dispatch(SET_USERNAME(e.target.value));
  // }

  //chat input form 반영
  function handleChangeChatMessage(e) {
    dispatch(SET_MESSAGE(e.target.value));
  }

  //클릭해서 채팅보내기
  function sendMessageByClick() {
    const data = { userName: OVState.myUserName, text: OVState.message, chatClass: 'messages__item--operator' };
    dispatch(SET_MESSAGES(data));

    session
      .signal({
        data: `${OVState.myUserName},${OVState.message}`, //signal의 실질적 메시지
        to: [], //Session.on('signal')을 subscribe한 참여자들에게 전달됨. []거나 undefined일 경우, 전체 참여자에게 전달됨
        type: 'chat', //signal 타입. Session.on('signal:type') 이벤트를 subscribe한 참여자들에게 전달
      })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
    scrollToBottom();
    //message창 초기화
    dispatch(SET_MESSAGE(''));
  }

  //엔터쳐서 채팅보내기
  function sendMessageByEnter(e) {
    if (e.key === 'Enter') {
      const data = {
        userName: OVState.myUserName,
        text: OVState.message,
        chatClass: 'messages__item--operator',
      };
      dispatch(SET_MESSAGES(data));

      session
        .signal({
          data: `${OVState.myUserName},${OVState.message}`, //signal의 실질적 메시지
          to: [], //Session.on('signal')을 subscribe한 참여자들에게 전달됨. []거나 undefined일 경우, 전체 참여자에게 전달됨
          type: 'chat', //signal 타입. Session.on('signal:type') 이벤트를 subscribe한 참여자들에게 전달
        })
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
      scrollToBottom();
      //message창 초기화
      dispatch(SET_MESSAGE(''));
    }
  }

  //선택한 화면(stream)을 메인으로 띄우기
  // function handleMainVideoStream(stream) {
  //   if (OVState.mainStreamManager !== stream) {
  //     this.setState({
  //       mainStreamManager: stream,
  //     });
  //   }
  // }

  function deleteSubscriber(streamManager) {
    const subscribers = OVState.subscribers;
    const index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      dispatch(SET_SUBSCRIBERS(subscribers));
    }
  }

  //userList 호출
  function getUserList() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `${'https://i8a804.p.ssafy.io:8443/openvidu/api/sessions/'}${OVState.sessionTitle}/connection`,
        headers: {
          Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
        },
      })
        .then((response) => {
          let content = response.data.content;
          content.sort((a, b) => a.createdAt - b.createdAt); //들어온 순서대로 정리
          dispatch(SET_USERS(content));
        })
        .catch((error) => reject(error));
    });
  }

  //참여자 리스트 리턴
  function userList(users) {
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
              onClick={openModal}
            >
              신고
            </Button>
            <Button
              // onClick={() => this.startVote(user.clientData.split(',')[1].split(':')[1].split('"')[1])}
              onClick={() => startVote(user.clientData)}
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

  function listToggle() {
    getUserList(); //추가로 유저가 들어왔다 나갈때도 자동으로 갱신될 수 있게
    dispatch(SET_ISLIST());
  }

  //채팅창 팝업 열고 닫기
  function chatToggle() {
    dispatch(SET_ISCHAT());
  }

  //채팅, 리스트 전환용 토글
  function handleChange(event, newValue) {
    setTab(newValue);
  }

  //투표시작 신호(강퇴버튼을 누르면 시작함)
  //추방할 사람
  function startVote(voteWho) {
    const userId = voteWho.split(',')[0].split(':')[1];
    const userNickname = voteWho.split(',')[1].split(':')[1].split('"')[1];
    const voteResult = {
      userId: userId,
      userNickname: userNickname,
    };

    const newSession = session;
    // console.log('투표 시작: ');
    // console.log(voteResult);
    newSession.signal({
      data: JSON.stringify(voteResult),
      to: [], //투표 당사자 제외해야하는거 아닌가?
      type: 'voteStart', //signal:voteStart로 연결
    });
  }

  //참여자 모두에게 보낼 추방투표 모달
  function showVoteModal(data) {
    //voteInfo(누굴 추방할지)에 대한 투표모달창을 띄움
    const voteInfo = JSON.parse(data);
    // console.log('모달 띄움');
    // console.log(voteInfo);

    return (
      <div className={OVState.isVoteOn ? `${styles.modal} ${styles.openModal}` : styles.modal}>
        <section>
          <header>투표하기</header>
          <main>{voteInfo.userNickname}님의 강제 퇴장을 찬성하시나요?</main>
          <p>이 창은 30초 후 자동으로 닫힙니다.</p>
          <Timer onComplete={() => disagreeVote(voteInfo)} />
          <footer>
            <Button
              value="agree"
              className={styles.ok_btn}
              onClick={() => agreeVote(voteInfo)}
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
              onClick={() => disagreeVote(voteInfo)}
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

  //방 퇴장(혼자만, 세션은 그대로 있어야함)
  function leaveSession() {
    session.disconnect();
    dispatch(LEAVE_SESSION());
    goOut();
  }

  //세션 닫기(세션의 모든 참가자 퇴장)
  function closeSession() {
    //백엔드에 퇴장 요청 보내기
    axios
      .delete(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${OVState.sessionId}`, {
        headers: {
          Authorization: `Basic ${EncodeBase64(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        // //모든 속성(프로퍼티) 초기화
        dispatch(LEAVE_SESSION());
        goOut();
      });
  }

  //채팅창 스크롤 자동으로 내려주는 기능
  function scrollToBottom() {
    //componentDidUpdate() 생명주기는 수시로 호출되기 때문에
    //호출될 때마다 messagesEndRef.current가 없을 수도 있으므로 체크해줘야 한다
    //안그러면 TypeError: Cannot read property 'scrollIntoView' of null가 표시될 수 있음
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div>
      <div className={styles.inmain}>
        <div className={styles.inbody}>
          <div id="video-container" className={`${styles.videobox} ${'col-md-12 col-xs-12'}`}>
            {OVState.isVoteOn ? showVoteModal(OVState.eventData) : null}
            {OVState.publisher !== undefined ? (
              <div className="stream-container col-md-4 col-xs-4">
                <UserVideoComponent streamManager={OVState.publisher} />
              </div>
            ) : null}
            {OVState.subscribers.map((sub, i) => (
              <div key={i} className="stream-container col-md-4 col-xs-4">
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.sidebar}>
          <TabContext value={tab} sx={{ background: '#ffd4c3' }}>
            <TabPanel value="1" sx={{ background: '#ffd4c3' }}>
              <div className={`${styles.chatWrapper} ${styles.chatbox__active}`}>
                <div className={styles.chatHeader}>
                  <h2>채팅</h2>
                </div>
                <div className={styles.chatLogBox}>
                  <Messages messages={OVState.messages} />
                  <div ref={messagesEndRef} />
                </div>

                <div className={styles.chatFooter}>
                  <input
                    id={styles.chatInputForm}
                    type="text"
                    placeholder="메시지를 입력하세요"
                    onChange={handleChangeChatMessage}
                    onKeyPress={sendMessageByEnter}
                    value={OVState.message}
                  />
                  <button className={styles.chatSendButton} onClick={sendMessageByClick}>
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

                <div className={styles.userListBox}>{userList(OVState.users)}</div>
              </div>
            </TabPanel>
            <TabPanel value="3" sx={{ background: '#ffd4c3' }}></TabPanel>
            <TabList onChange={handleChange} aria-label="icon label tabs example" sx={{ background: '#ffd4c3' }}>
              <Tab icon={<ChatIcon />} label="채팅" value="1" sx={{ background: '#ffd4c3' }} />
              <Tab icon={<UserIcon />} label="참여자목록" value="2" sx={{ background: '#ffd4c3' }} />
              <Tab
                icon={<CancelIcon />}
                label="퇴장"
                value="3"
                onClick={() => leaveSession}
                sx={{ background: '#ffd4c3' }}
              />
            </TabList>
          </TabContext>
          {OVState.reportModalOpen ? (
            <ReportModal
              reportModalOpen={OVState.reportModalOpen}
              closeModal={OVState.closeModal}
              currentUserId={OVState.currentUserId}
              reportedUserId={OVState.reportedUserId}
            ></ReportModal>
          ) : (
            <div style={{ display: 'none' }}></div>
          )}
        </div>
      </div>
      <button onClick={goOut}>나가기</button>
    </div>
  );
};

export default RoomDetail;
