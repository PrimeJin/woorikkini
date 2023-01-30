////////////////카카오 소셜 로그인/////////////////////
import axios from 'axios';
import { SET_TOKEN } from '../store/Auth';
import { setRefreshToken } from '../storage/Cookies';
import { useNavigate } from 'react-router-dom';

//1. 로그인 요청을 백엔드로 보낸다
//2. 백엔드에서 인증서버로부터 인가코드를 받아오고 다시 이를 이용해서 토큰 요청
//3. 백엔드에서 카카오로부터 받은 토큰을 기반으로 Access Token 발행해서 프론트로 리턴
//4. 우리가 받게 되는건 백엔드에서 자체 생성한 Access Token(기타 정보를 담은 객체)
export const KakaoNewLogin = () => {
  const navigate = useNavigate();
  return function (dispatch) {
    axios({
      method: 'POST',
      url: '70.12.247.235:8040/oauth2/authorize/kakao?redirect_uri=localhost:3000',
    })
      .then((response) => {
        console.log(response); //Access Token 확인용

        const accessToken = response.headers.get('accessToken');
        const refreshToken = response.headers.get('refreshToken');
        setRefreshToken(refreshToken);
        //store에 Access Token 저장하도록 Action Dispatch
        //참고: /store/Auth.js
        dispatch(SET_TOKEN(accessToken));

        navigate('/'); //로그인
      })
      .catch((err) => {
        console.log('소셜 로그인 에러', err);
        window.alert('로그인에 실패하였습니다');
        navigate('/user/login'); //로그인 실패했으니 다시 로그인 화면으로
      });
  };
};
