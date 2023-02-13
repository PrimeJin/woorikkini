package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.MemoryCreateFormDto;
import com.ssafy.kkini.dto.MemoryGetFormDto;
import com.ssafy.kkini.dto.MemoryUpdateFormDto;
import com.ssafy.kkini.entity.Memory;
import com.ssafy.kkini.entity.Photo;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.MemoryRepository;
import com.ssafy.kkini.repository.PhotoRepository;
import com.ssafy.kkini.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class MemoryService {
    private final UserRepository userRepository;
    private final MemoryRepository memoryRepository;
    private final PhotoRepository  photoRepository;

    @Value("${upload.path}")
    private String fileDir;

    private String parentDir;
    private static final Logger logger = LoggerFactory.getLogger(MemoryService.class);

    public MemoryService(UserRepository userRepository,MemoryRepository memoryRepository,PhotoRepository photoRepository){
        this.userRepository = userRepository;
        this.memoryRepository = memoryRepository;
        this.photoRepository = photoRepository;
    }

    public List<MemoryGetFormDto> getMemory(int userId) throws MalformedURLException {
        List<MemoryGetFormDto> memoryGetFormDtoList = new ArrayList<>();
        for (Memory memory : memoryRepository.findByUser_UserId(userId)) {
            MemoryGetFormDto memoryGetFormDto = new MemoryGetFormDto(memory);

            List<Photo> photoList = photoRepository.findAllByMemory_MemoryId(memory.getMemoryId());
            List<String> photoPathList = new ArrayList<>();

            for (Photo photo : photoList) {
                photoPathList.add(photo.getFilePath());
            }

            memoryGetFormDto.setPhotoPathList(photoPathList);
            memoryGetFormDtoList.add(memoryGetFormDto);
        }
        return memoryGetFormDtoList;
    }

    public Memory createMemory(MemoryCreateFormDto memoryCreateFormDto, List<MultipartFile> memoryImgFiles) throws IOException {
        User user = userRepository.findByUserId(Integer.parseInt(memoryCreateFormDto.getUserId()));
        Memory memory = memoryCreateFormDto.toEntity();
        if(user != null){
            memory.setUser(user);
            Memory createMemory = memoryRepository.save(memory);

            if(createMemory != null){
                if(memoryImgFiles != null && !memoryImgFiles.isEmpty()){
                    List<Photo> photoList =  uploadPhoto(memoryImgFiles,createMemory);
                    if(photoList.isEmpty()){
                        deleteMemory(createMemory.getMemoryId());
                        return null;
                    }
                }
                return createMemory;
            }
        }
        return null;
    }


    public Memory updateMemory(MemoryUpdateFormDto memoryUpdateFormDto, List<MultipartFile> memoryImgFiles) throws IOException {
        Memory memory = memoryRepository.findByMemoryId(Integer.parseInt(memoryUpdateFormDto.getMemoryId()));
        User user = userRepository.findByUserId(Integer.parseInt(memoryUpdateFormDto.getUserId()));

        if(memory != null && user != null){
            Memory updateMemory = memoryUpdateFormDto.toEntity();
            updateMemory.setUser(user);
            Memory newUpdateMemory =  memoryRepository.save(updateMemory);
            if(newUpdateMemory != null){
                logger.debug(String.valueOf(memoryUpdateFormDto.getPhotoPathList().size()));
                //기존 사진들에 대한 처리
                List<Photo> photoList = photoRepository.findAllByMemory_MemoryId(newUpdateMemory.getMemoryId());
                reUploadPhoto(memoryUpdateFormDto.getPhotoPathList(),photoList);

                //새로운 사진 저장이 있으면 저장
                if (memoryImgFiles != null && !memoryImgFiles.isEmpty()){
                    List<Photo> potoList = uploadPhoto(memoryImgFiles,newUpdateMemory);
                    logger.debug(String.valueOf(memoryImgFiles.size()));
                    //실패 시 추억 수정 실패
                    if (potoList.isEmpty()){
                        logger.debug("사진이 안들어와는데 왜 사이즈가 있냐고");
                        memoryRepository.save(memory);
                        for (Photo photo : photoList) {
                            photoRepository.save(photo);
                        }
                        return null;
                    }
                }

            }
            return newUpdateMemory;
        }else{
            return null;
        }
    }

    private void reUploadPhoto(List<String> photoPathList,List<Photo> photoList) {
        for (Photo photo : photoList) {
            if(photoPathList.isEmpty()){
                File file = new File(photo.getFilePath());

                if(file.exists()) { // 파일이 존재하면
                    file.delete(); // 파일 삭제
                }
                photoRepository.delete(photo);
            }
            for (int i = 0; i < photoPathList.size(); i++) {
                //기존 사진 그대로 들어온 경우
                if(photo.getFilePath().equals(photoPathList.get(i))){
                    break;
                }
                //사진이 삭제되어 수정됐을 떄
                if (i == photoPathList.size()-1) {
                    //현재 게시판에 존재하는 파일객체를 만듬
                    File file = new File(photo.getFilePath());

                    if(file.exists()) { // 파일이 존재하면
                        file.delete(); // 파일 삭제
                    }
                    photoRepository.delete(photo);
                }
            }
        }
    }

    @Transactional
    public ArrayList<Photo> uploadPhoto(List<MultipartFile> memoryImgFiles, Memory memory) throws IllegalStateException, IOException {

        // 년/월/일 폴더의 생성으로 한 폴더에 너무 많은 파일이 들어가지 않도록 제어
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String str = dateFormat.format(date);
        String uploadFolderPath = str.replace("-", File.separator);
        uploadFolderPath = uploadFolderPath + File.separator;
        //폴더 생성
        String hostname = InetAddress.getLocalHost().getHostName();

        if(hostname.substring(0, 7).equals ("DESKTOP") ) parentDir = fileDir;
        else if (hostname.contains("MacBookAir")) parentDir = fileDir;
        else parentDir = "./images";

        File uploadPath = new File(parentDir, uploadFolderPath); // 오늘 날짜의 경로를 문자열로 생성

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
                    originalFileExtension = ".jpg";
                else if(contentType.contains("image/png"))
                    originalFileExtension = ".png";
                else  // 다른 확장자일 경우 처리 x
                    break;
            }

            // 파일명 중복 피하고자 나노초까지 얻어와 지정
            String new_file_name = System.nanoTime() + originalFileExtension;

            Photo photo = new Photo();
            photo.setMemory(memory);
            photo.setFilePath("api/memory/images/" + uploadFolderPath + new_file_name);
            photo.setOriginalFilename(originFileName);

            photoList.add(photoRepository.save(photo));
            // 업로드 한 파일 데이터를 지정한 파일에 저장
            File file = new File(parentDir,uploadFolderPath + new_file_name);
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
        if(!photoList.isEmpty()){
            for (Photo photo : photoList) {
                //현재 게시판에 존재하는 파일객체를 만듬
                File file = new File(photo.getFilePath());

                if(file.exists()) { // 파일이 존재하면
                    file.delete(); // 파일 삭제
                }
                photoRepository.delete(photo);
            }
        }
    }
    public int deleteMemory(int memoryId) {
        Memory deleteMemory = memoryRepository.findByMemoryId(memoryId);
        if(deleteMemory != null){
            deletePhoto(memoryId);
            memoryRepository.delete(deleteMemory);
            return 1;
        }
        return 0;
    }
}
