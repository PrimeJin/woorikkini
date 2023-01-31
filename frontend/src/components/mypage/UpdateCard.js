import React, { useRef, useState } from 'react';
import './UpdateCard.css';
// import axios from 'axios';
import Modal from '../Modal';

function UpdateCard({ currentCard, update }) {
  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  console.log('수정1', currentCard);
  console.log('수정2', update);
  const [modalOpen, setModalOpen] = useState(false);

  setModalOpen(update);

  const closeModal = () => {
    setModalOpen(false);
  };

  const imgFile = currentCard.img;
  const titleData = currentCard.title;
  const contentData = currentCard.content;

  const [fileData, setFileData] = useState([]);
  // const [imgFile, setImgFile] = useState('');
  // const imgRef = useRef();
  // const [titleData, setTitleData] = useState('');
  // const [contentData, setContentData] = useState('');

  const onFile = (event) => {
    // console.log('?', event.target.files);
    setFileData([...fileData, event.target.value]);
    // console.log('@', imgRef.current.files[0]);
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // setImgFile(reader.result);
    };
    return (
      <React.Fragment>
        {/* //header 부분에 텍스트를 입력한다. */}
        <Modal open={modalOpen} close={closeModal} header="수정하기">
          {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다.  */}
          <form className="memory">
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
              <img src={imgFile} style={{ width: 250, height: 300 }} />
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
  };
}

export default UpdateCard;