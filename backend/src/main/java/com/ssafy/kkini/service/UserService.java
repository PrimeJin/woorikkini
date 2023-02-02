package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.UserCreateFormDto;
import com.ssafy.kkini.dto.UserLoginFormDto;
import com.ssafy.kkini.dto.UserNicknameModifyFormDto;
import com.ssafy.kkini.dto.UserPasswordModifyFormDto;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User createUser(UserCreateFormDto userCreateFormDto) {
        return userRepository.save(userCreateFormDto.toEntity());
    }

    @Transactional
    public User join(UserCreateFormDto userJoinFormDto){
        User user = userJoinFormDto.toEntity();

        return userRepository.save(user);
    }

    public User login(UserLoginFormDto userLoginFormDto) {
        if (userLoginFormDto.getUserEmail() == null || userLoginFormDto.getUserPassword() == null) return null;
        Optional<User> user = userRepository.findByUserEmail(userLoginFormDto.getUserEmail());
        if(!user.isPresent() && user.get().getUserPassword() != userLoginFormDto.getUserPassword()) return null;
        else return user.get();
//        System.out.println(userLoginFormDto.getUserEmail() + " + " + userLoginFormDto.getUserPassword());
//        return userRepository.login(userLoginFormDto.getUserEmail(), userLoginFormDto.getUserPassword());
    }

    @Transactional
    public int delete(int userid) {
        Optional<User> user = userRepository.findByUserId(userid);
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
            user.changeNickname(userNicknameModifyFormDto.getUserNickname());
            return userRepository.save(user);
        }else return null;
    }

    @Transactional
    public User passwordModify(UserPasswordModifyFormDto userPasswordModifyFormDto) {
        User user = userRepository.findByUserId(userPasswordModifyFormDto.getUserId()).get();
        if(user != null) {
            user.changePassword(userPasswordModifyFormDto.getUserPassword());
            return userRepository.save(user);
        }else return null;
    }

}
