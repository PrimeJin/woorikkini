package com.ssafy.kkini.service;



import com.ssafy.kkini.dto.AuthProvider;
import com.ssafy.kkini.dto.UserPrincipalDto;
import com.ssafy.kkini.dto.user.OAuth2UserInfoDto;
import com.ssafy.kkini.dto.user.OAuth2UserInfoFactory;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.exception.OAuth2AuthenticationProcessingException;
import com.ssafy.kkini.repository.UserRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Optional;

@Service
@Getter
public class CommonOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfoDto oAuth2UserInfo) {
        LocalDate currentLocalDateTime = LocalDate.now();
        User user = User.builder()
                .name(oAuth2UserInfo.getName())
                .email(oAuth2UserInfo.getEmail())
                .role("ROLE_USER")
                .nickname(oAuth2UserInfo.getNickName())
                .birthYear(oAuth2UserInfo.getBirthYear())
                .gender(oAuth2UserInfo.getGender())
                .activation(Timestamp.valueOf(currentLocalDateTime.atStartOfDay()))
                .joinDate(Timestamp.valueOf(currentLocalDateTime.atStartOfDay()))
                .provider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))
                .providerId(oAuth2UserInfo.getProviderId())
                .build();
        return userRepository.save(user);
    }

    protected OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfoDto oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        System.out.println(oAuth2UserInfo.getEmail());
        if(StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmailAndProviderId(oAuth2UserInfo.getEmail(), oAuth2UserInfo.getProviderId());
        User user = null;
        if(userOptional.isPresent()) {
            user = userOptional.get();
            if(!user.getProvider().equals(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getProvider() + " account. Please use your " + user.getProvider() +
                        " account to login.");
            }
//            user = updateExistingUser(user, oAuth2UserInfo);
        }
        else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return new UserPrincipalDto(user, oAuth2User.getAttributes());
    }

}
