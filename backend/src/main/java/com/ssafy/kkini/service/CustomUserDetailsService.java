package com.ssafy.kkini.service;



import com.ssafy.kkini.dto.UserPrincipalDto;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by rajeevkumarsingh on 02/08/17.
 */

//일반 사용자
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userId)
            throws UsernameNotFoundException {
        User user = userRepository.findAllByUserId(Integer.valueOf(userId))
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with user_id : " + userId)
        );

        return new UserPrincipalDto(user);
    }
}