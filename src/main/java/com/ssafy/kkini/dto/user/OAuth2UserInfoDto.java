package com.ssafy.kkini.dto.user;

public interface OAuth2UserInfoDto {
    String getEmail();
    String getNickName();
    String getName();
    int getBirthYear();
    String getGender();
    String getProviderId();
    String getProvider();
}
