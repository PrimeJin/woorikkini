package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.MemoryCreateFormDto;
import com.ssafy.kkini.dto.UserCreateFormDto;
import com.ssafy.kkini.entity.Memory;
import com.ssafy.kkini.entity.Photo;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.MemoryRepository;
import com.ssafy.kkini.repository.PhotoRpository;
import com.ssafy.kkini.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestPropertySource(locations = "classpath:application-test.yml")
class MemoryServiceTest {
    @InjectMocks
    MemoryService memoryService;
    @Mock
    MemoryRepository memoryRepository;
    @Mock
    PhotoRpository photoRpository;
    @Mock
    UserRepository userRepository;

    @Value("{upload.path}")
    private String fileDir;

    @DisplayName("Memory create TEST")
    @Test
    void createTest() throws IOException {
        //given
//        URL resource1 = getClass().getResource("src\\Image1.jpg");
//        URL resource2 = getClass().getResource("src\\Image2.png");
        String path1 = "C:\\workplace\\Common_Project\\MyPage_CRUD\\backend\\src\\test\\java\\com\\ssafy\\kkini\\src\\Image1.jpg";
        String path2 = "C:\\workplace\\Common_Project\\MyPage_CRUD\\backend\\src\\test\\java\\com\\ssafy\\kkini\\src\\Image2.png";
        MockMultipartFile uploadFile1 = new MockMultipartFile("file1", "Image1.jpg","image/jpg",new FileInputStream(new File(path1)));
        MockMultipartFile uploadFile2 = new MockMultipartFile("file2", "Image2.png","image/png",new FileInputStream(new File(path2)));

        List<MultipartFile> arrayList = new ArrayList<>();
        arrayList.add(uploadFile1);
        arrayList.add(uploadFile2);

        UserCreateFormDto userCreateFormDto = new UserCreateFormDto(
                "여민지"
                ,"minji@naver.com"
                ,"1234"
                ,"밍"
                ,"F"
                ,19980901);
//        User user = userCreateFormDto.toEntity();
        MemoryCreateFormDto memoryCreateFormDto = new MemoryCreateFormDto("오늘 식단", "성공적", 2L, arrayList);
        Memory memory = memoryCreateFormDto.toEntity();
        Optional<User> user = Optional.ofNullable(userCreateFormDto.toEntity());
        when(userRepository.findAllByUserId(any())).thenReturn(user);
        when(memoryRepository.save(any())).thenReturn(memory);

        //when
        Memory result = memoryService.createMemory(memoryCreateFormDto);

        //then
        Assertions.assertThat(memory.getMemoryTitle()).isEqualTo(result.getMemoryTitle());

    }

    @DisplayName("photo create TEST")
    @Test
    void createPhoto() throws IOException {
        //given
        String path1 = "C:\\workplace\\Common_Project\\MyPage_CRUD\\backend\\src\\test\\java\\com\\ssafy\\kkini\\src\\Image1.jpg";
        String path2 = "C:\\workplace\\Common_Project\\MyPage_CRUD\\backend\\src\\test\\java\\com\\ssafy\\kkini\\src\\Image2.png";
        MockMultipartFile uploadFile1 = new MockMultipartFile("file1", "Image1.jpg","image/jpg",new FileInputStream(new File(path1)));
        MockMultipartFile uploadFile2 = new MockMultipartFile("file2", "Image2.png","image/png",new FileInputStream(new File(path2)));

        List<MultipartFile> arrayList = new ArrayList<>();
        arrayList.add(uploadFile1);
        arrayList.add(uploadFile2);

        MemoryCreateFormDto memoryCreateFormDto = new MemoryCreateFormDto("오늘 식단", "성공적", 2L, arrayList);
        Memory memory = memoryCreateFormDto.toEntity();

        //when
        ArrayList<Photo> result = memoryService.uploadPhoto(arrayList,memory);

        //then
        System.out.println(result.size());
        Assertions.assertThat(result.size()).isEqualTo(arrayList.size());
    }

    Photo makePhotoEntity(ArrayList<MultipartFile> photoList, Memory memory){
        // 년/월/일 폴더의 생성으로 한 폴더에 너무 많은 파일이 들어가지 않도록 제어
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String str = dateFormat.format(date);
        String uploadFolderPath = str.replace("-", File.separator);
        //폴더 생성
        File uploadPath = new File(fileDir, uploadFolderPath); // 오늘 날짜의 경로를 문자열로 생성
        if (uploadPath.exists() == false) {
            uploadPath.mkdirs();
        }

        ArrayList<Photo> phoroList = new ArrayList<>();
        for (MultipartFile uploadFile : photoList) {
            String originFileName = uploadFile.getOriginalFilename();
            // 파일의 확장자 추출
            String originalFileExtension;
            String contentType = uploadFile.getContentType();

            // 확장자명이 존재하지 않을 경우 처리 x
            if(ObjectUtils.isEmpty(contentType)) {
                break;
            }
            else {  // 확장자가 jpeg, png인 파일들만 받아서 처리
                if(contentType.contains("image/jpeg"))
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
            photo.setFilePath(uploadFolderPath + new_file_name);
            photo.setOriginalFilename(originFileName);
    }

}