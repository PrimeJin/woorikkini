package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.AuthCode;
import com.ssafy.kkini.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthCodeRepository extends JpaRepository<AuthCode, Integer> {
    AuthCode findFirstByAuthCodeContentOrderByCreatedTimeDesc(String authCodeContent);  //인증코드내용으로 가장최근 생성된 인증코드찾기
    AuthCode findFirstByAuthCodeUserEmailOrderByCreatedTimeDesc(String authCodeUserEmail);  //입력한 이메일로 가장최근 생성된 인증코드찾기
}
