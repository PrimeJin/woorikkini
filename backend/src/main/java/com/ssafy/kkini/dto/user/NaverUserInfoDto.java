package com.ssafy.kkini.dto.user;

import java.util.Map;

public class NaverUserInfoDto implements OAuth2UserInfoDto {
    private Map<String, Object> attributes;

    public NaverUserInfoDto(Map<String, Object> attributes) {
        this.attributes = (Map) attributes.get("response");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getNickName() {
        return (String) attributes.get("nickname");
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public int getBirthYear() {
        return Integer.valueOf((String) attributes.get("birthyear"));
    }

    @Override
    public String getGender() {
        return (String) attributes.get("gender");
    }

    @Override
    public String getProviderId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getProvider() {
        return "naver";
    }
}
