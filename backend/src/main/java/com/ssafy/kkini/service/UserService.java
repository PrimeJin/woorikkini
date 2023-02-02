package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.UserCreateFormDto;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

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


}
