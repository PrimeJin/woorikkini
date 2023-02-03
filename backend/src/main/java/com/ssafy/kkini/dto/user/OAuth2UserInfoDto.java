package com.ssafy.kkini.dto.user;

import com.ssafy.kkini.entity.User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;

public interface OAuth2UserInfoDto {
    String getEmail();
    String getNickName();
    String getName();
    int getBirthYear();
    String getGender();
    String getProviderId();
    String getProvider();
    User toEntity(OAuth2UserRequest oAuth2UserRequest);
}
