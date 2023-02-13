package com.ssafy.kkini.dto.user;

import com.ssafy.kkini.dto.AuthProvider;
import com.ssafy.kkini.entity.User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;

import java.util.Date;
import java.util.Map;

public class KakaoUserInfoDto implements OAuth2UserInfoDto {

    private Map<String, Object> attributes;
    private Map<String, Object> kakaoAccount;
    private Map<String, Object> kakaoProfile ;

    public KakaoUserInfoDto(Map<String, Object> attributes) {
        this.attributes = attributes;
        this.kakaoAccount = (Map) attributes.get("kakao_account");
        this.kakaoProfile = (Map) kakaoAccount.get("profile");
    }

    @Override
    public String getEmail() {
        return (String) kakaoAccount.get("email");
    }

    @Override
    public String getNickName() {
        return new StringBuilder().append(getProvider()).append("_").append(getProviderId()).toString();
    }

    @Override
    public String getName() {
        String name = (String) kakaoProfile.get("nickname");
        if(name == null) return "";
        else return name;
    }

    @Override
    public int getBirthYear() {
        return  0;
    }

    @Override
    public String getGender() {
        String gender = (String) kakaoAccount.get("gender");
        if(gender == null) return "";
        else return gender.toLowerCase();
    }

    @Override
    public String getProviderId() {
        return (String) attributes.get("id").toString();
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    public User toEntity(OAuth2UserRequest oAuth2UserRequest){
        return User.builder()
                .userName(getName())
                .userEmail(getEmail())
                .userNickname(getNickName())
                .userBirthYear(getBirthYear())
                .userGender(getGender())
                .userProvider(AuthProvider.valueOf(getProvider()))
                .userProviderId(getProviderId())
                .build();
    }
}
