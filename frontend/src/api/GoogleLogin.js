////////////////구글 소셜 로그인/////////////////////
import axios from 'axios';
import { SET_TOKEN } from '../store/Auth';
import { setRefreshToken } from '../storage/Cookies';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../data/OAuth';

//1. 인가코드를 백엔드로 보낸다
//2. 백엔드에서 인가코드를 구글 인증서버로 보내서 자체 토큰발행
//3. 백엔드에서 구글로부터 받은 토큰을 기반으로 Access Token 발행해서 프론트로 리턴
//4. 우리가 받게 되는건 백엔드에서 자체 생성한 Access Token(기타 정보를 담은 객체)
export const GoogleLogin = (code) => {
  const navigate = useNavigate();
  return function (dispatch) {
    axios({
      method: 'GET',
      //FE -> BE로 인가코드를 싣어서 요청을 보내기
      url: `${BASE_URL}/oauth/callback/google?code=${code}`,
    })
      .then((response) => {
        console.log(response); //Access Token 확인용

        //Backend에서 response를 어떤 형식으로 보내는지 체크하고 수정할것
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
