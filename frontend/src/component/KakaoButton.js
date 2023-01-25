//딱히 이럴 이유까진 없지만 코드의 간결화를 위해 로그인버튼 컴포넌트 분리
//버튼 스타일을 디자인하고 싶다면 여기서 따로 관리해주면 더 좋다
import { KAKAO_AUTH_URL } from '../data/OAuth';

const KakaoButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        window.open(KAKAO_AUTH_URL);
      }}
    >
      카카오 로그인
    </button>
  );
};

export default KakaoButton;
