//클라이언트 ID, URL 등 통합관리
// export const BASE_URL = '70.12.247.235'; //베이스 도메인
export const BASE_URL = 'http://i8a804.p.ssafy.io:8040';

//CLIENT SECRET은 사실 필요가 없는게 백엔드 서버에서 인증 서버에 ACCESS TOKEN을 요청할 때 사용하는게 일반적이라

//카카오
const KAKAO_CLIENT_ID = '4c9d2e7097b82c4907b943b2234143d7'; //REST_API_KEY
const KAKAO_CLIENT_SECRET = 'BxXSCtnhziINfQz5XscrsKZCYU98zxHC';
//카카오로그인 버튼을 클릭하고 동의하고 계속하기를 누르면 인가코드를 카카오 인증서버로부터 받아 아래 URI로 이동함
const KAKAO_REDIRECT_URL = 'http://localhost:3000/oauth/callback/kakao'; //꼭 프론트에서 접근할 수 있는 URL로 할것
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;

//네이버
const NAVER_CLIENT_ID = 'XxPeGo7VwfAZOHHutind'; //클라이언트 ID
const NAVER_CLIENT_SECRET = 'P4kkZRkniX';
const NAVER_REDIRECT_URL = 'http://localhost:3000/oauth/callback/naver'; //콜백 URL

export const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${NAVER_CLIENT_SECRET}&redirect_uri=${NAVER_REDIRECT_URL}`;

//구글
const GOOGLE_CLIENT_ID = '8310947964-sqagee6lmslk4314386dosfuqohlvs55.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?
client_id=${GOOGLE_CLIENT_ID}&
redirect_uri=http://localhost:3000/redirectCode&
scope=https://www.googleapis.com/auth/indexing&
response_type=code`;
