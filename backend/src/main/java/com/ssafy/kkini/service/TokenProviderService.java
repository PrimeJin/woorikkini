package com.ssafy.kkini.service;

import com.ssafy.kkini.config.AppProperties;
import com.ssafy.kkini.dto.UserPrincipalDto;
import com.ssafy.kkini.entity.RefreshToken;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.exception.TokenValidFailedException;
import com.ssafy.kkini.repository.RefreshTokenRepository;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

//토큰 관리 관련 클래스
@Service
public class TokenProviderService {

    private static final Logger logger = LoggerFactory.getLogger(TokenProviderService.class);


    private AppProperties appProperties;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    UserDetailsService userDetailsService;
    public TokenProviderService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    /**
     * 소셜 로그인 토큰 생성
     * @author 나유현
     * @param authentication
     * @return
     *
     */
    //토큰 생성
    public String createToken(Authentication authentication) {

        UserPrincipalDto userPrincipal = (UserPrincipalDto) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());

        return Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setSubject(Long.toString(userPrincipal.getUser().getId()))
                .claim("role", userPrincipal.getUser().getRole())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret())
                .compact();
    }

    /**
     * 일반 로그인 토큰 생성
     * @author 나유현
     * @param userId
     * @param role
     * @return
     */
    public String createToken(Long userId, String role) {

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());

        return Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setSubject(Long.toString(userId))
                .claim("role", role)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret())
                .compact();
    }

    /**
     * @author 나유현
     * Refresh 토큰 생성
     * @return
     */
    public String createToken() {

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getRefreshTokenExpiry());

        return Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret())
                .compact();
    }

    /**
     * refresh token DB에 저장
     * @param userId
     * @param refreshToken
     */
    public void saveRefreshToken(Long userId, String refreshToken){

        RefreshToken oldRefreshToken = refreshTokenRepository.findByUserId(userId);
        if(oldRefreshToken == null) System.out.println("null");

        if(oldRefreshToken != null){
            oldRefreshToken.setRefreshToken(refreshToken);
        }else{
            oldRefreshToken = new RefreshToken(userId,refreshToken);
            refreshTokenRepository.saveAndFlush(oldRefreshToken);
        }
    }

    public void deleteRefreshToken(Long userId){
        RefreshToken refreshToken = refreshTokenRepository.findByUserId(userId);
        refreshToken.setRefreshToken(null);
        refreshTokenRepository.save(refreshToken);

    }

    public Claims getTokenClaims(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(appProperties.getAuth().getTokenSecret())
                .parseClaimsJws(token)
                .getBody();

        return claims;
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(appProperties.getAuth().getTokenSecret())
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public UsernamePasswordAuthenticationToken getAuthentication(String authToken) {

        if(validateToken(authToken)) {

            Claims claims = getTokenClaims(authToken);
            Collection<? extends GrantedAuthority> authorities =
                    Arrays.stream(new String[]{claims.get("role").toString()})
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

            UserDetails userDetails = userDetailsService.loadUserByUsername(getUserIdFromToken(authToken));

            return new UsernamePasswordAuthenticationToken(userDetails, authToken, authorities);
        } else {
            throw new TokenValidFailedException();
        }
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }
}
