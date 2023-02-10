import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Room.module.css';
import LockIcon from '@mui/icons-material/Lock';
import { useSelector } from 'react-redux';
const RoomCreate = (props) => {
  const cancel = props.cancel;
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const keywordList = props.keywordList;
  const [keywords, setKeywords] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const pwRegexs = /^[0-9]{4,10}$/;
  const [content, setContent] = useState('');
  const [limit, setLimit] = useState(2);
  const [preset, setPreset] = useState('preset1');
  const { accessToken } = useSelector((state) => state.token);

  const limitArr = [...new Array(9)].map((_, i) => i + 2);

  const [message, setMessage] = useState('');

  useEffect(() => {
    getMessage();
    if (title.length > 20) {
      alert('방 제목을 20자 이내로 입력해주세요');
      setTitle(title.slice(0, 20));
    } else if (content.length > 50) {
      alert('방 설명을 50자 이내로 입력해주세요');
      setContent(content.slice(0, 50));
    }
  }, [title, isPrivate, content]);

  function getMessage() {
    if (!title) {
      setMessage('방 제목을 입력해주세요');
    } else if (isPrivate && (!password.match(pwRegexs) || !password)) {
      setMessage('비밀번호를 확인해주세요');
    } else {
      setMessage(false);
    }
  }

  function goToRoom() {
    let index = [];
    keywords.map((keyword, idx) => index.push(Number(keyword.id)));

    message
      ? alert(message)
      : axios({
          url: 'https://i8a804.p.ssafy.io/api/room',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            authorization: `Bearer ${accessToken}`,
          },
          data: {
            roomTitle: title,
            roomContent: content,
            roomPrivate: isPrivate,
            roomPassword: password,
            roomLimitUser: Number(limit),
            roomKeywordList: index,
            roomPreset: preset,
          },
        })
          .then((res) => {
            navigate(`${res.data.result.roomId}`);
          })
          .catch((err) => {
            console.log('방 생성 정보 보내기 에러', err);
          });
  }

  function plusKeyword(e) {
    if (!keywords.some((element) => element.id === e.target.value)) {
      const plus = {
        id: e.target.value,
        value: keywordList[e.target.value - 1].keyword,
      };
      setKeywords(keywords.concat(plus));
    }
    e.target.value = 'none';
  }

  function remove(e) {
    setKeywords(keywords.filter((keyword) => keyword.id !== e.target.id));
  }

  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div className={styles.roomCreate}>
        <h2>방 만들기</h2>
        <div className={styles.항목}>
          <label className={styles.roomLabel}>방 제목</label>
          <span
            style={{
              color: 'red',
              marginRight: '3px',
            }}
          >
            *
          </span>
          <input
            required
            style={{ marginLeft: '0px' }}
            className={styles.createInput}
            type="text"
            value={title}
            placeholder="20자 이내로 입력하세요"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.항목} style={{ marginBottom: 0 }}>
          <label className={styles.roomLabel} style={{ width: '40%' }}>
            키워드
          </label>
          <div
            style={{
              justifyContent: 'left',
              display: 'flex',
              flexFlow: 'wrap',
              width: '100%',
            }}
          >
            <select style={{ width: '80%' }} className={styles.createSelect} onChange={plusKeyword}>
              <option value="none" selected disabled>
                키워드 종류
              </option>
              {keywordList.map((keyword, index) => (
                <option key={index} value={keyword.id}>
                  {keyword.keyword}
                </option>
              ))}
            </select>
            <sapn
              style={{
                color: 'red',
                fontSize: '10px',
                textAlign: 'left',
                marginLeft: '10px',
                width: '100%',
              }}
            >
              최대 3개 선택 가능
            </sapn>
            <div
              style={{
                display: 'flex',
                flexFlow: 'wrap row',
              }}
            >
              {keywords.map((keyword, index) => (
                <div className={styles.keyword}>
                  <sapn style={{ margin: '5px', fontSize: '12px' }}>
                    <span style={{ fontWeight: 800 }}>#</span> {keyword.value}
                    <span className={styles.x} key={index} id={keyword.id} onClick={remove}>
                      x
                    </span>
                  </sapn>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.항목}>
          <label className={styles.roomLabel}>공개여부</label>
          <input
            style={{ marginTop: 0 }}
            type="radio"
            name="private"
            defaultChecked={!isPrivate}
            onClick={(e) => e.target.checked && setIsPrivate(false)}
          />
          공개
          <input
            style={{ marginLeft: '40px', marginTop: 0 }}
            type="radio"
            name="private"
            onClick={(e) => e.target.checked && setIsPrivate(true)}
          />
          비공개
        </div>
        {isPrivate && (
          <div className={styles.항목}>
            <label className={styles.roomLabel}>비밀번호</label>{' '}
            <span
              style={{
                color: 'red',
                marginRight: '3px',
              }}
            >
              *
            </span>
            <div>
              <input
                style={{ marginLeft: '0px', width: '100%' }}
                className={styles.createInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                placeholder="숫자 4~10자리 입력"
              />
              <br />
              {password && !password.match(pwRegexs) && (
                <p
                  style={{
                    fontSize: '10px',
                    marginTop: '7px',
                    marginBottom: '0px',
                    textAlign: 'left',
                    color: 'red',
                  }}
                >
                  숫자로 4~10자리로 입력해주세요
                </p>
              )}
            </div>
          </div>
        )}

        <div className={styles.항목} style={{ marginTop: '1%' }}>
          <label className={styles.roomLabel}>방 설명</label>
          <textarea
            className={styles.createInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="50자 이내로 입력하세요"
            style={{ lineHeight: '30px', height: '200%', resize: 'none' }}
          />
        </div>
        <div className={styles.항목}>
          <label className={styles.roomLabel}>인원제한</label>
          <select className={styles.createSelect} value={limit} onChange={(e) => setLimit(e.target.value)}>
            {limitArr.map((limit, index) => (
              <option key={index} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.항목}>
          <label className={styles.roomLabel}>프리셋</label>
          <select className={styles.createSelect} value={preset} onChange={(e) => setPreset(e.target.value)}>
            <option value="preset1">프리셋 1</option>
            <option value="preset2">프리셋 2</option>
            <option value="preset3">프리셋 3</option>
            <option value="preset4">프리셋 4</option>
            <option value="preset5">프리셋 5</option>
          </select>
        </div>
        <div style={{ margin: '7%' }} className={styles[preset]}>
          {title ? <h3 style={{ marginInline: '3%' }}>{title}</h3> : <h3>방 제목</h3>}
          {!keywords[0] ? (
            <div># 키워드</div>
          ) : (
            keywords.map((keyword, index) => (
              <span style={{ margin: '1%' }} key={index}>
                # {keyword.value}
              </span>
            ))
          )}

          <p
            style={{
              justifyContent: 'right',
              marginRight: '3%',
              alignItems: 'cneter',
              display: 'flex',
            }}
          >
            {isPrivate && <LockIcon style={{ fontSize: '100%' }} />} &nbsp; 1/
            {limit}
          </p>
        </div>
        <button onClick={goToRoom} className={styles.roomCreateBtn}>
          방 만들기
        </button>
        <button onClick={cancel} className={styles.roomCreateBtn} style={{ background: '#FF8D89' }}>
          취소하기
        </button>
      </div>
    </div>
  );
};

export default RoomCreate;
