import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './UpdateCard.module.css';
import axios from 'axios';
import Modal from '../Modal';

function UpdateCard(props) {
  // 현재 로그인한 사용자의 닉네임
  const userId = useSelector((state) => state.user.id);

  // 부모 CardContainer에서 가져온 값들
  const currentCard = props.currentCard;
  const getCardList = props.getCardList;
  const modalOpen = props.modalOpen;
  const closeModal = props.closeModal;

  // 현재 수정할 내용들 변수 설정
  const [updateFileData, setUpdateFileData] = useState(currentCard.img);
  const [updateTitleData, setUpdateTitleData] = useState('');
  const [updateContentData, setUpdateContentData] = useState('');

  // 이미지 미리보기
  const imgRef = useRef();
  const [updatePreviewData, setUpdatePreviewData] = useState([]);

  // 수정하기 모달 창 열면 실행될 함수
  useEffect(() => {
    setUpdateTitleData(currentCard.title);
    setUpdateContentData(currentCard.content);
    setUpdatePreviewData(currentCard.img);
  }, [modalOpen]);

  // 기존의 이미지는 그대로 url로 보내고, 새로 넣은 이미지는 multipart로 보내기

  // 이미지 파일 입력
  const onFile = (event) => {
    // 이거 자체가 filelist
    const file = event.target.files;

    // 이미지 미리보기
    Array.from(file).forEach((img) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 이미지 띄울 수 있게 변경한 값 넣기
        const imageFile = reader.result;
        // 리스트에 추가하기
        setUpdatePreviewData([...updatePreviewData, imageFile]);
      };
      reader.readAsDataURL(img);
    });
    setUpdateFileData([...updateFileData, file]);
  };

  // 이미지 삭제
  const deleteImg = (id) => {
    // 미리보기에서 삭제
    setUpdatePreviewData(updatePreviewData.filter((img) => updatePreviewData.indexOf(img) !== id));
    // 보내줄 파일 리스트에서 삭제
    setUpdateFileData(updateFileData.filter((img) => updateFileData.indexOf(img) !== id));
    console.log('수정한 사진들', updateFileData);
  };

  // 제목 수정
  const onTitle = (event) => {
    const inputTitle = event.currentTarget.value;
    if (inputTitle.length > 20) {
      alert('최대 20자까지 입력이 가능합니다.');
    } else {
      setUpdateTitleData(inputTitle);
    }
  };
  // 내용 수정
  const onContent = (event) => {
    const inputContent = event.currentTarget.value;
    if (inputContent.length > 40) {
      alert('최대 40자까지 입력이 가능합니다.');
    } else {
      setUpdateContentData(inputContent);
    }
  };

  // 카드 내용 담을 변수
  interface cardData {
    userId: string;
    memoryTitle: string;
    memoryContent: string;
  }

  // 카드 내용 수정
  const memoryUpdate = (event) => {
    event.preventDefault();

    const formData = new FormData();
    console.log('새로 보낼 파일들 ->', updateFileData);

    // 기존 이미지 파일 넣을 리스트
    let originalFile = [];
    // 이미지 파일 중 기존 것과 추가된 것 나눠서 넣기
    Array.from(updateFileData).forEach((el) => {
      console.log('각각', el, typeof el);
      if (typeof el === 'object') {
        Array.from(el).forEach((img) => {
          formData.append('memoryImgFiles', img);
        });
      } else {
        originalFile.push(el);
      }
    });

    // 이미지 파일 + 카드 내용 합쳐서 보내기
    const newCardData: cardData = {
      userId: userId,
      memoryId: currentCard.id,
      memoryTitle: updateTitleData,
      memoryContent: updateContentData,
      photoPathList: originalFile,
    };
    formData.append('newCardData', new Blob([JSON.stringify(newCardData)], { type: 'application/json' }));
    console.log('수정한 추억', newCardData);

    // 서버로 전달
    axios
      .post('https://i8a804.p.ssafy.io/api/memory/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        console.log('성공!');
        alert('추억이 수정되었습니다.');
        getCardList();
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        alert('다시 시도해주시기 바랍니다.');
        setUpdateTitleData(currentCard.title);
        setUpdateContentData(currentCard.content);
        setUpdatePreviewData(currentCard.img);
        setUpdateFileData(currentCard.img);
        // formData 확인
        for (let key of formData.keys()) {
          console.log(key, ':', formData.get(key));
        }
      });
  };
  return (
    <React.Fragment>
      {/* //header 부분에 텍스트를 입력한다. */}
      <Modal open={modalOpen} close={closeModal} register={memoryUpdate} header="수정하기">
        {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다.  */}
        <form className={styles.memory} encType="multipart/form-data">
          <input
            type="file"
            multiple="multiple"
            accept="image/*"
            id="profileImg"
            onChange={onFile}
            ref={imgRef}
            style={{ justifyContent: 'center' }}
          />
          <div className={styles.photo}>
            {updatePreviewData.map((item, id) => {
              console.log('***', updatePreviewData);
              console.log('???', item);
              // 새로 넣은 이미지라면,
              if (item === undefined) {
                return (
                  <img
                    src={item}
                    style={{
                      width: '80px',
                      height: '120px',
                      position: 'relative',
                      float: 'left',
                      marginLeft: '10px',
                      marginTop: '3px',
                    }}
                    onClick={() => deleteImg(id)}
                  />
                );
              } else {
                return (
                  <img
                    src={item}
                    style={{
                      width: '80px',
                      height: '120px',
                      position: 'relative',
                      float: 'left',
                      marginLeft: '10px',
                      marginTop: '3px',
                    }}
                    onClick={() => deleteImg(id)}
                  />
                );
              }
            })}
          </div>
          <input
            value={updateTitleData}
            onChange={onTitle}
            style={{ width: 250, border: 'none', borderRadius: '10px', padding: '5%', marginBottom: '3%' }}
            placeholder="제목을 입력하세요."
          ></input>
          <br />
          <textarea
            value={updateContentData}
            onChange={onContent}
            style={{ width: 250, height: 50, border: 'none', borderRadius: '10px', padding: '5%', resize: 'none' }}
            placeholder="내용을 입력하세요."
          />
        </form>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateCard;
