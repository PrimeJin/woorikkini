package com.ssafy.kkini.controller;



import com.ssafy.kkini.dto.UserJoinFormDto;
import com.ssafy.kkini.dto.UserLoginFormDto;
import com.ssafy.kkini.dto.UserPrincipalDto;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.UserRepository;
import com.ssafy.kkini.service.TokenProviderService;
import com.ssafy.kkini.service.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @Autowired
    private TokenProviderService tokenProviderService;

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    @GetMapping("/me")
    @PreAuthorize("hasRole('ADMIN')")
    public String getCurrentUser(UserPrincipalDto userPrincipalDto) {
        System.out.println(userPrincipalDto);
        return "hihi";

//        return userRepository.findByEmailAndProviderId(userPrincipal.getUsername(), userPrincipal.getUser().getProvider().toString())
//                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getName()));
    }

    @ApiOperation(value = "회원가입", notes = "회원가입", response = UserJoinFormDto.class)
    @PostMapping()
    public ResponseEntity<Map<String, Object>> join(@RequestBody @ApiParam(value = "회원가입 정보들", required = true, example  = "0") UserJoinFormDto userJoinFormDto, HttpServletResponse response ) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        User joinUser=null;

        try {
            joinUser = userService.join(userJoinFormDto);

            if(joinUser!=null){
                resultMap.put("message", SUCCESS);
                status = HttpStatus.ACCEPTED;
            }
            else {
                resultMap.put("message", FAIL);
                status = HttpStatus.BAD_REQUEST;
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "로그인", notes = "Access-token과 로그인 결과 메세지를 반환한다.", response = Map.class)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody @ApiParam(value = "로그인 시 필요한 회원정보(아이디, 비밀번호).", required = true, example  = "0") UserLoginFormDto userLoginFormDto) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try {
            User loginUser= userService.login(userLoginFormDto);
            if (loginUser != null) {
                String accessToken = tokenProviderService.createToken(loginUser.getId(), loginUser.getRole());// key, data
                String refreshToken = tokenProviderService.createToken();
                tokenProviderService.saveRefreshToken(loginUser.getId(), refreshToken);
                resultMap.put("access-token", accessToken);
                resultMap.put("refresh-token", refreshToken);
                resultMap.put("userNickname",loginUser.getNickname());
                resultMap.put("userId", loginUser.getId());
                resultMap.put("message", SUCCESS);
                status = HttpStatus.ACCEPTED;
            } else {
                resultMap.put("message", FAIL);
                status = HttpStatus.ACCEPTED;
            }
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "로그아웃", notes = "회원 정보를 담은 Token을 제거한다.", response = Map.class)
    @GetMapping("/logout/{userid}")
    public ResponseEntity<Map<String, Object>> logout(@PathVariable("userid") Long userid) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        try {
            tokenProviderService.deleteRefreshToken(userid);
            resultMap.put("message", SUCCESS);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            resultMap.put("message", FAIL);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);

    }

    @ApiOperation(value = "회원탈퇴", notes = "Access-token해제와 회원탈퇴 결과 메세지를 반환한다.", response = Map.class)
    @DeleteMapping("/{userid}")
    public ResponseEntity<Map<String, Object>> delete(
            @PathVariable("userid") @ApiParam(value = "탈퇴할 회원정보(아이디).", required = true, example  = "0") Long userid) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try {
            if (userService.delete(userid) > 0) {
                tokenProviderService.deleteRefreshToken(userid);
                resultMap.put("message", SUCCESS);
                status = HttpStatus.ACCEPTED;
            } else {
                resultMap.put("message", FAIL);
                status = HttpStatus.ACCEPTED;
            }
        } catch (Exception e) {
            resultMap.put("message", FAIL);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }
}
