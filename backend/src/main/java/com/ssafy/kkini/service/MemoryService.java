package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.MemoryCreateFormDto;
import com.ssafy.kkini.entity.Memory;
import com.ssafy.kkini.entity.Photo;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.MemoryRepository;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class MemoryService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    MemoryRepository memoryRepository;
    public Memory createMemory(MemoryCreateFormDto memoryCreateFormDto) {
        Optional<User> user = userRepository.findAllByUserId(memoryCreateFormDto.getUserId());
        Memory memory = memoryCreateFormDto.toEntity();
        memory.setUser(user.get());

        return memoryRepository.save(memory);
    }

//    public Photo createPhoto(MultipartFile memoryImgFile) {
//        String fullPath = fileDir + memoryImgFile.getOriginalFilename();
//    }
}
