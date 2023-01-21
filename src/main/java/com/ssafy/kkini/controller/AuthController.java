package com.ssafy.kkini.controller;


import com.nimbusds.oauth2.sdk.util.StringUtils;
import com.ssafy.kkini.payload.AuthResponse;
import com.ssafy.kkini.payload.LoginRequest;
import com.ssafy.kkini.repository.UserRepository;
import com.ssafy.kkini.service.TokenProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


//흐름: 프론트에서 소셜로그인 요청 -> 백엔드에서 소셜로그인 창 제공 -> 사용자가 로그인 정보 입력 -> 인증 서버에서 코드 생성해서 백엔드로 리다이렉트
// -> 백엔드에서 코드를 받아 인증 서버로 액세스 토큰 요청 -> 인증 서버에서 액세스 토큰 생성해서 백엔드로 리다이렉트 -> 백엔드는 액세스 토큰 이용하여 리소스 서버에 사용자 정보 요청
// -> 반환 받은 사용자 정보를 이용하여 신규회원인지 확인 -> 신규회원이면 DB에 회원 등록 -> JWT 반환,
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private TokenProviderService tokenProvider;

    @GetMapping(value = "token")
    public String token(@RequestParam String token, @RequestParam(value = "error", required = false) String error) {
        if (StringUtils.isNotBlank(error)) {
            return error;
        } else {
            return token;
        }
    }

    //소셜 로그인이 아닌 일반 로그인을 했을 때
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.createToken(authentication);
        return ResponseEntity.ok(new AuthResponse(token));
    }

//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
//        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
//            throw new BadRequestException("Email address already in use.");
//        }
//
//        // Creating user's account
//        User user = new User();
//        user.setNickname(signUpRequest.getName());
//        user.setGender(signUpRequest.ge);
//        user.setEmail(signUpRequest.getEmail());
//        user.setPassword(signUpRequest.getPassword());
//        user.setProvider(AuthProvider.local);
//
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//
//        User result = userRepository.save(user);
//
//        URI location = ServletUriComponentsBuilder
//                .fromCurrentContextPath().path("/user/me")
//                .buildAndExpand(result.getId()).toUri();
//
//        return ResponseEntity.created(location)
//                .body(new ApiResponse(true, "User registered successfully@"));
//    }

}
