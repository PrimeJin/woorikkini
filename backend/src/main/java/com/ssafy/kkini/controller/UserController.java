package com.ssafy.kkini.controller;

import com.ssafy.kkini.entity.AuthCode;
import com.ssafy.kkini.service.AuthCodeService;
import com.ssafy.kkini.service.EmailService;
import com.ssafy.kkini.service.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE})
public class UserController {
    private UserService userService;
    private AuthCodeService authCodeService;
    private EmailService emailService;

    public UserController(UserService userService, AuthCodeService authCodeService, EmailService emailService) {
        this.userService = userService;
        this.authCodeService = authCodeService;
        this.emailService = emailService;
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
