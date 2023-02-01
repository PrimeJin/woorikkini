package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.UserCreateFormDto;
import com.ssafy.kkini.dto.UserJoinFormDto;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.TestPropertySource;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestPropertySource(locations = "classpath:application-test.yml")
class UserServiceTest {
    @InjectMocks
    UserService userService;
    @Mock
    UserRepository userRepository;

    @Nested
    @DisplayName("회원가입 TEST")
     class JoinTest {
        @Nested
        @DisplayName("성공 CASE")
        class SuccessTest{
            @Test
            @DisplayName("회원가입")
            void successJoin(){
                //given
                UserCreateFormDto userCreateFormDto = new UserCreateFormDto(
                        "여민지"
                        ,"minji@naver.com"
                        ,"1234"
                        ,"밍"
                        ,"F"
                ,19980901);
                User user = userCreateFormDto.toEntity();
                when(userRepository.save(any())).thenReturn(user);

                //when
                User result = userService.join(userCreateFormDto);

                //then
                Assertions.assertThat(user.getUserEmail()).isEqualTo(result.getUserEmail());
            }
        }

        @Nested
        @DisplayName("실패 CASE")
        class FailTest{
            @Test
            @DisplayName("회원가입")
            void failJoin(){
                UserJoinFormDto userJoinFormDto = UserJoinFormDto.builder()
                        .userName("여민지")
                        .userEmail("minji@naver.com")
                        .userNickname("밍")
                        .userPassword("1234")
                        .userGender("F")
                        .build();

            }
        }
    }
//
//    @Test
//    void login() {
//    }
//
//    @Test
//    void delete() {
//    }
//
//    @Test
//    void nicknameModify() {
//    }
//
//    @Test
//    void passwordModify() {
//    }
}