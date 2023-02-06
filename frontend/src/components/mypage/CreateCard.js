import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './CreateCard.css';
import axios from 'axios';
import Modal from '../Modal';

function CreateCard(props) {
  // store에서 현재 로그인한 사용자의 userId 가져오기
  const userId = useSelector((state) => state.user.id);
  const getCardList = props.getCardList;

  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const [fileData, setFileData] = useState([]);
  const imgRef = useRef();
  const [previewData, setPreviewData] = useState([]);
  const [titleData, setTitleData] = useState('');
  const [contentData, setContentData] = useState('');

  const onFile = (event) => {
    console.log('사진', event.target.files[0]);
    const file = event.target.files[0];
    setFileData([...fileData, file]);
    const img = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = () => {
      // 이미지 띄울 수 있게 변경한 값 넣기
      const imageFile = reader.result;
      // 리스트에 추가하기
      setPreviewData([...previewData, imageFile]);
    };
  };

  const deleteImg = (id) => {
    console.log('삭제할거야', id);
    // console.log('사진리스트', previewData[id]);
    setPreviewData(previewData.filter((img) => previewData.indexOf(img) !== id));
    setFileData(fileData.filter((img) => fileData.indexOf(img) !== id));
    console.log('같은건가?', previewData.indexOf(previewData[id]));
    console.log('사진리스트 삭제 후', previewData);
  };

  const onTitle = (event) => {
    setTitleData(event.currentTarget.value);
  };
  const onContent = (event) => {
    setContentData(event.currentTarget.value);
  };

  const memoryRegister = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('memoryImgFiles', fileData);
    const cardData = {
      userId: userId,
      memoryImgFiles: formData,
      memoryTitle: titleData,
      memoryContent: contentData,
    };
    // 서버로 전달
    console.log('새로운 추억', cardData);
    axios({
      url: 'http://i8a804.p.ssafy.io:8040/memory',
      method: 'POST',
      data: cardData,
      // headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        setModalOpen(false);
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
      <div className="create-card">
        <div onClick={openModal}>
          <p>+</p>
          <p>추가하기</p>
        </div>
      </div>
      <Modal open={modalOpen} close={closeModal} register={memoryRegister} header="&#128221; 기록하기">
        {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다.  */}
        <form className="memory" encType="multipart/form-data">
          {/* <p>{fileData}</p>  */}
          <input
            // value={fileData}
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
            {/* {imgFile ?  */}
            {previewData.map((item, id) => {
              return (
                <div key={id} style={{ width: 80, height: 60 }}>
                  <img src={item} style={{ width: 50, height: 60 }} />
                  <div onClick={() => deleteImg(id)}>X</div>
                </div>
              );
            })}
          </div>
          <input
            value={titleData}
            onChange={onTitle}
            style={{ width: 250, border: 'none', borderRadius: '10px', padding: '5%', marginBottom: '3%' }}
            placeholder="제목을 입력하세요."
          ></input>
          <br />
          <textarea
            value={contentData}
            onChange={onContent}
            style={{ width: 250, height: 80, border: 'none', borderRadius: '10px', padding: '5%' }}
            placeholder="내용을 입력하세요."
          ></textarea>
        </form>
      </Modal>
    </React.Fragment>
  );
}

export default CreateCard;
