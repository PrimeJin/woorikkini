/**
 * 구글 로그인을 한 후, 구글 인증서버로부터 인가 코드를 받아온 후에
 * 리다이렉트할 화면
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '../api/GoogleLogin';

const Google = (props) => {
  const dispatch = useDispatch();

  //인가코드(code?뒷부분이 인가코드이므로 따온다)
  let code = new URL(window.location.href).searchParams.get('code');

  //인가코드를 받아오면 백엔드로 넘기기
  React.useEffect(() => {
    async function fetchData() {
      await dispatch(GoogleLogin(code));
    }
    fetchData();
  }, []);
};

export default Google;
