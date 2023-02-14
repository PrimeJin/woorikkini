package com.ssafy.kkini.controller;

import com.ssafy.kkini.dto.*;
import com.ssafy.kkini.entity.AuthCode;
import com.ssafy.kkini.entity.PasswordCode;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.service.*;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.models.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private UserService userService;
    private AuthCodeService authCodeService;
    private EmailService emailService;

    private TokenProviderService tokenProviderService;

    private PasswordCodeService passwordCodeService;

    private static final String MESSAGE = "message";
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    public UserController(UserService userService, AuthCodeService authCodeService, EmailService emailService, TokenProviderService tokenProviderService, PasswordCodeService passwordCodeService) {
        this.userService = userService;
        this.authCodeService = authCodeService;
        this.emailService = emailService;
        this.tokenProviderService = tokenProviderService;
        this.passwordCodeService = passwordCodeService;
    }


    @ApiOperation(value = "회원가입", notes = "회원가입", response = UserCreateFormDto.class)
    @PostMapping()
    public ResponseEntity<Map<String, Object>> join(@Valid @RequestBody @ApiParam(value = "회원가입 정보들", required = true, example  = "0")
                                                    UserCreateFormDto userCreateFormDto) {
        HttpStatus status = null;
        Map<String, Object> resultMap = new HashMap<>();

        User joinUser = userService.join(userCreateFormDto);

        if(joinUser!=null){
            resultMap.put(MESSAGE, SUCCESS);
            status = HttpStatus.OK;
        }
        else {
            resultMap.put(MESSAGE, FAIL);
            status = HttpStatus.BAD_REQUEST;
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
                resultMap.put("userRole", loginUser.getUserRole());
                resultMap.put(MESSAGE, SUCCESS);
                status = HttpStatus.OK;
            } else {
                resultMap.put(MESSAGE, FAIL);
                status = HttpStatus.BAD_REQUEST;
            }
        } catch (LockedException e) {
            resultMap.put(MESSAGE, e.getMessage());
            status = HttpStatus.NO_CONTENT;
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
            resultMap.put(MESSAGE, SUCCESS);
            status = HttpStatus.OK;
        } catch (Exception e) {
            resultMap.put(MESSAGE, FAIL);
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "회원탈퇴", notes = "Access-token해제와 회원탈퇴 결과 메세지를 반환한다.", response = Map.class)
    @DeleteMapping("/{userid}")
    public ResponseEntity<Map<String, Object>> delete(
            @PathVariable("userid") @ApiParam(value = "탈퇴할 회원정보(아이디).", required = true, example  = "0") int userid) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        if (userService.delete(userid) > 0) {
            resultMap.put(MESSAGE, SUCCESS);
            status = HttpStatus.OK;
        } else {
            resultMap.put(MESSAGE, FAIL);
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "닉네임 수정", notes = "회원의 닉네임을 수정한다.", response = Map.class)
    @PatchMapping("/{userid}/nickname")
    public ResponseEntity<Map<String,Object>> nicknameModify(@PathVariable("userid") @ApiParam(value = "수정할 회원정보(아이디)", required = true, example = "0") int userid,
                                                             @Valid @RequestBody @ApiParam(value = "수정할 회원정보(변경할 닉네임, 아이디)", required = true, example  = "0") UserNicknameModifyFormDto userNicknameModifyFormDto){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        User user = userService.nicknameModify(userNicknameModifyFormDto);

        if(user != null){
            resultMap.put(MESSAGE , SUCCESS);
            resultMap.put("userNickname", user.getUserNickname());
            status = HttpStatus.OK;
        } else {
            resultMap.put(MESSAGE, FAIL);
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "비밀번호 수정", notes = "회원의 닉네임을 수정한다.", response = Map.class)
    @PatchMapping("/{userid}/password")
    public ResponseEntity<Map<String, Object>> passwordModify(@PathVariable("userid") @ApiParam(value = "수정할 회원정보(아이디)",required = true, example = "0") int userid,
                                                              @Valid @RequestBody @ApiParam(value = "수정할 회원정보(변겨할 패스원드, 아이디", required = true, example = "0") UserPasswordModifyFormDto userPasswordModifyFormDto){
        Map<String,Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        User user = userService.passwordModify(userPasswordModifyFormDto);
        if(user != null){
            resultMap.put(MESSAGE , SUCCESS);
            status = HttpStatus.OK;
        } else {
            resultMap.put(MESSAGE, FAIL);
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }


    @ApiOperation(value = "이메일 인증코드 발송", notes = "입력한 이메일이 기존회원이 아니라면 이메일 인증코드 발송" )
    @GetMapping("/email/check")
    public ResponseEntity<Map<String, Object>> sendEmailCheck(@ApiParam(value = "회원가입에서 입력한 이메일" )@RequestParam String authCodeUserEmail) {
        Map<String, Object> map = new HashMap<>();
        if(userService.getUserByUserEmail(authCodeUserEmail).isPresent()) {  //기존 회원이면 중복이므로 실패처리
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        } else {
            emailService.sendEmailAuthCode(authCodeUserEmail);
            map.put(MESSAGE, SUCCESS);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        }
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
            map.put(MESSAGE, SUCCESS);
            authCodeService.useAuthCode(authCode);  //인증코드 사용처리
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } else {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }

    }

    @ApiOperation(value = "닉네임 중복체크", notes = "회원의 닉네임을 중복을 체크한다.", response = Map.class)
    @GetMapping("/{userNickname}")
    public ResponseEntity<Map<String,Object>> nicknameModify(@PathVariable("userNickname") @ApiParam(value = "닉네임", required = true, example = "0") String userNickname){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        User user = userService.nicknameCheck(userNickname);
        if(user == null){
            resultMap.put(MESSAGE , SUCCESS);
            status = HttpStatus.OK;
        } else {
            resultMap.put(MESSAGE, FAIL);
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "비밀번호 찾기(변경 URL 이메일로 전송)", notes = "입력한 이메일, 이름과 일치하는 유저확인 -> 있으면 비밀번호 변경 URL 이메일로 전송")
    @GetMapping ("/{userEmail}/password")
    public ResponseEntity<Map<String, Object>> findPassword(@ApiParam(value = "입력한 이메일") @PathVariable String userEmail,
                                                            @ApiParam(value = "입력한 이름") @RequestParam String userName) {
        Map<String, Object> map = new HashMap<>();
        //이메일과 이름 일치확인
        boolean flag = passwordCodeService.checkEmailAndName(userEmail, userName);
        //비밀번호코드 발급
        if(flag) {
            PasswordCode passwordCode = passwordCodeService.createPasswordCode(userEmail);  //비밀번호 코드 생성
            if(passwordCode != null) {
                emailService.sendEmailPasswordCode(userEmail, passwordCode.getPasswordCodeContent());  //이메일로 전송
                map.put(MESSAGE, SUCCESS);
                return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
            }
        }
        map.put(MESSAGE, FAIL);
        return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
    }

    @ApiOperation(value = "비밀번호 변경 URL 유효검사", notes = "비밀번호 변경 URL 유효한지 검사")
    @GetMapping("/password")
    public ResponseEntity<Map<String, Object>> updatePassword(@ApiParam(value = "유저 이메일")@RequestParam String userEmail,
                                                              @ApiParam(value = "비밀번호 코드값")@RequestParam String passwordCodeContent) {
        Map<String, Object> map = new HashMap<>();

        //비밀번호 코드 가져오기
        PasswordCode originalPasswordCode = passwordCodeService.getCodeByUserEmail(userEmail);
        if(originalPasswordCode != null) {
            if(passwordCodeContent.equals(originalPasswordCode.getPasswordCodeContent())) {  //입력된 코드가 가장최근 코드와 같지 않으면 검사 필요없이 실패
                boolean expireYn = passwordCodeService.checkExpirePasswordCode(originalPasswordCode);
                if(!expireYn) {  //비밀번호 코드 유효 검사
                    map.put(MESSAGE, SUCCESS);
                    return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
                }
            }
        }
        map.put(MESSAGE, FAIL);
        return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
    }

    @ApiOperation(value = "비밀번호 변경 URL에서 비밀번호 변경", notes = "비밀번호 변경 URL에서 비밀번호 변경 처리, 비밀번호 코드 사용처리")
    @PatchMapping("/password")
    public ResponseEntity<Map<String, Object>> updatePassword(@ApiParam(value = "유저 이메일, 비밀번호 코드값, 입력한 새 비밀번호, 비밀번호 확인")
                                                              @Valid @RequestBody UserPasswordUpdateDto userPasswordUpdateDto) {
        Map<String, Object> map = new HashMap<>();

        String userEmail = userPasswordUpdateDto.getUserEmail();
        String passwordCodeContent = userPasswordUpdateDto.getPasswordCodeContent();
        String newPassword = userPasswordUpdateDto.getUserPassword();
        String newPasswordCheck = userPasswordUpdateDto.getUserPasswordCheck();

        //비밀번호 코드 가져오기
        PasswordCode originalPasswordCode = passwordCodeService.getCodeByUserEmail(userEmail);
        if(originalPasswordCode != null) {
            if(!passwordCodeContent.equals(originalPasswordCode.getPasswordCodeContent())) {  //입력된 코드가 가장최근 코드와 같지 않으면 검사 필요없이 실패
                map.put(MESSAGE, FAIL);
                return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
            }

            //마지막으로 비밀번호 코드 유효한지 검사, 유효 -> 입력한 새 비멀번호와 비밀번화 확인에 입력한 값 일치 확인
            boolean expireYn = passwordCodeService.checkExpirePasswordCode(originalPasswordCode);
            if(!expireYn && newPassword.equals(newPasswordCheck)) {
                //비밀번호 변경처리
                User updatedUser = userService.updatePasswordByEmail(userEmail, newPassword);
                if(updatedUser != null) {
                    //비밀번호 코드 사용처리
                    passwordCodeService.usePasswordCode(originalPasswordCode);
                    map.put(MESSAGE, SUCCESS);
                    return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
                }
            }
        }
        map.put(MESSAGE, FAIL);
        return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
    }

    @ApiOperation(value = "관리자가 전체 회원 조회", notes = "관리자 페이지에서 전체 회원 조회 기능")
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getUserList() {
        Map<String, Object> map = new HashMap<>();
        try {
            List<UserListDto> userListDto = userService.getUserList();
            map.put(MESSAGE, SUCCESS);
            map.put("userList", userListDto);
            map.put("totalSize", userListDto.size());
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } catch (Exception e) {
            map.put(MESSAGE, FAIL);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.BAD_REQUEST);
        }
    }

}
