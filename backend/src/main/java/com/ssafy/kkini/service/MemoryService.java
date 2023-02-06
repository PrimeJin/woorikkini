package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.MemoryCreateFormDto;
import com.ssafy.kkini.dto.MemoryUpdateFormDto;
import com.ssafy.kkini.entity.Memory;
import com.ssafy.kkini.entity.Photo;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.MemoryRepository;
import com.ssafy.kkini.repository.PhotoRepository;
import com.ssafy.kkini.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class MemoryService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    MemoryRepository memoryRepository;
    @Autowired
    PhotoRepository photoRepository;

    @Value("{upload.path}")
    private String fileDir;

    public List<Memory> getMemory(int userId) {
        return memoryRepository.findByUser_UserId(userId);
    }

    public Memory createMemory(MemoryCreateFormDto memoryCreateFormDto) throws IOException {
        User user = userRepository.findByUserId(memoryCreateFormDto.getUserId());
        Memory memory = memoryCreateFormDto.toEntity();
        if(user != null){
            memory.setUser(user);
            Memory createMemory = memoryRepository.save(memory);

            if(createMemory != null && memoryCreateFormDto.getMemoryImgFiles() != null && !memoryCreateFormDto.getMemoryImgFiles().isEmpty() ){
                uploadPhoto(memoryCreateFormDto.getMemoryImgFiles(),createMemory);
            }
            return createMemory;
        }else {
            return null;
        }
    }


    public Memory updateMemory(MemoryUpdateFormDto memoryUpdateFormDto) throws IOException {
        Optional<Memory> memory = memoryRepository.findByMemoryId(memoryUpdateFormDto.getMemoryId());
        User user = userRepository.findByUserId(memoryUpdateFormDto.getUserId());
        if(memory.isPresent() && user != null){
            Memory updateMemory = memoryUpdateFormDto.toEntity();
            updateMemory.setUser(user);
            updateMemory = memoryRepository.save(updateMemory);
            if(updateMemory != null){
                deletePhoto(memoryUpdateFormDto.getMemoryId());
                uploadPhoto(memoryUpdateFormDto.getMemoryImgFiles(),updateMemory);
            }
            return updateMemory;
        }else{
            return null;
        }
    }

    @Transactional
    public ArrayList<Photo> uploadPhoto(List<MultipartFile> memoryImgFiles, Memory memory) throws IllegalStateException, IOException {

        // 년/월/일 폴더의 생성으로 한 폴더에 너무 많은 파일이 들어가지 않도록 제어
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String str = dateFormat.format(date);
        String uploadFolderPath = str.replace("-", File.separator);
        //폴더 생성
        String hostname = InetAddress.getLocalHost().getHostName();
        File uploadPath = null;
        if(hostname. substring(0, 7).equals ("DESKTOP") ) uploadPath = new File(fileDir, uploadFolderPath); // 오늘 날짜의 경로를 문자열로 생성
        else uploadPath = new File("\\images\\",uploadFolderPath);
        if (uploadPath.exists() == false) {
            uploadPath.mkdirs();
        }

        ArrayList<Photo> photoList = new ArrayList<>();
        for (MultipartFile uploadFile : memoryImgFiles) {
            String originFileName = uploadFile.getOriginalFilename();
            // 파일의 확장자 추출
            String originalFileExtension;
            String contentType = uploadFile.getContentType();

            // 확장자명이 존재하지 않을 경우 처리 x
            if(contentType == null) {
                break;
            }
            else {  // 확장자가 jpeg, png인 파일들만 받아서 처리
                if(contentType.contains("image/jpg"))
                    originalFileExtension = ".jpg";
                else if(contentType.contains("image/jpeg"))
                    originalFileExtension = ".jpeg";
                else if(contentType.contains("image/png"))
                    originalFileExtension = ".png";
                else  // 다른 확장자일 경우 처리 x
                    break;
            }

            // 파일명 중복 피하고자 나노초까지 얻어와 지정
            String new_file_name = System.nanoTime() + originalFileExtension;

            Photo photo = new Photo();
            photo.setMemory(memory);
            photo.setFilePath(uploadFolderPath + new_file_name);
            photo.setOriginalFilename(originFileName);

            photoList.add(photoRepository.save(photo));
            // 업로드 한 파일 데이터를 지정한 파일에 저장
            File file = new File(uploadFolderPath + new_file_name);
            try {
                uploadFile.transferTo(file);
            }catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return photoList;
    }

    @Transactional
    public void deletePhoto(int memoryId){
        List<Photo> photoList = photoRepository.findAllByMemory_MemoryId(memoryId);
        if(!photoList.isEmpty() && photoList.size() != 0){
            for (Photo photo : photoList) {
                //현재 게시판에 존재하는 파일객체를 만듬
                File file = new File(photo.getFilePath());

                if(file.exists()) { // 파일이 존재하면
                    file.delete(); // 파일 삭제
                }
                photoRepository.deleteByPhotoId(photo.getPhotoId());
            }

        }

    }


    public int deleteMemory(int memoryId) {
        Optional<Memory> deleteMemory = memoryRepository.findByMemoryId(memoryId);
        if(deleteMemory.isPresent()){
            deletePhoto(memoryId);
            memoryRepository.delete(deleteMemory.get());
            return 1;
        }
        return 0;
    }
}
