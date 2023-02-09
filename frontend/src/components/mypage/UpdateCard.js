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
  const [updateTitleData, setUpdateTitleData] = useState(currentCard.title);
  const [updateContentData, setUpdateContentData] = useState(currentCard.content);
  // 이미지 미리보기
  const imgRef = useRef();
  const [updatePreviewData, setUpdatePreviewData] = useState();

  // useEffect(() => {
  //   updateFileData.map((img, id) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(img);
  //     reader.onloadend = () => {
  //       // 이미지 띄울 수 있게 변경한 값 넣기
  //       const imageFile = reader.result;
  //       // 리스트에 추가하기
  //       setUpdatePreviewData([...updatePreviewData, imageFile]);
  //     };
  //   });
  // }, [updateFileData]);

  // 기존의 이미지는 그대로 url로 보내고, 새로 넣은 이미지는 multipart로 보내기

  // 이미지 파일 입력
  const onFile = (event) => {
    // 이거 자체가 filelist
    const file = event.target.files;
    console.log('업데이트', file);
    setUpdateFileData([...updateFileData, file]);
    // 이미지 미리보기
    const img = imgRef.current.files;
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = () => {
      // 이미지 띄울 수 있게 변경한 값 넣기
      const imageFile = reader.result;
      // 리스트에 추가하기
      setUpdatePreviewData([...updatePreviewData, imageFile]);
    };
  };

  // 이미지 삭제
  const deleteImg = (id) => {
    console.log('>', id);
    console.log('수정 후', updateFileData);
    console.log('미리보기 수정 후', updatePreviewData);
    // 미리보기에서 삭제
    setUpdatePreviewData(updatePreviewData.filter((img) => updatePreviewData.indexOf(img) !== id));
    // 보내주는 이미지 파일 리스트에서 삭제
    setUpdateFileData(updateFileData.filter((img) => updateFileData.indexOf(img) !== id));
    console.log('>>', updateFileData[id]);
    console.log('>>>>', updatePreviewData);
  };

  // 제목 수정
  const onTitle = (event) => {
    setUpdateTitleData(event.currentTarget.value);
  };
  // 내용 수정
  const onContent = (event) => {
    setUpdateContentData(event.currentTarget.value);
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
    // 이미지 파일 + 카드 내용 합쳐서 보내기
    const formData = new FormData();
    Array.from(updateFileData).forEach((el) => {
      formData.append('memoryImgFiles', el);
    });

    const newCardData: cardData = {
      userId: userId,
      memoryId: currentCard.id,
      memoryTitle: updateTitleData,
      memoryContent: updateContentData,
    };
    formData.append('newCardData', new Blob([JSON.stringify(newCardData)], { type: 'application/json' }));
    console.log('수정한 추억', cardData);

    // formData 확인
    for (var entries of formData.keys()) console.log('###', entries);
    for (var data of formData.values()) console.log('@@@', data);

    // 서버로 전달
    axios
      .patch('https://i8a804.p.ssafy.io/api/memory/', formData, { headers: { 'content-type': 'multipart/form-data' } })
      .then(() => {
        console.log('성공!');
        alert('새로운 추억이 등록되었습니다.');
        getCardList();
      })
      .catch((err) => {
        console.log(err);
        alert('다시 시도해주시기 바랍니다.');
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
          <div
            className={styles.photo}
            style={{ border: 'none', width: 280, height: 250, marginBottom: '3%', borderRadius: '10px' }}
          >
            {updatePreviewData &&
              updatePreviewData.map((item, id) => {
                return (
                  <div key={id} style={{ width: 80, height: 60 }}>
                    <img src={item} style={{ width: 50, height: 60 }} />
                    <div onClick={() => deleteImg(id)}>X</div>
                  </div>
                );
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
            style={{ width: 250, height: 80, border: 'none', borderRadius: '10px', padding: '5%' }}
            placeholder="내용을 입력하세요."
          />
        </form>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateCard;
