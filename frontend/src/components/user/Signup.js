import styles from './Signup.module.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './UserPagesLogo';
import axios from 'axios';

// 회원가입 폼
function Form() {
  // 입력 값들 선언 후 변경 적용
  const [Email, setEmail] = useState('');
  const [Code, setCode] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const [pwcheckVisible, setPwcheckVisible] = useState(false);
  const [Name, setName] = useState('');
  const [Nickname, setNickname] = useState('');
  const [nickVisible, setNickVisible] = useState(false);
  const [possible, setPossible] = useState(false);
  const [impossible, setImpossible] = useState(false);
  const [Day, setDay] = useState('');
  const [Gender, setGender] = useState('');

  // 이메일 입력
  const onEmail = (event) => {
    setEmail(event.currentTarget.value);
  };
  // 해당 이메일로 인증 코드 전송
  const [emailCheck, setEmailCheck] = useState(false);
  const onEmailClick = (event) => {
    event.preventDefault();
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (Email === '') {
      alert('이메일을 입력해주세요.');
    } else if (!emailRegex.test(Email)) {
      alert('올바른 이메일 형식이 아닙니다. 다시 입력해주세요.');
    } else {
      axios({
        url: `https://i8a804.p.ssafy.io/api/user/email/check?authCodeUserEmail=${Email}`,
        method: 'GET',
      })
        .then((res) => {
          if (res.data.message === 'success') {
            setEmailCheck(true);
            alert('인증코드가 전송되었습니다.');
          } else {
            alert('다시 시도해주시기 바랍니다.');
          }
        })
        .catch((err) => {
          if (err.response.data.message === 'fail') {
            alert('이미 가입된 이메일 입니다.');
          } else {
            alert('다시 시도해주시기 바랍니다.');
          }
          console.log(err.response.data.message);
        });
    }
  };
  // 인증 코드 입력
  const onCode = (event) => {
    setCode(event.currentTarget.value);
  };
  // 인증하기
  const [codeCheck, setCodeCheck] = useState(false);
  const onCodeClick = (event) => {
    event.preventDefault();
    if (Code === '') {
      alert('인증코드를 입력해주세요.');
    } else {
      axios({
        url: `https://i8a804.p.ssafy.io/api/user/email/check?authCodeContent=${Code}&authCodeUserEmail=${Email}`,
        method: 'POST',
      })
        .then((res) => {
          console.log(res.data.message);
          setCodeCheck(true);
          alert('인증되었습니다.');
        })
        .catch((err) => {
          console.log(err);
          alert('다시 시도해주시기 바랍니다.');
        });
    }
  };
  // 비밀번호 입력
  const onPassword = (event) => {
    const pwCurrent = event.currentTarget.value;
    setPassword(pwCurrent);
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,12}$/;
    if (!pwRegex.test(pwCurrent)) {
      setPwVisible(true);
    } else {
      setPwVisible(false);
    }
  };
  // 비밀번호 확인
  const onConfirmPassword = (event) => {
    const passwordCurrent = event.currentTarget.value;
    setConfirmPassword(passwordCurrent);
    if (Password === passwordCurrent) {
      setPwcheckVisible(false);
    } else {
      setPwcheckVisible(true);
    }
  };
  // 이름 입력
  const onName = (event) => {
    setName(event.currentTarget.value);
  };
  // 닉네임 입력
  const onNickname = (event) => {
    const nickCurrent = event.currentTarget.value;
    setNickname(nickCurrent);
    if (nickCurrent.length > 11) {
      setNickVisible(true);
    } else {
      setNickVisible(false);
    }
  };
  // 닉네임 중복 확인
  const onNickCheck = (event) => {
    event.preventDefault();
    if (Nickname === '') {
      alert('닉네임을 입력해주세요.');
    } else {
      axios({
        url: `https://i8a804.p.ssafy.io/api/user/${Nickname}`,
        method: 'GET',
      })
        .then((res) => {
          console.log('??', res.data.message);
          if (res.data.message === 'success') {
            setPossible(true);
            setImpossible(false);
            console.log('!!!', possible);
          } else {
            setImpossible(true);
            setPossible(false);
            alert('중복되는 닉네임 입니다.');
          }
        })
        .catch((err) => {
          console.log(err);
          alert('다시 시도해주시기 바랍니다.');
        });
    }
  };
  // 생년월일 입력
  const onDay = (event) => {
    const inputDay = event.currentTarget.value;
    setDay(inputDay);

    // 현재 날짜 구하기
    // let today = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().slice(0, 10);
    // console.log(today);
  };
  // 성별 입력
  const onGender = (event) => {
    if (event.currentTarget.value === 'female') {
      setGender('female');
    } else if (event.currentTarget.value === 'male') {
      setGender('male');
    } else {
      setGender('');
    }
  };
  // 가입하기
  const navigate = useNavigate();
  const onSubmit = (event) => {
    console.log('닉네임 중복 확인 ->', possible);
    if (Email == '' || Password == '' || Name == '' || Nickname == '' || Day == '' || Gender == '') {
      alert('빈 칸을 입력해주세요.');
    } else if (emailCheck == false || codeCheck == false || possible == false) {
      alert('인증을 진행해주세요.');
    } else {
      event.preventDefault();
      const Birth = Day.split('-').join('');
      const userData = {
        userEmail: Email,
        userPassword: Password,
        userName: Name,
        userNickname: Nickname,
        userBirth: Birth,
        userGender: Gender,
      };
      console.log(userData);
      axios({
        url: 'https://i8a804.p.ssafy.io/api/user',
        method: 'POST',
        data: userData,
      })
        .then((res) => {
          console.log(res);
          alert('가입되었습니다.');
          navigate('/usermanual');
          // navigate('/');
        })
        .catch((err) => {
          console.log(err);
          alert('다시 시도해주시기 바랍니다.');
        });
    }
  };

  return (
    <form className={styles.signup_form}>
      <p className={styles.text_type}>회원가입</p>
      <div style={{ position: 'relative' }}>
        <input
          type="email"
          value={Email}
          onChange={onEmail}
          className={styles.input_form_top}
          placeholder="이메일"
          required
        />
        <button type="click" className={styles.check_btn} onClick={onEmailClick} value={emailCheck}>
          코드 전송
        </button>
      </div>
      <p></p>
      <div style={{ position: 'relative' }}>
        <input
          type="code"
          value={Code}
          onChange={onCode}
          className={styles.input_form}
          placeholder="인증코드"
          required
        />
        <button className={styles.check_btn} onClick={onCodeClick} value={codeCheck}>
          인증하기
        </button>
      </div>

      <p></p>
      <input
        type="password"
        value={Password}
        onChange={onPassword}
        className={styles.input_form}
        placeholder="비밀번호"
        required
      />
      {pwVisible ? (
        <span className={styles.impossible}>*영문, 숫자, 특수문자를 조합하여 8~12자로 입력해주세요</span>
      ) : (
        <p></p>
      )}
      <input
        type="password"
        value={ConfirmPassword}
        onChange={onConfirmPassword}
        className={styles.input_form}
        placeholder="비밀번호 확인"
        required
      />
      {pwcheckVisible ? <span className={styles.impossible}>* 비밀번호가 일치하지 않습니다.</span> : <p></p>}
      <input type="text" value={Name} onChange={onName} className={styles.input_form} placeholder="이름" required />
      <p></p>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={Nickname}
          onChange={onNickname}
          className={styles.input_form}
          placeholder="닉네임"
          required
        />
        <button className={styles.check_btn} onClick={onNickCheck}>
          중복 확인
        </button>
      </div>
      {nickVisible && <span className={styles.impossible}>* 최대 10자의 닉네임을 사용할 수 있습니다.</span>}
      {possible && <span className={styles.possible}>* 사용할 수 있는 닉네임 입니다.</span>}
      {impossible && <span className={styles.impossible}>* 중복되는 닉네임 입니다.</span>}
      <p></p>
      <input
        type="date"
        value={Day}
        // 최대 선택 날짜는 오늘까지
        max={new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().slice(0, 10)}
        onChange={onDay}
        className={styles.date_input}
        data-placeholder="생년월일"
        required
      />
      <p></p>
      <div className={styles.check_box}>
        <p className={styles.gender}>성별</p>
        <fieldset className={styles.gender_check}>
          <label className={styles.gender_label}>
            <input type="radio" value="female" name="gender" onClick={onGender} />
            여자
          </label>
          <label className={styles.gender_label}>
            <input type="radio" value="male" name="gender" onClick={onGender} />
            남자
          </label>
          <label className={styles.gender_label}>
            <input type="radio" value="" name="gender" onClick={onGender} />
            선택 X
          </label>
        </fieldset>
      </div>
      <button onClick={onSubmit} className={styles.accept}>
        가입하기
      </button>
    </form>
  );
}

function Signup() {
  return (
    <div>
      <div>
        <Logo></Logo>
      </div>
      <div className={styles.Signup_all}>
        <Form></Form>
      </div>
    </div>
  );
}

export default Signup;
