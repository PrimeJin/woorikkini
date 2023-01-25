//클라이언트 ID, URL 등 통합관리

//카카오
const KAKAO_CLIENT_ID = 'c4a8764384feb504350529d1cafff37b'; //REST_API_KEY
//카카오로그인 버튼을 클릭하고 동의하고 계속하기를 누르면 인가코드를 카카오 인증서버로부터 받아 아래 URI로 이동함
const REDIRECT_URI = 'http://localhost:3000/oauth/callback/kakao'; //꼭 프론트에서 접근할 수 있는 URL로 할것
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

//네이버
const NAVER_CLIENT_ID = 'qGn2ZQGASVLomgGTnNxG'; //클라이언트 ID
const NAVER_CALLBACK_URL = 'http://localhost:3000/oauth/callback/naver'; //콜백 URL

export const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=test&redirect_uri=${NAVER_CALLBACK_URL}`;
