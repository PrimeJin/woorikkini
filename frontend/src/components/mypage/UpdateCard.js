import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './UpdateCard.css';
// import axios from 'axios';
import Modal from '../Modal';

function UpdateCard({ currentCard, cardUpdate, cardListUpdate }) {
  // props 데이터 타입 -> 설정 안하니까 오류났음
  UpdateCard.propsTypes = {
    currentCard: PropTypes.node.isRequired,
    cardUpdate: PropTypes.node.isRequired,
    cardListUpdate: PropTypes.node.isRequired,
  };

  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  console.log('수정1', currentCard);
  // console.log('수정2', update);
  const [modalOpen, setModalOpen] = useState(false);

  // 바로 모달창 띄우기
  useEffect(() => {
    console.log('지금 모야', modalOpen);

    setModalOpen(true);
  });

  const closeModal = () => {
    setModalOpen(false);
  };

  const [updateFileData, setUpdateFileData] = useState(currentCard.img);
  const imgRef = useRef();
  const [updateTitleData, setUpdateTitleData] = useState(currentCard.title);
  const [updateContentData, setUpdateContentData] = useState(currentCard.content);

  // console.log('원래 ->', fileData);
  console.log('수정 후 ->', updateFileData);

  const onFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 이미지 띄울 수 있게 변경한 값 넣기
      const imageFile = reader.result;
      // 리스트에 추가하기
      setUpdateFileData([...updateFileData, imageFile]);
    };
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
    // const formData = { img: fileData, title: titleData, content: contentData };
    console.log('얍!');
    const formData = { id: currentCard.id, img: updateFileData, title: updateTitleData, content: updateContentData };
    // addCard(formData);
    console.log('욥!');
    console.log('수정 내용', formData);
    // setImgFile('');
    // setUpdateFileData([]);
    // setUpdateTitleData('');
    // setUpdateContentData('');
    setModalOpen(false);
    cardUpdate();
    cardListUpdate(currentCard.id, formData);
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
          ></input>
          <div className="photo">
            {updateFileData.map((item, id) => {
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
            style={{ width: 300 }}
            placeholder="제목을 입력하세요."
          ></input>
          <br />
          <textarea
            value={updateContentData}
            onChange={onContent}
            style={{ width: 300, height: 100 }}
            placeholder="내용을 입력하세요."
          ></textarea>
        </form>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateCard;
