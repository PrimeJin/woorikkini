import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './CreateCard.module.css';
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
    setFileData('');
    setTitleData('');
    setContentData('');
    setPreviewData([]);
  };

  // 카드 내용 변수 설정
  const [fileData, setFileData] = useState('');
  const [titleData, setTitleData] = useState('');
  const [contentData, setContentData] = useState('');
  // 이미지 미리보기
  const imgRef = useRef();
  const [previewData, setPreviewData] = useState([]);

  // 이미지 파일 입력
  const onFile = (event) => {
    // 이거 자체가 filelist
    const file = event.target.files;
    setFileData(file);
    // 이미지 미리보기
    const imgList = imgRef.current.files;

    let fileURLs = [];

    Array.from(imgList).forEach((img) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 이미지 띄울 수 있게 변경한 값 넣기
        const imageFile = reader.result;
        fileURLs.push(imageFile);
        // 리스트에 추가하기
        setPreviewData([...fileURLs]);
      };
      reader.readAsDataURL(img);
    });
  };

  // 이미지 선택했던 거 삭제
  const deleteImg = (id) => {
    // 미리보기에서 삭제
    setPreviewData(previewData.filter((img) => previewData.indexOf(img) !== id));
    // 보내주는 이미지 파일 리스트에서 삭제
    setFileData(fileData.filter((img) => fileData.indexOf(img) !== id));
  };

  // 제목 입력
  const onTitle = (event) => {
    const inputTitle = event.currentTarget.value;
    if (inputTitle.length > 20) {
      alert('최대 20자까지 입력이 가능합니다.');
    } else {
      setTitleData(inputTitle);
    }
  };
  // 내용 입력
  const onContent = (event) => {
    const inputContent = event.currentTarget.value;
    if (inputContent.length > 40) {
      alert('최대 40자까지 입력이 가능합니다.');
    } else {
      setContentData(inputContent);
    }
  };

  // 카드 내용 담을 변수
  interface cardData {
    userId: string;
    memoryTitle: string;
    memoryContent: string;
  }

  // 카드 등록
  const memoryRegister = (event) => {
    event.preventDefault();
    // 이미지 파일 + 카드 내용 합쳐서 보내기
    const formData = new FormData();
    Array.from(fileData).forEach((el) => {
      formData.append('memoryImgFiles', el);
    });

    const newCardData: cardData = {
      userId: userId,
      memoryTitle: titleData,
      memoryContent: contentData,
    };
    formData.append('newCardData', new Blob([JSON.stringify(newCardData)], { type: 'application/json' }));

    // 서버로 전달
    axios
      .post('https://i8a804.p.ssafy.io/api/memory', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        setModalOpen(false);
        alert('새로운 추억이 등록되었습니다.');
        // formData 확인
        for (let key of formData.keys()) {
          console.log(key, ':', formData.get(key));
        }

        getCardList();
        setFileData('');
        setTitleData('');
        setContentData('');
        setPreviewData([]);
      })
      .catch((err) => {
        console.log(err);
        alert('다시 시도해주시기 바랍니다.');
      });
  };

  return (
    <React.Fragment>
      {/* //header 부분에 텍스트를 입력한다. */}
      <div className={styles.create_card}>
        <div onClick={openModal}>
          <p>+</p>
          <p>추가하기</p>
        </div>
      </div>
      <Modal open={modalOpen} close={closeModal} register={memoryRegister} header="&#128221; 기록하기">
        {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다.  */}
        <form className={styles.memory} encType="multipart/form-data">
          <input
            type="file"
            multiple="multiple"
            accept="image/*"
            onChange={onFile}
            ref={imgRef}
            style={{ justifyContent: 'center' }}
            name="memoryImgFiles"
          />

          <div className={styles.photo}>
            {previewData.map((item, id) => {
              return (
                <img
                  key={id}
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
            style={{ width: 250, height: 50, border: 'none', borderRadius: '10px', padding: '5%', resize: 'none' }}
            placeholder="내용을 입력하세요."
          ></textarea>
        </form>
      </Modal>
    </React.Fragment>
  );
}

export default CreateCard;
