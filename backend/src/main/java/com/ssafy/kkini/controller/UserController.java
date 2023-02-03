package com.ssafy.kkini.controller;

import com.ssafy.kkini.dto.UserCreateFormDto;
import com.ssafy.kkini.dto.UserLoginFormDto;
import com.ssafy.kkini.dto.UserNicknameModifyFormDto;
import com.ssafy.kkini.dto.UserPasswordModifyFormDto;
import com.ssafy.kkini.entity.AuthCode;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.service.AuthCodeService;
import com.ssafy.kkini.service.EmailService;
import com.ssafy.kkini.service.TokenProviderService;
import com.ssafy.kkini.service.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE})
public class UserController {
    private UserService userService;
    private AuthCodeService authCodeService;
    private EmailService emailService;

    private TokenProviderService tokenProviderService;

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    public UserController(UserService userService, AuthCodeService authCodeService, EmailService emailService, TokenProviderService tokenProviderService) {
        this.userService = userService;
        this.authCodeService = authCodeService;
        this.emailService = emailService;
        this.tokenProviderService = tokenProviderService;
    }


    @ApiOperation(value = "회원가입", notes = "회원가입", response = UserCreateFormDto.class)
    @PostMapping()
    public ResponseEntity<Map<String, Object>> join(@Valid @RequestBody @ApiParam(value = "회원가입 정보들", required = true, example  = "0")
                                                    UserCreateFormDto userCreateFormDto) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();
        User joinUser = null;

        try {
            joinUser = userService.join(userCreateFormDto);

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
                String accessToken = tokenProviderService.createAccessToken(loginUser.getUserId(), loginUser.getUserRole());// key, data
                String refreshToken = tokenProviderService.createRefreshToken();
                tokenProviderService.saveRefreshToken(loginUser.getUserId(), refreshToken);
                resultMap.put("accessToken", accessToken);
                resultMap.put("refreshToken", refreshToken);
                resultMap.put("userNickname",loginUser.getUserNickname());
                resultMap.put("userId", loginUser.getUserId());
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
    public ResponseEntity<Map<String, Object>> logout(@PathVariable("userid") int userid) {
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
            @PathVariable("userid") @ApiParam(value = "탈퇴할 회원정보(아이디).", required = true, example  = "0") int userid) {
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

    @ApiOperation(value = "닉네임 수정", notes = "회원의 닉네임을 수정한다.", response = Map.class)
    @PatchMapping("/{userid}/nickname")
    public ResponseEntity<Map<String,Object>> nicknameModify(@PathVariable("userid") @ApiParam(value = "수정할 회원정보(아이디)", required = true, example = "0") Long userid,
                                                             @RequestBody @ApiParam(value = "수정할 회원정보(변경할 닉네임, 아이디)", required = true, example  = "0") UserNicknameModifyFormDto userNicknameModifyFormDto){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try {
            User user = userService.nicknameModify(userNicknameModifyFormDto);
            if(user != null){
                resultMap.put("messsage" , SUCCESS);
                resultMap.put("userNickname", user.getUserNickname());
                status = HttpStatus.ACCEPTED;
            } else {
                resultMap.put("message", FAIL);
                status = HttpStatus.ACCEPTED;
            }
        }catch (Exception e){
            resultMap.put("message",FAIL);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "비밀번호 수정", notes = "회원의 닉네임을 수정한다.", response = Map.class)
    @PatchMapping("/{userid}/password")
    public ResponseEntity<Map<String, Object>> passwordModify(@PathVariable("userid") @ApiParam(value = "수정할 회원정보(아이디)",required = true, example = "0") Long userid,
                                                              @RequestBody @ApiParam(value = "수정할 회원정보(변겨할 패스원드, 아이디", required = true, example = "0") UserPasswordModifyFormDto userPasswordModifyFormDto){
        Map<String,Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        try{
            User user = userService.passwordModify(userPasswordModifyFormDto);
            if(user != null){
                resultMap.put("messsage" , SUCCESS);
                status = HttpStatus.ACCEPTED;
            } else {
                resultMap.put("message", FAIL);
                status = HttpStatus.ACCEPTED;
            }

        }catch (Exception e){
            resultMap.put("message",FAIL);
            status = HttpStatus.INTERNAL_SERVER_ERROR;

        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }


    @ApiOperation(value = "이메일 인증코드 발송", notes = "입력한 이메일이 기존회원이 아니라면 이메일 인증코드 발송" )
    @GetMapping("/email/check")
    public ResponseEntity<Map<String, Object>> sendEmailCheck(@ApiParam(value = "회원가입에서 입력한 이메일" )@RequestParam String authCodeUserEmail) {
        emailService.sendEmailAuthCode(authCodeUserEmail);
        Map<String, Object> map = new HashMap<>();

        map.put("message", "success");
        return new ResponseEntity<Map<String, Object>>(map, HttpStatus.ACCEPTED);
    }

    @ApiOperation(value = "입력한 이메일 인증코드 일치확인", notes = "발급된 이메일 인증코드와 입력한 이메일 인증코드 일치 여부와 인증코드 만료여부 확인")
    @PostMapping("/email/check")
    public ResponseEntity<Map<String, Object>> emailCheck(@ApiParam(value = "입력한 인증코드")@RequestParam String authCodeContent,
                                                          @ApiParam(value = "회원가입에서 입력한 이메일") @RequestParam String authCodeUserEmail) {
        Map<String, Object> map = new HashMap<>();
        AuthCode authCode = authCodeService.getCodeByCodeContent(authCodeContent);

        //인증코드에 담긴 이메일과 입력한 이메일 비교
        if(authCodeUserEmail.equals(authCode.getAuthCodeUserEmail())
        && !(authCodeService.checkExpireAuthCode(authCode))) {
            map.put("message", "success");
            authCodeService.useAuthCode(authCode);  //인증코드 사용처리
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.ACCEPTED);
        } else {
            map.put("message", "fail");
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }

    }

}
