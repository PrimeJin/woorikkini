import React, { useState } from 'react';
import './CreateCard.css';
import Modal from './Modal';

function CreateCard() {
  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
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
      <Modal open={modalOpen} close={closeModal} header="기록하기">
        {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다.  */}
        <div className="memory">
          <div className="photo">
            <button>사진 업로드</button>
          </div>
          <input style={{ width: 300 }} placeholder="제목을 입력하세요."></input>
          <br />
          <textarea style={{ width: 300, height: 100 }} placeholder="내용을 입력하세요."></textarea>
        </div>
      </Modal>
    </React.Fragment>
  );
}

export default CreateCard;
