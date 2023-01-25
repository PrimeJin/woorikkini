//딱히 이럴 이유까진 없지만 코드의 간결화를 위해 로그인버튼 컴포넌트 분리
//버튼 스타일을 디자인하고 싶다면 여기서 따로 관리해주면 더 좋다
import { NAVER_AUTH_URL } from '../data/OAuth';

const NaverButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        window.open(NAVER_AUTH_URL);
      }}
    >
      네이버 로그인
    </button>
  );
};

export default NaverButton;
