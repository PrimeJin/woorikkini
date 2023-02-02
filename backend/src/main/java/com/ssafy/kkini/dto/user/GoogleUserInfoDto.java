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
        return getProvider() + "_" + getProviderId();
    }

    @Override
    public String getName() {
        StringBuilder sb = new StringBuilder();
        sb.append(attributes.get("name"));
        return sb.toString();
    }

    @Override
    public int getBirthYear() {
        return 0;
    }

    @Override
    public String getGender() {
        return null;
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
                .userProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))
                .userProviderId(getProviderId())
                .build();
    }
}
