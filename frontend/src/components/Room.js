import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomList from './RoomList';
import RoomCreate from './RoomCreate';
import styles from './Room.module.css';

const Room = () => {
  const [list, setList] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [sort, setSort] = useState('');
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(true);

  const keywordList = [
    {
      id: 1,
      value: '식단',
    },
    {
      id: 2,
      value: '다이어트',
    },
    {
      id: 3,
      value: '건강',
    },
  ];

  function getList() {
    axios({
      url: 'https://my-json-server.typicode.com/yjw9397/demo/room',
      // url: "https://i8a804.p.ssafy.io/api/room",
      methods: 'GET',
    })
      .then((res) => {
        // setList(res.data.result);
        // setFiltered(res.data.result);
        setList(res.data);
        setFiltered(res.data);
      })
      .catch((err) => {
        console.log(err, '방 목록 에러');
      });
  }

  useEffect(() => {
    getList();
    // console.log(filtered);
  }, []);

  function sorting(e) {
    const value = e.target.value;
    if (value === 'old') {
      list.sort((a, b) => a.id - b.id);
      setSort(1);
    } else if (value === 'new') {
      list.sort((a, b) => b.id - a.id);
      setSort(2);
    } else if (value === 'numHigh') {
      list.sort((a, b) => (b.roomLimitUser < a.roomLimitUser ? -1 : 1));
      setSort(3);
    } else if (value === 'numLow') {
      list.sort((a, b) => (b.roomLimitUser < a.roomLimitUser ? 1 : -1));
      setSort(4);
    }
  }

  function goSearch(e) {
    axios({
      url: `https://i8a804.p.ssafy.io/api/room/search?subject=title&content=${e.target.name}`,
      method: 'GET',
      data: {
        subject: 'title',
        content: e.target.name,
      },
    }).then((res) => {
      console.log(res);
      setList(res.data);
      setFiltered(res.data);
    });
  }

  useEffect(() => {
    isFull
      ? isPrivate
        ? setFiltered(list.filter((room) => room.roomLimitUser > 5 && room.roomPrivate === false))
        : setFiltered(list.filter((room) => room.roomLimitUser > 5))
      : isPrivate
      ? setFiltered(list.filter((room) => room.roomPrivate === false))
      : setFiltered(list);
  }, [isPrivate, isFull, sort]);

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
      console.log(res);
      setList(res.data);
      setFiltered(res.data);
    });
  }

  return (
    <div>
      {modal && (
        <div className={styles.roomEnter}>
          <RoomCreate cancel={cancel} keywordList={keywordList} />
        </div>
      )}
      <div onClick={cancel}>
        <h1 style={{ marginTop: 0, paddingTop: '2%', fontWeight: '900' }}>방 목록</h1>
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
              오래된순
            </option>
            <option style={{ backgroundColor: 'white', color: 'black' }} value="new">
              최신순
            </option>
            <option style={{ backgroundColor: 'white', color: 'black' }} value="numHigh">
              참여인원많은순
            </option>
            <option style={{ backgroundColor: 'white', color: 'black' }} value="numLow">
              참여인원적은순
            </option>
          </select>
          <div style={{ display: 'flex' }}>
            <select
              onChange={searchChange}
              style={{
                width: '80px',
                height: '40px',
                background: '#FFFFFF',
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
                />
                <button className={styles.searchBtn} name={search} onClick={goSearch}>
                  검색
                </button>
              </div>
            ) : (
              <div>
                <select onChange={keywordSearch}>
                  {keywordList.map((keyword, index) => (
                    <option key={index} value={keyword.id}>
                      {keyword.value}
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginInline: '10px',
            }}
          >
            <input
              type="checkbox"
              onChange={(e) => (e.target.checked ? setIsFull(true) : setIsFull(false))}
              style={{ margin: '10px' }}
            />
            <span style={{ fontSize: '18px', fontWeight: '600' }}>입장 가능한 방만 보기</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginInline: '10px',
            }}
          >
            <input
              type="checkbox"
              name="isPrivate"
              onChange={(e) => (e.target.checked ? setIsPrivate(true) : setIsPrivate(false))}
              style={{ margin: '10px' }}
            />
            <span style={{ fontSize: '18px', fontWeight: '600' }}>공개방만 보기</span>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            marginInline: '3%',
          }}
        >
          {filtered.map((room, index) => (
            <RoomList key={index} room={room} keywordList={keywordList} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Room;
