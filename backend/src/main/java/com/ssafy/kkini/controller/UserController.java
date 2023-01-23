package com.ssafy.kkini.controller;



import com.ssafy.kkini.dto.UserPrincipalDto;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('ADMIN')")
    public String getCurrentUser(UserPrincipalDto userPrincipalDto) {
        System.out.println(userPrincipalDto);
        return "hihi";

//        return userRepository.findByEmailAndProviderId(userPrincipal.getUsername(), userPrincipal.getUser().getProvider().toString())
//                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getName()));
    }
}
