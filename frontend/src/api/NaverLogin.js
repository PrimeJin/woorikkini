////////////////네이버 소셜 로그인/////////////////////
import axios from 'axios';
import { SET_TOKEN } from '../store/Auth';
import { setRefreshToken } from '../storage/Cookies';
import { useNavigate } from 'react-router-dom';

//1. 인가코드를 백엔드로 보낸다
//2. 백엔드에서 인가코드를 카카오 인증서버로 보내서 자체 토큰발행
//3. 백엔드에서 카카오로부터 받은 토큰을 기반으로 Access Token 발행해서 프론트로 리턴
//4. 우리가 받게 되는건 백엔드에서 자체 생성한 Access Token

export const NaverLogin = (code) => {
  const navigate = useNavigate();
  return function (dispatch) {
    axios({
      method: 'GET',
      //FE -> BE로 인가코드를 싣어서 요청을 보내기
      //지금은 AccessToken이 안나오는게 정상
      url: `70.12.247.235/oauth/callback/naver/redirect?code=${code}`,
    })
      .then((response) => {
        console.log(response); //Access Token 확인용

        // const ACCESS_TOKEN = response.data.accessToken;
        // localStorage.setItem('accessToken', ACCESS_TOKEN); //로컬스토리지에 임시저장(안해도됨)
        //Cookie에 Refresh Token 저장
        setRefreshToken(response.json.refresh_token);
        //store에 Access Token 저장하도록 Action Dispatch
        //참고: /store/Auth.js
        dispatch(SET_TOKEN(response.json.access_token));

        navigate('/'); //로그인
      })
      .catch((err) => {
        console.log('소셜 로그인 에러', err);
        window.alert('로그인에 실패하였습니다');
        navigate('/user/login'); //로그인 실패했으니 다시 로그인 화면으로
      });
  };
};
