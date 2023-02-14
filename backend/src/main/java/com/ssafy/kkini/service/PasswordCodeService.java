package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.PasswordCodeCreateDto;
import com.ssafy.kkini.dto.PasswordCodeUpdateDto;
import com.ssafy.kkini.entity.PasswordCode;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.PasswordCodeRepository;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordCodeService {
    private EncryptService encryptService;
    private PasswordCodeRepository passwordCodeRepository;
    private UserRepository userRepository;

    public PasswordCodeService(EncryptService encryptService, PasswordCodeRepository passwordCodeRepository, UserRepository userRepository) {
        this.encryptService = encryptService;
        this.passwordCodeRepository = passwordCodeRepository;
        this.userRepository = userRepository;
    }

    //입력한 이메일과 이름이 찾으려는 유저정보와 일치하는지 검사
    public boolean checkEmailAndName(String userEmail, String userName) {
        Optional<User> user = userRepository.findByUserEmail(userEmail);
        if(user.isPresent()) {
            if(user.get().getUserName().equals(userName)) {
                return true;
            }
        }
        return false;
    }

    //비밀번호 코드값 부여
    public String getPasswordCodeContent(String email) {
        return encryptService.encryptMD5(email + LocalDateTime.now()).substring(0,6);
    }

    @Transactional
    //비밀번호 코드 생성
    public PasswordCode createPasswordCode(String email) {
        Optional<User> user = userRepository.findByUserEmail(email);
        PasswordCode passwordCode = null;
        if(user.isPresent()) {
            String passwordCodeContent = this.getPasswordCodeContent(email);  //인증코드 내용 가져오기
            LocalDateTime passwordCodeExpireDate = LocalDateTime.now().plusHours(1);  //지금으로부터 1시간 뒤로 코드만료 시간설정
            PasswordCodeCreateDto passwordCodeCreateDto = new PasswordCodeCreateDto();
            passwordCodeCreateDto.setPasswordCodeContent(passwordCodeContent);
            passwordCodeCreateDto.setPasswordCodeExpireDate(passwordCodeExpireDate);
            passwordCodeCreateDto.setPasswordCodeUseYn("N");
            passwordCodeCreateDto.setUser(user.get());

            passwordCode = passwordCodeCreateDto.toEntity();
        }

        return passwordCodeRepository.save(passwordCode);
    }

    //코드 사용여부 확인하기 위해 유저이메일로 일치하는 비밀번호코드 찾기
    public PasswordCode getCodeByUserEmail(String email) {
        Optional<User> user = userRepository.findByUserEmail(email);
        User userEntity = null;
        if(user.isPresent()) {
            userEntity = user.get();
        }
        return passwordCodeRepository.findFirstByUserOrderByCreatedTimeDesc(userEntity);
    }

    @Transactional
    //비밀번호코드 사용처리 (N->Y)
    public void usePasswordCode(PasswordCode passwordCode) {
        PasswordCodeUpdateDto passwordCodeUpdateDto = new PasswordCodeUpdateDto(passwordCode);
        passwordCodeUpdateDto.setPasswordCodeUseYn("Y");  //사용 처리

        passwordCodeRepository.save(passwordCodeUpdateDto.toEntity());
    }

    //비밀번호코드 만료여부 체크(만료 - true, 유효 - false)
    public boolean checkExpirePasswordCode(PasswordCode passwordCode) {
        //만료 O
        if(passwordCode.getPasswordCodeUseYn().equals("Y")
                || passwordCode.getPasswordCodeExpireDate().isBefore(LocalDateTime.now())) {
            return true;
        }  else {  //만료 X
            return false;
        }
    }
}
