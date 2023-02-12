import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DELETE_TOKEN } from '../store/Auth';
import { removeCookieToken } from '../storage/Cookies';
import { DELETE_USER } from '../store/User';

//회원탈퇴 페이지
const DeletePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    const url = `https://i8a804.p.ssafy.io/api/user/${userId}`;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${accessToken}`,
      },
      data: { userId: userId },
    })
      .then((res) => {
        console.log(res);
        if (res.ok === true) {
          if (window.confirm('그동안 이용해주셔서 감사합니다.')) {
            //토큰 삭제처리
            dispatch(DELETE_TOKEN());
            //회원 정보 삭제처리
            dispatch(DELETE_USER());
            removeCookieToken();
            //메인화면으로 보내기
            navigate('/');
          }
        }
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
};

export default DeletePage;
