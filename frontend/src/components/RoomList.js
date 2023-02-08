import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Room.module.css";

const RoomList = (props) => {
  const id = props.room.roomId;
  const title = props.room.roomTitle;
  const content = props.room.roomContent;
  const keywords = props.room.roomKeyword;
  const limit = props.room.roomLimitUser;
  const password = props.room.roomPassword;
  const preset = props.room.roomPreset;
  const isPrivate = props.room.roomPrivate;
  // const recent = props.room.roomRecentUser;
  const recent = 1;
  const keywordList = props.keywordList;
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  function modalChange() {
    modal ? setModal(false) : setModal(true);
  }

  function goDetail() {
    if (isPrivate) {
      if (password === Number(inputPassword)) {
        navigate(`${id}`);
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } else {
      navigate(`${id}`);
    }
  }

  return (
    <div
      style={{
        margin: "5%",
        display: "flex",
        flexFlow: "wrap row",
        justifyContent: "center",
      }}
    >
      {modal && (
        <div className={styles.roomEnter}>
          <div className={styles.enterModal}>
            <h2>{title}</h2>
            <div className={styles.enterContent}>
              {content} {password}
            </div>
            {isPrivate && (
              <div
                style={{
                  margin: "30px",
                  marginBottom: "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <label style={{ marginRight: "30px", fontSize: "20px" }}>
                  비밀번호
                </label>
                <input
                  style={{
                    borderRadius: "10px",
                    paddingLeft: "5%",
                    border: "none",
                    height: "30px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  }}
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                />
              </div>
            )}
            <button onClick={goDetail} className={styles.btn}>
              입장하기
            </button>
            <button
              onClick={modalChange}
              className={styles.btn}
              style={{ backgroundColor: "#FF8D89" }}
            >
              취소하기
            </button>
          </div>
        </div>
      )}
      <div
        onClick={modalChange}
        className={styles[preset]}
        style={{
          cursor: "pointer",
          width: "90%",
          minHeight: "150px",
          position: "relative",
        }}
      >
        <h2>{title}</h2>
        {keywords.map((keyword, index) => (
          <span style={{ margin: "1%" }} key={index}>
            # {keywordList[keyword - 1].value}
          </span>
        ))}

        <p
          style={{
            position: "absolute",
            right: "5%",
            bottom: "5%",
          }}
        >
          {isPrivate && (
            <img className={styles.img} src="/자물쇠.png" alt="비공개" />
          )}{" "}
          &nbsp; {recent}/{limit ? limit : "인원제한"}
        </p>
      </div>
    </div>
  );
};

export default RoomList;
