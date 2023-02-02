package com.ssafy.kkini.dto.user;

import com.ssafy.kkini.dto.AuthProvider;
import com.ssafy.kkini.exception.OAuth2AuthenticationProcessingException;

import java.util.Map;


// 어떤 소셜로그인 사용자인지 확인
public class OAuth2UserInfoFactory {

    public static OAuth2UserInfoDto getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if(registrationId.equalsIgnoreCase(AuthProvider.google.toString())) {
            return new GoogleUserInfoDto(attributes);
        } else if (registrationId.equalsIgnoreCase(AuthProvider.naver.toString())) {
            return new NaverUserInfoDto(attributes);
        } else if (registrationId.equalsIgnoreCase(AuthProvider.kakao.toString())) {
            return new KakaoUserInfoDto(attributes);
        } else {
            throw new OAuth2AuthenticationProcessingException("Sorry! Login with " + registrationId + " is not supported yet.");
        }
    }
}
