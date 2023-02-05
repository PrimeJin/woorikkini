package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.PasswordCode;
import com.ssafy.kkini.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordCodeRepository extends JpaRepository<PasswordCode, Integer>  {
    PasswordCode findFirstByUserOrderByCreatedTimeDesc(User user);  //유저정보로 가장최근 생성된 인증코드찾기

}
