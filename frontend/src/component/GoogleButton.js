import { GOOGLE_AUTH_URL } from '../data/OAuth';

const GoogleButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        window.open(GOOGLE_AUTH_URL);
      }}
    >
      네이버 로그인
    </button>
  );
};

export default GoogleButton;
