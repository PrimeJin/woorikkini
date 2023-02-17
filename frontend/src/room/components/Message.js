import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './Message.module.css';

function Message(props) {
  // store에서 현재 로그인한 사용자의 nickname 가져오기
  const curUserNickname = useSelector((state) => state.user.nickname);
  const { text, userName } = props;

  const [me, setMe] = useState(false);
  const who = () => {
    if (userName === curUserNickname) {
      setMe(true);
    }
  };
  useEffect(() => {
    who();
  }, [text]);

  return (
    <>
      <div className={me ? styles.myMsg : styles.yourMsg}>
        <div className={me ? styles.myNick : styles.yourNick}>{userName}</div>
        <div className={me ? styles.myContext : styles.yourContext}>{text}</div>
      </div>
    </>
  );
}

export default Message;
