package com.ssafy.kkini.util;

import javax.servlet.http.HttpServletRequest;

//JWT 토큰을 요청에서 가져온다.
public class TokenUtils {
    public static String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (org.springframework.util.StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }
}
