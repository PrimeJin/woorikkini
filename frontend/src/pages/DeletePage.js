import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//회원탈퇴 페이지
function DeletePage() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.token);
  const { id } = useSelector((state) => state.user); //user state에서 id 가져오기
  const onDelete = (e) => {
    e.preventDefault();
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      deleteUser(id);
    } else {
      return;
    }
  };

  const deleteUser = (userId) => {
    const url = `url/${userId}`;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.status === 200) alert('그동안 이용해주셔서 감사합니다.');
        navigate('/'); //메인화면으로 보내기
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <h2>회원 탈퇴</h2>
      <span>탈퇴하시면, 그동안의 기록들이 모두 사라지게됩니다.</span>
      <h3>정말 탈퇴하시겠습니까?</h3>
      <button onClick={onDelete}>탈퇴하기</button>
      <button onClick={() => navigate(-1)}>취소하기</button>
    </>
  );
}

export default DeletePage;
