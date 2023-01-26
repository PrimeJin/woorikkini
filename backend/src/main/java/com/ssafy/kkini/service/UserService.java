package com.ssafy.kkini.service;


import com.ssafy.kkini.dto.UserJoinFormDto;
import com.ssafy.kkini.dto.UserLoginFormDto;
import com.ssafy.kkini.dto.UserNicknameModifyFormDto;
import com.ssafy.kkini.dto.UserPasswordModifyFormDto;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.nio.file.OpenOption;
import java.util.Optional;


@Slf4j
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User join(UserJoinFormDto userJoinFormDto){
//        User user = new User.UserBuilder(userJoinFormDto).build();
        User user = User.builder().email(userJoinFormDto.getUserEmail())
                .gender(userJoinFormDto.getUserGender())
                .name(userJoinFormDto.getUserName())
                .nickname(userJoinFormDto.getUserNickname())
                .password(userJoinFormDto.getUserPassword())
                .role("ROLE_USER")
                .build();

        return userRepository.save(user);
    }

    public User login(UserLoginFormDto userLoginFormDto) {
        if (userLoginFormDto.getUserEmail() == null || userLoginFormDto.getUserPassword() == null) return null;
        Optional<User> user = userRepository.findByEmail(userLoginFormDto.getUserEmail());
        if(!user.isPresent() && user.get().getPassword() != userLoginFormDto.getUserPassword()) return null;
        else return user.get();
//        System.out.println(userLoginFormDto.getUserEmail() + " + " + userLoginFormDto.getUserPassword());
//        return userRepository.login(userLoginFormDto.getUserEmail(), userLoginFormDto.getUserPassword());
    }

    @Transactional
    public int delete(Long userid) {
        Optional<User> user = userRepository.findById(userid);
        if(user.isPresent()) {
            userRepository.delete(user.get());
            return 1;
        }
        return 0;
    }

    @Transactional
    public User nicknameModify(UserNicknameModifyFormDto userNicknameModifyFormDto) {
        User user = userRepository.findById(userNicknameModifyFormDto.getUserId()).get();
        if(user != null) {
            user.setNickname(userNicknameModifyFormDto.getUserNickname());
            return userRepository.save(user);
        }else return null;
    }

    @Transactional
    public User passwordModify(UserPasswordModifyFormDto userPasswordModifyFormDto) {
        User user = userRepository.findById(userPasswordModifyFormDto.getUserId()).get();
        if(user != null) {
            user.setPassword(userPasswordModifyFormDto.getUserPassword());
            return userRepository.save(user);
        }else return null;
    }
}

