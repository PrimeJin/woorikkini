package com.ssafy.kkini.dto.user;


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
}
