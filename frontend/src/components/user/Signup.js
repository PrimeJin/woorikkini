import './Signup.css';
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
  const [Date, setDate] = useState('');
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
        url: `http://i8a804.p.ssafy.io:8040/user/email/check?authCodeUserEmail=${Email}`,
        method: 'GET',
      })
        .then((res) => {
          console.log(res.data.message);
          setEmailCheck(true);
          alert('인증코드가 전송되었습니다.');
        })
        .catch((err) => {
          alert('다시 시도해주시기 바랍니다.');
          console.log(err);
        });
    }
    console.log('이메일 인증 ->', emailCheck);
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
        url: `http://i8a804.p.ssafy.io:8040/user/email/check?authCodeContent=${Code}&authCodeUserEmail=${Email}`,
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
    console.log('코드 인증 ->', codeCheck);
  };
  // 비밀번호 입력
  const onPassword = (event) => {
    const pwCurrent = event.currentTarget.value;
    setPassword(pwCurrent);
    const pwRegex = /^[a-zA-z0-9]{8,12}$/;
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
        url: `http://i8a804.p.ssafy.io:8040/user/${Nickname}`,
        method: 'GET',
      })
        .then((res) => {
          console.log('??', res.data.message);
          if (res.data.message === 'success') {
            console.log('!!');
            setPossible(true);
          } else {
            setImpossible(true);
          }
        })
        .catch((err) => {
          console.log(err);
          alert('다시 시도해주시기 바랍니다.');
        });
    }
  };
  // 생년월일 입력
  const onDate = (event) => {
    setDate(event.currentTarget.value);
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
    if (Email == '' || Password == '' || Name == '' || Nickname == '' || Date == '' || Gender == '') {
      alert('빈 칸을 입력해주세요.');
    } else if (emailCheck == false || codeCheck == false || possible == false) {
      alert('인증을 진행해주세요.');
    } else {
      event.preventDefault();
      const Year = Date.slice(0, 4);
      console.log(Year);
      const userData = {
        userEmail: Email,
        userPassword: Password,
        userName: Name,
        userNickname: Nickname,
        userBirth: Year,
        userGender: Gender,
      };
      console.log(userData);
      axios({
        url: 'http://i8a804.p.ssafy.io:8040/user',
        method: 'POST',
        data: userData,
      })
        .then((res) => {
          console.log(res);
          alert('가입되었습니다.');
          navigate('/');
        })
        .catch((err) => {
          console.log(err);
          alert('다시 시도해주시기 바랍니다.');
        });
    }
  };

  return (
    <form className="signup-form">
      <p className="text-type">회원가입</p>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <input type="email" value={Email} onChange={onEmail} className="input-form-top" placeholder="이메일" required />
        <button type="click" className="check-btn" onClick={onEmailClick} value={emailCheck}>
          코드 전송
        </button>
      </div>
      <p></p>

      <input type="code" value={Code} onChange={onCode} className="input-form" placeholder="인증코드" required />
      <button className="check-btn" onClick={onCodeClick} value={codeCheck}>
        인증하기
      </button>

      <p></p>
      <input
        type="password"
        value={Password}
        onChange={onPassword}
        className="input-form"
        placeholder="비밀번호"
        required
      />
      {pwVisible ? <span>* 8 ~ 12자의 비밀번호를 입력해야 합니다.</span> : <p></p>}
      <input
        type="password"
        value={ConfirmPassword}
        onChange={onConfirmPassword}
        className="input-form"
        placeholder="비밀번호 확인"
        required
      />
      {pwcheckVisible ? <span>* 비밀번호가 일치하지 않습니다.</span> : <p></p>}
      <input type="text" value={Name} onChange={onName} className="input-form" placeholder="이름" required />
      <p></p>
      <input type="text" value={Nickname} onChange={onNickname} className="input-form" placeholder="닉네임" required />
      <button className="check-btn" onClick={onNickCheck}>
        중복 확인
      </button>
      {nickVisible ? <span>* 최대 10자의 닉네임을 사용할 수 있습니다.</span> : <p></p>}
      {possible && <span>* 사용할 수 있는 닉네임 입니다.</span>}
      {impossible && <span>* 중복되는 닉네임 입니다.</span>}
      {/* <p></p> */}
      <input type="date" value={Date} onChange={onDate} className="input-form" placeholder="생년월일" required />
      <p></p>
      <div className="check-box">
        <p className="gender">성별</p>
        <fieldset>
          <label>
            <input type="radio" value="female" name="gender" onClick={onGender} />
            여자
          </label>
          <label>
            <input type="radio" value="male" name="gender" onClick={onGender} />
            남자
          </label>
          <label>
            <input type="radio" value="" name="gender" onClick={onGender} />
            선택 X
          </label>
        </fieldset>
      </div>
      <button onClick={onSubmit} className="accept">
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
      <div className="Signup-all">
        <Form></Form>
      </div>
    </div>
  );
}

export default Signup;
