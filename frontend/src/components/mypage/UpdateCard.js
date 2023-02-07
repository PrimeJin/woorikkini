import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './UpdateCard.css';
import axios from 'axios';
import Modal from '../Modal';

function UpdateCard(props) {
  const userId = useSelector((state) => state.user.id);

  const currentCard = props.currentCard;
  const getCardList = props.getCardList;
  const modalOpen = props.modalOpen;
  const closeModal = props.closeModal;

  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  // const [modalOpen, setModalOpen] = useState(props.modalOpen);

  // 바로 모달창 띄우기
  // useEffect(() => {
  //   console.log('왜 안열려?');
  //   if (update === true) {
  //     console.log('열자!');
  //     openModal();
  //   }
  // }, [modalOpen]);

  // const openModal = () => {
  //   setModalOpen(true);
  // };

  // const closeModal = () => {
  //   console.log('닫을거야 -> 전', update, modalOpen);
  //   const updateClose = false;
  //   setModalOpen(updateClose);
  //   const updateModal = false;
  //   setUpdate(updateModal);
  //   console.log('닫을거야 -> 후', update, modalOpen);
  // };

  const [updateFileData, setUpdateFileData] = useState(currentCard.img);
  const [updatePreviewData, setUpdatePreviewData] = useState([]);
  const imgRef = useRef();
  const [updateTitleData, setUpdateTitleData] = useState(currentCard.title);
  const [updateContentData, setUpdateContentData] = useState(currentCard.content);

  const onFile = (event) => {
    // console.log('사진', event.target.files[0]);
    // const file = imgRef.current.files[0];
    // setUpdateFileData([...updateFileData, file]);
    // const img = imgRef.current.files[0];
    // const reader = new FileReader();
    // reader.readAsDataURL(img);
    // reader.onloadend = () => {
    //   // 이미지 띄울 수 있게 변경한 값 넣기
    //   const imageFile = reader.result;
    //   // 리스트에 추가하기
    //   setUpdatePreviewData([...updatePreviewData, imageFile]);
    // };
  };
  // 이미지 삭제
  const deleteImg = (id) => {
    console.log('>', id);
    // console.log('원래', fileData);
    console.log('수정 후', updateFileData);
    setUpdateFileData(updateFileData.filter((img) => updateFileData.indexOf(img) !== id));
    console.log('>>>>', updateFileData[id]);
  };

  const onTitle = (event) => {
    setUpdateTitleData(event.currentTarget.value);
  };
  const onContent = (event) => {
    setUpdateContentData(event.currentTarget.value);
  };
  const memoryUpdate = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('memoryImgFiles', updateFileData);
    const cardData = {
      userId: userId,
      memoryId: currentCard.id,
      memoryImgFiles: formData,
      memoryTitle: updateTitleData,
      memoryContent: updateContentData,
    };
    console.log('수정한 추억', cardData);

    // 서버로 전달
    axios({
      url: 'https://i8a804.p.ssafy.io/api/memory/',
      method: 'PATCH',
      // headers: { 'Content-Type': 'multipart/form-data' },
      data: cardData,
    })
      .then(() => {
        // setModalOpen(false);
        alert('추억이 수정되었습니다.');
        getCardList();
        // setUpdate(!update);
      })
      .catch((err) => {
        console.log(err);
        alert('다시 시도해주시기 바랍니다.');
      });

    // setModalOpen(false);
    // cardUpdate();
  };
  return (
    <React.Fragment>
      {/* //header 부분에 텍스트를 입력한다. */}

      <Modal open={modalOpen} close={closeModal} register={memoryUpdate} header="수정하기">
        {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다.  */}
        <form className="memory">
          <input
            // value={updateFileData}
            type="file"
            multiple
            accept="image/*"
            id="profileImg"
            onChange={onFile}
            ref={imgRef}
            style={{ justifyContent: 'center' }}
          />
          <div
            className="photo"
            style={{ border: 'none', width: 280, height: 250, marginBottom: '3%', borderRadius: '10px' }}
          >
            {updateFileData &&
              updateFileData.map((item, id) => {
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
          />
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
