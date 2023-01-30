//딱히 이럴 이유까진 없지만 코드의 간결화를 위해 로그인버튼 컴포넌트 분리
//버튼 스타일을 디자인하고 싶다면 여기서 따로 관리해주면 더 좋다
import { NaverNewLogin } from '../api/NaverNewLogin';
import { NAVER_AUTH_URL } from '../data/OAuth';
import './Button.css';

const NaverButton = () => {
  return (
    <button type="button" className="naver-button" onClick={NaverNewLogin()}>
      <img src="https://static.nid.naver.com/oauth/big_g.PNG?version=js-2.0.1" width="222" alt="" />
    </button>
  );
};

export default NaverButton;
