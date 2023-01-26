import { GOOGLE_AUTH_URL } from '../data/OAuth';

const GoogleButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        window.open(GOOGLE_AUTH_URL);
      }}
    >
      <span>구글 로그인</span>
    </button>
  );
};

export default GoogleButton;
