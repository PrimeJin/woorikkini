package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.AuthCodeCreateDto;
import com.ssafy.kkini.dto.AuthCodeUpdateDto;
import com.ssafy.kkini.entity.AuthCode;
import com.ssafy.kkini.repository.AuthCodeRepository;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthCodeService {
    private EncryptService encryptService;
    private AuthCodeRepository authCodeRepository;
    private UserRepository userRepository;

    public AuthCodeService(EncryptService encryptService, AuthCodeRepository authCodeRepository, UserRepository userRepository) {
        this.encryptService = encryptService;
        this.authCodeRepository = authCodeRepository;
        this.userRepository = userRepository;
    }
    public String getAuthCodeContent(String email) {
        return encryptService.encryptMD5(email + LocalDateTime.now()).substring(0,6);
    }

    //코드 일치여부 확인하기 위해 코드내용으로 일치하는 인증코드 찾기
    public AuthCode getCodeByCodeContent(String codeContent) {
        return authCodeRepository.findFirstByAuthCodeContentOrderByCreatedTimeDesc(codeContent);
    }

    //코드 사용여부 확인하기 위해 유저이메일로 일치하는 인증코드 찾기
    public AuthCode getCodeByUserEmail(String email) {
        return authCodeRepository.findFirstByAuthCodeUserEmailOrderByCreatedTimeDesc(email);
    }

    @Transactional
    //회원가입시 인증코드 발송할 때 인증코드 생성
    public AuthCode createAuthCode(String email) {
        String authCodeContent = this.getAuthCodeContent(email);  //인증코드 내용 가져오기
        LocalDateTime authCodeExpireDate = LocalDateTime.now().plusHours(1);  //지금으로부터 1시간 뒤로 코드만료 시간설정

        AuthCodeCreateDto authCodeCreateDto = new AuthCodeCreateDto();
        authCodeCreateDto.setAuthCodeContent(authCodeContent);
        authCodeCreateDto.setAuthCodeExpireDate(authCodeExpireDate);
        authCodeCreateDto.setAuthCodeUseYn("N");
        authCodeCreateDto.setAuthCodeUserEmail(email);
        AuthCode authCode = authCodeCreateDto.toEntity();

        return authCodeRepository.save(authCode);
    }

    @Transactional
    //인증코드 사용처리 (N->Y)
    public void useAuthCode(AuthCode authCode) {
        AuthCodeUpdateDto authCodeUpdateDto = new AuthCodeUpdateDto(authCode);
        authCodeUpdateDto.setAuthCodeUseYn("Y");  //사용 처리

        authCodeRepository.save(authCodeUpdateDto.toEntity());
    }

    //인증코드 만료여부 체크(만료 - true, 유효 - false)
    public boolean checkExpireAuthCode(AuthCode authCode) {
        //만료 O
        if(authCode.getAuthCodeUseYn().equals("Y")
        || authCode.getAuthCodeExpireDate().isBefore(LocalDateTime.now())) {
            return true;
        }  else {  //만료 X
            return false;
        }
    }
}
