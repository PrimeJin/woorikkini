package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.*;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private UserRepository userRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Transactional
    public User join(UserCreateFormDto userCreateFormDto){
        userCreateFormDto.setUserPassword(bCryptPasswordEncoder.encode(userCreateFormDto.getUserPassword()));
        User user = userCreateFormDto.toEntity();

        return userRepository.save(user);
    }

    public User login(UserLoginFormDto userLoginFormDto) {
        Optional<User> user = userRepository.findByUserEmailAndUserProviderIsNull(userLoginFormDto.getUserEmail());
        if(user.isPresent()){
            if(user.get().getUserActivation().isAfter(LocalDateTime.now())){
                throw new LockedException("Your Account is denied");
            }
            if(bCryptPasswordEncoder.matches(userLoginFormDto.getUserPassword(), user.get().getUserPassword())) return user.get();
        }
        return null;
    }

    @Transactional
    public int delete(int userid) {
        User user = userRepository.findByUserId(userid);
        if(user != null) {
            userRepository.delete(user);
            return 1;
        }
        return 0;
    }

    @Transactional
    public User nicknameModify(UserNicknameModifyFormDto userNicknameModifyFormDto) {
        User user = userRepository.findByUserId(userNicknameModifyFormDto.getUserId());
        if(user != null) {
            user.changeNickname(userNicknameModifyFormDto.getUserNickname());
            return userRepository.save(user);
        }else return null;
    }

    @Transactional
    public User passwordModify(UserPasswordModifyFormDto userPasswordModifyFormDto) {

        User user = userRepository.findByUserId(userPasswordModifyFormDto.getUserId());
        if(user != null) {
            user.changePassword(bCryptPasswordEncoder.encode(userPasswordModifyFormDto.getUserPassword()));
            return userRepository.save(user);
        }else return null;
    }

    public User nicknameCheck(String userNickname) {
        return userRepository.findByUserNickname(userNickname);
    }

    @Transactional
    public User updatePasswordByEmail(String email, String newPassword) {
        Optional<User> user = userRepository.findByUserEmail(email);
        if(user.isPresent()) {
            UserInfoDto userInfoDto = new UserInfoDto(user.get());
            userInfoDto.setUserPassword(bCryptPasswordEncoder.encode(newPassword));
            return userRepository.save(userInfoDto.toEntity());
        } else {
            return null;
        }
    }

    //관리자 전체회원 조회
    public List<UserListDto> getUserList() {
        List<User> userList = userRepository.findAll();
        List<UserListDto> userListDto = new ArrayList<>();

        for(User x : userList) {
            UserListDto userDto = new UserListDto();
            userDto.setUserId(x.getUserId());
            userDto.setUserName(x.getUserName());
            userDto.setUserNickname(x.getUserNickname());
            userDto.setUserEmail(x.getUserEmail());
            userDto.setUserBirthYear(x.getUserBirthYear());

            //성별 한글로 표시
            String gender;
            if(x.getUserGender().equals("male")) {
                gender = "남자";
            } else if(x.getUserGender().equals("female")) {
                gender = "여자";
            } else {
                gender = "선택안함";
            }

            userDto.setUserGender(gender);
            userDto.setCreatedTime(x.getCreatedTime());

            //활동 정지여부 표시
            if(x.getUserActivation().isAfter(LocalDateTime.now())) {
                userDto.setUserActivation("활동정지");
            }

            userListDto.add(userDto);
        }
        return userListDto;
    }
    //이메일 인증시 가입된 회원인지 확인하기 위한 메소드
    public Optional<User> getUserByUserEmail(String email) {
        return userRepository.findByUserEmail(email);
    }
}
