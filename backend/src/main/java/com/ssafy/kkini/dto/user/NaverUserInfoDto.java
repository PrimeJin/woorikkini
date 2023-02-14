package com.ssafy.kkini.dto.user;

import com.ssafy.kkini.dto.AuthProvider;
import com.ssafy.kkini.entity.User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;

import java.util.Date;
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
        return new StringBuilder().append(getProvider()).append("_").append(new Date().getTime()).toString();
    }

    @Override
    public String getName() {
        String name = (String) attributes.get("name");
        if(name == null) return "";
        else return name;
    }

    @Override
    public int getBirthYear() {
        return Integer.valueOf((String) attributes.get("birthyear") + ((String) attributes.get("birthday")).replace("-", ""));
    }

    @Override
    public String getGender() {
        String gender = (String) attributes.get("gender");
        if(gender.equals("F")){
            return "female";
        }
        else if(gender.equals("M")){
            return "male";
        }
        return "";
    }

    @Override
    public String getProviderId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getProvider() {
        return "naver";
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
