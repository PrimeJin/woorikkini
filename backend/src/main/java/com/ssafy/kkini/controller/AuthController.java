package com.ssafy.kkini.controller;


import com.nimbusds.oauth2.sdk.util.StringUtils;
import com.ssafy.kkini.config.AppProperties;
import com.ssafy.kkini.entity.RefreshToken;
import com.ssafy.kkini.repository.RefreshTokenRepository;
import com.ssafy.kkini.repository.UserRepository;
import com.ssafy.kkini.service.TokenProviderService;
import com.ssafy.kkini.util.CookieUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Date;
import java.util.Map;


//흐름: 프론트에서 소셜로그인 요청 -> 백엔드에서 소셜로그인 창 제공 -> 사용자가 로그인 정보 입력 -> 인증 서버에서 코드 생성해서 백엔드로 리다이렉트
// -> 백엔드에서 코드를 받아 인증 서버로 액세스 토큰 요청 -> 인증 서버에서 액세스 토큰 생성해서 백엔드로 리다이렉트 -> 백엔드는 액세스 토큰 이용하여 리소스 서버에 사용자 정보 요청
// -> 반환 받은 사용자 정보를 이용하여 신규회원인지 확인 -> 신규회원이면 DB에 회원 등록 -> JWT 반환,
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final static long THREE_DAYS_MSEC = 1000 * 60 * 60 * 24 * 3;
    private final static String REFRESH_TOKEN = "refresh_token";

    private final AuthenticationManager authenticationManager;
    private final AppProperties appProperties;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final TokenProviderService tokenProvider;

    @GetMapping(value = "token")
    public String token(@RequestParam String token, @RequestParam(value = "error", required = false) String error) {
        if (StringUtils.isNotBlank(error)) {
            return error;
        } else {
            return token;
        }
    }

    //소셜 로그인이 아닌 일반 로그인을 했을 때
//    @PostMapping("/login")
//    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
//
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        loginRequest.getEmail(),
//                        loginRequest.getPassword()
//                )
//        );
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        String token = tokenProvider.createToken(authentication);
//        return ResponseEntity.ok(new AuthResponse(token));
//    }

    @PostMapping("/refresh")
    public String refreshToken (HttpServletRequest request, HttpServletResponse response, @Valid @RequestBody Map<String, String> requestBody) {
        // 사용자에게 받은 refresh token 검증
        String userRefreshToken = requestBody.get("refresh_token");
        if (!tokenProvider.validateToken(userRefreshToken)) {
            return "user refresh token fail";
        }

        // 사용자에게 받은 refresh token 검증
        RefreshToken refreshToken = refreshTokenRepository.findByRefreshToken(userRefreshToken);
        if (refreshToken == null) {
            return "refresh token fail";
        }
        // 새로운 access token 생성
        String newAccessToken = tokenProvider.createToken(refreshToken.getUserId(), "ROLE_USER");
        long validTime = tokenProvider.getTokenClaims(userRefreshToken).getExpiration().getTime() - new Date().getTime();

        // refresh 토큰 기간이 3일 이하로 남은 경우, refresh 토큰 갱신
        if (validTime <= THREE_DAYS_MSEC) {
            // refresh 토큰 설정
            long refreshTokenExpiry = appProperties.getAuth().getRefreshTokenExpiry();

            String newRefreshToken = tokenProvider.createToken();

            // DB에 refresh 토큰 업데이트
            refreshToken.setRefreshToken(newRefreshToken);
            refreshTokenRepository.save(refreshToken);

            int cookieMaxAge = (int) refreshTokenExpiry / 60;
            CookieUtils.deleteCookie(request, response, REFRESH_TOKEN);
            CookieUtils.addCookie(response, REFRESH_TOKEN, newRefreshToken, cookieMaxAge);

            return "success======access token : " + newAccessToken + "/// refresh token : " + newRefreshToken;
        }
        return "success======access token : " + newAccessToken;
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
