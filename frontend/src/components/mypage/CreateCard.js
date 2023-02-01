import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './CreateCard.css';
import axios from 'axios';
import Modal from '../Modal';

function CreateCard({ addCard }) {
  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  CreateCard.propsTypes = {
    addCard: PropTypes.node.isRequired,
  };

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const [fileData, setFileData] = useState([]);
  const imgRef = useRef();
  const [titleData, setTitleData] = useState('');
  const [contentData, setContentData] = useState('');

  const onFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 이미지 띄울 수 있게 변경한 값 넣기
      const imageFile = reader.result;
      // 리스트에 추가하기
      setFileData([...fileData, imageFile]);
    };
  };

  const deleteImg = (id) => {
    setFileData(fileData.filter((img) => fileData.indexOf(img) !== id));
  };

  const onTitle = (event) => {
    setTitleData(event.currentTarget.value);
  };
  const onContent = (event) => {
    setContentData(event.currentTarget.value);
  };

  const memoryRegister = (event) => {
    event.preventDefault();

    // const formData = { img: fileData, title: titleData, content: contentData };
    // addCard(formData);
    // setFileData([]);
    // setTitleData('');
    // setContentData('');
    // setModalOpen(false);

    // 서버로 전달
    axios
      .post('http:// /memory', {
        headers: {},
        data: {
          img: fileData,
          title: titleData,
          content: contentData,
        },
      })
      .then(() => {
        setModalOpen(false);
        alert('새로운 추억이 등록되었습니다.');
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
      <Modal open={modalOpen} close={closeModal} register={memoryRegister} header="기록하기">
        {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다.  */}
        <form className="memory">
          {/* <p>{fileData}</p>  */}
          <input
            // value={fileData}
            type="file"
            multiple
            accept="image/*"
            id="profileImg"
            onChange={onFile}
            ref={imgRef}
          />
          <div className="photo">
            {/* {imgFile ?  */}
            {fileData.map((item, id) => {
              return (
                <div key={id} style={{ width: 80, height: 60 }}>
                  <img src={item} style={{ width: 50, height: 60 }} />
                  <div onClick={() => deleteImg(id)}>X</div>
                </div>
              );
            })}
            {/* : <div></div>} */}
          </div>
          <input value={titleData} onChange={onTitle} style={{ width: 300 }} placeholder="제목을 입력하세요."></input>
          <br />
          <textarea
            value={contentData}
            onChange={onContent}
            style={{ width: 300, height: 100 }}
            placeholder="내용을 입력하세요."
          ></textarea>
        </form>
      </Modal>
    </React.Fragment>
  );
}

export default CreateCard;
