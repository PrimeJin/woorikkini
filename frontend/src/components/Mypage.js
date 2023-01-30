import './Mypage.css';
import React from 'react';
import Logo from './PageLogo';
import NoticeIcon from './NoticeIcon';
import Nav from './Navbar';
import CardContainer from './CardContainer';

// import axios from 'axios';

// function CardContainer() {
// const [memoryData, setMemoryData] = useState([{
//   idx: '',
//   photo: '',
//   date: '',
//   title: '',
//   content: ''
// }])

// useEffect(async() => {
//   try{
//     const res = await axios.get('/profile/')
//     const _memoryData = await res.data.map((rowData) => (
//       setLast
//     ))
//   }
// })
//   return (
//     <div className="cardlist-top">
//       <Card></Card>
//       <Card></Card>
//       <CreateCard></CreateCard>
//     </div>
//   );
// }

// function CreateCard() {
//   // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
//   const [modalOpen, setModalOpen] = useState(false);

//   const openModal = () => {
//     setModalOpen(true);
//   };
//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   return (
//     <React.Fragment>
//       {/* //header 부분에 텍스트를 입력한다. */}
//       <div className="create-card">
//         <div onClick={openModal}>
//           <p>+</p>
//           <p>추가하기</p>
//         </div>
//       </div>
//       <Modal open={modalOpen} close={closeModal} header="기록하기">
//         {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다.  */}
//         <div className="memory">
//           <div className="photo">
//             <button>사진 업로드</button>
//           </div>
//           <input style={{ width: 300 }} placeholder="제목을 입력하세요."></input>
//           <br />
//           <textarea style={{ width: 300, height: 100 }} placeholder="내용을 입력하세요."></textarea>
//         </div>
//       </Modal>
//     </React.Fragment>
//   );
// }

// function CreateCard() {
//   const [modal, setModal] = useState(false);
//   const addCard = () => {
//     console.log(modal);
//     setModal(!modal);
//   };
//   return (

/* <div>
  {modal === true ? (
    <div className="modal" value={modal}>
      <h4>기록하기</h4>
      <div>사진 업로드</div>
      <p>제목</p>
      <p>내용</p>
      <div>
        <button>등록하기</button>
        <button>취소하기</button>
      </div>
    </div>
  ) : null}
</div>; */

//   );
// }

function Mypage() {
  return (
    <div>
      <div className="all">
        <Logo></Logo>
        <div className="title">
          <p style={{ fontSize: 50, marginBottom: 0 }}>나의 먹기록</p>
          <br />
          <p style={{ marginTop: 0 }}>내가 기록하고 싶은 순간들이야!</p>
        </div>
        <Nav></Nav>
      </div>
      <CardContainer></CardContainer>
      <NoticeIcon></NoticeIcon>
    </div>
  );
}

export default Mypage;
