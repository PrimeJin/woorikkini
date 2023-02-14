package com.ssafy.kkini.controller;


import com.ssafy.kkini.entity.RefreshToken;
import com.ssafy.kkini.repository.RefreshTokenRepository;
import com.ssafy.kkini.service.TokenProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


//흐름: 프론트에서 소셜로그인 요청 -> 백엔드에서 소셜로그인 창 제공 -> 사용자가 로그인 정보 입력 -> 인증 서버에서 코드 생성해서 백엔드로 리다이렉트
// -> 백엔드에서 코드를 받아 인증 서버로 액세스 토큰 요청 -> 인증 서버에서 액세스 토큰 생성해서 백엔드로 리다이렉트 -> 백엔드는 액세스 토큰 이용하여 리소스 서버에 사용자 정보 요청
// -> 반환 받은 사용자 정보를 이용하여 신규회원인지 확인 -> 신규회원이면 DB에 회원 등록 -> JWT 반환,
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final static long THREE_DAYS_MSEC = 1000 * 60 * 60 * 24 * 3;
    private static final String MESSAGE = "message";
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenProviderService tokenProvider;

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken (@Valid @RequestBody Map<String, String> requestBody) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();

        // 사용자에게 받은 refresh token 유효성 검증
        String userRefreshToken = requestBody.get("refreshToken");
        try{
            tokenProvider.validateToken(userRefreshToken);
        } catch (Exception ex){
            resultMap.put(MESSAGE, "accessToken " + ex.getMessage());
            status = HttpStatus.UNAUTHORIZED;
            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }


        // 사용자에게 받은 refresh token 존재 여부 검증
        RefreshToken refreshToken = refreshTokenRepository.findByRefreshToken(userRefreshToken);
        if (refreshToken == null) {
            status = HttpStatus.UNAUTHORIZED;
            resultMap.put(MESSAGE, FAIL);
            resultMap.put("result", "정지된 회원");
            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }
        // 새로운 access token 생성
        String newAccessToken = tokenProvider.createAccessToken(refreshToken.getUser().getUserId(), "ROLE_USER");
        resultMap.put("accessToken", newAccessToken);
        long validTime = tokenProvider.getTokenClaims(userRefreshToken).getExpiration().getTime() - new Date().getTime();
        // refresh 토큰 기간이 3일 이하로 남은 경우, refresh 토큰 갱신
        if (validTime <= THREE_DAYS_MSEC) {
            // refresh 토큰 설정
            String newRefreshToken = tokenProvider.createRefreshToken();

            // DB에 refresh 토큰 업데이트
            refreshTokenRepository.save(new RefreshToken(refreshToken.getUser(), newRefreshToken));

            status = HttpStatus.OK;
            resultMap.put("refreshToken", newRefreshToken);
            resultMap.put(MESSAGE, SUCCESS);
            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }
        status = HttpStatus.OK;
        resultMap.put(MESSAGE, SUCCESS);
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }
}
