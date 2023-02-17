import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomList from './RoomList';
import RoomCreate from './RoomCreate';
import styles from './Room.module.css';
import Refresh from '@mui/icons-material/ReplayCircleFilledOutlined';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import PageLogo from './PageLogo';
import NoticeIcon from './NoticeIcon';

const Room = () => {
  const [list, setList] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [fullCheck, setFullCheck] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [sort, setSort] = useState('');
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(true);
  const [searchStatus, setSearchStatus] = useState(false);
  const [keywordList, setKeywordList] = useState([]);
  const navigate = useNavigate();

  function getKeywordList() {
    axios({
      url: 'https://i8a804.p.ssafy.io/api/room/keyword',
      method: 'GET',
    })
      .then((res) => {
        setKeywordList(res.data.result);
      })
      .catch((err) => {
        console.log('getKeywordList에러', err);
      });
  }

  function getList() {
    axios({
      url: 'https://i8a804.p.ssafy.io/api/room',
      methods: 'GET',
    })
      .then((res) => {
        setList(res.data.result);
        setFiltered(res.data.result);
      })
      .catch((err) => {
        if (err.response.data.message === 'fail') {
          alert('로그인이 필요한 서비스입니다.');
          navigate('/user/login');
        } else {
          alert('유효하지 않은 요청입니다.');
          console.log(err, '방 목록 에러');
        }
      });
  }

  useEffect(() => {
    getKeywordList();
    getList();
  }, []);

  function sorting(e) {
    const value = e.target.value;
    if (value === 'old') {
      list.sort((a, b) => a.roomId - b.roomId);
      setSort(1);
    } else if (value === 'new') {
      list.sort((a, b) => b.roomId - a.roomId);
      setSort(2);
    } else if (value === 'numHigh') {
      list.sort((a, b) => b.roomRecentUser - a.roomRecentUser);
      setSort(3);
    } else if (value === 'numLow') {
      list.sort((a, b) => a.roomRecentUser - b.roomRecentUser);
      setSort(4);
    }
  }

  function goSearch() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/room/search?subject=title&content=${search}`,
      method: 'GET',
      data: {
        subject: 'title',
        content: search,
      },
    }).then((res) => {
      setList(res.data.result);
      setFiltered(res.data.result);
      searchStatus ? setSearchStatus(false) : setSearchStatus(true);
    });
  }

  useEffect(() => {
    fullCheck
      ? isPrivate
        ? setFiltered(
            list.filter(
              (room) =>
                room.roomLimitUser > room.roomRecentUser &&
                JSON.parse(room.roomPrivate) === false &&
                room.roomRecentUser === 0,
            ),
          )
        : setFiltered(list.filter((room) => room.roomLimitUser > room.roomRecentUser))
      : isPrivate
      ? setFiltered(list.filter((room) => JSON.parse(room.roomPrivate) === false))
      : setFiltered(list);
  }, [isPrivate, fullCheck, sort, searchStatus]);

  function openModal() {
    setModal(true);
  }

  function cancel() {
    modal && setModal(false);
  }

  function searchChange() {
    isSearch ? setIsSearch(false) : setIsSearch(true);
  }

  function keywordSearch(e) {
    axios({
      url: `https://i8a804.p.ssafy.io/api/room/search?subject=keyword&content=${e.target.value}`,
      method: 'GET',
      data: {
        subject: 'keyword',
        content: e.target.value,
      },
    }).then((res) => {
      setList(res.data.result);
      setFiltered(res.data.result);
      searchStatus ? setSearchStatus(false) : setSearchStatus(true);
    });
  }

  function refresh() {
    window.location.reload();
  }

  return (
    <div>
      <PageLogo />
      <Navbar />
      {modal && (
        <div className={styles.roomEnter}>
          <RoomCreate cancel={cancel} keywordList={keywordList} />
        </div>
      )}
      <div>
        <h1 style={{ fontSize: '50px' }}>방 목록</h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginInline: '20%',
            alignItems: 'center',
          }}
        >
          <select
            onChange={sorting}
            style={{
              textAlign: 'center',
              background: '#EB6123',
              borderRadius: '10px',
              width: '130px',
              height: '40px',
              border: 'none',
              color: 'white',
              fontWeight: '600',
            }}
          >
            <option style={{ backgroundColor: 'white', color: 'black' }} value="old">
              오래된 순
            </option>
            <option style={{ backgroundColor: 'white', color: 'black' }} value="new">
              최신순
            </option>
            <option style={{ backgroundColor: 'white', color: 'black' }} value="numHigh">
              참여 인원 많은 순
            </option>
            <option style={{ backgroundColor: 'white', color: 'black' }} value="numLow">
              참여 인원 적은 순
            </option>
          </select>
          <div style={{ display: 'flex' }}>
            <select
              onChange={searchChange}
              style={{
                width: '80px',
                height: '40px',
                border: '0.5px solid #EB6123',
                borderRadius: '50px',
                textAlign: 'center',
                marginInline: '10px',
                fontWeight: '600',
              }}
            >
              <option>제목</option>
              <option>키워드</option>
            </select>
            {isSearch ? (
              <div style={{ position: 'relative' }}>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                  onKeyDown={(e) => e.key === 'Enter' && goSearch()}
                />
                <button className={styles.searchBtn} onClick={goSearch}>
                  검색
                </button>
              </div>
            ) : (
              <div>
                <select
                  onChange={keywordSearch}
                  style={{
                    border: '0.5px solid #eb6123',
                    width: '400px',
                    height: '40px',
                    textAlign: 'center',
                    borderRadius: '50px',
                  }}
                >
                  <option disabled selected>
                    키워드 종류
                  </option>
                  {keywordList.map((keyword, index) => (
                    <option key={index} value={keyword.keyword}>
                      {keyword.keyword}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button onClick={openModal} className={styles.createBtn}>
            방 만들기
          </button>
        </div>
        <br />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <label className={styles.filterLabel}>
            {' '}
            <input
              type="checkbox"
              onChange={(e) => (e.target.checked ? setFullCheck(true) : setFullCheck(false))}
              style={{
                margin: '10px',
                accentColor: '#eb6123',
              }}
            />
            입장 가능한 방만 보기
          </label>

          <label className={styles.filterLabel}>
            <input
              type="checkbox"
              name="isPrivate"
              onChange={(e) => (e.target.checked ? setIsPrivate(true) : setIsPrivate(false))}
              style={{
                margin: '10px',
                accentColor: '#eb6123',
              }}
            />
            공개방만 보기
          </label>
          <Refresh style={{ marginLeft: '2%', cursor: 'pointer', color: '#eb6123' }} onClick={refresh} />
        </div>
        <div
          style={{
            maxHeight: '490px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            margin: '1%',
          }}
          className={styles.scroll}
        >
          {filtered.map((room, index) => (
            <RoomList key={index} room={room} keywordList={keywordList} />
          ))}
        </div>
      </div>
      <NoticeIcon />
    </div>
  );
};

export default Room;
