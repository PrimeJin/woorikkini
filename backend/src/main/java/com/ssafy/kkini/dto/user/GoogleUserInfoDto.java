package com.ssafy.kkini.dto.user;


import com.ssafy.kkini.dto.AuthProvider;
import com.ssafy.kkini.entity.User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;

import java.util.Map;

public class GoogleUserInfoDto implements OAuth2UserInfoDto {

    private Map<String, Object> attributes;

    public GoogleUserInfoDto(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getNickName() {
        return new StringBuilder().append(getProvider()).append("_").append(getProviderId()).toString();
    }

    @Override
    public String getName() {
        String name = (String) attributes.get("name");
        if(name == null) return "";
        else return name;
    }

    @Override
    public int getBirthYear() {
        return 0;
    }

    @Override
    public String getGender() {
        return "";
    }

    @Override
    public String getProviderId() {
        return (String) attributes.get("sub");
    }

    @Override
    public String getProvider() {
        return "google";
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
