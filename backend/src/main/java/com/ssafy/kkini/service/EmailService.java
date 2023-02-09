package com.ssafy.kkini.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final AuthCodeService authCodeService;

    @Async("sendEmailTaskExecutor")
    public void sendEmail(String to, String subject, String text, boolean html) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text, html);
            mimeMessageHelper.setFrom(new InternetAddress("dnwlswkd17@gmail.com", "우리끼니", "UTF-8"));

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @Async("emailCheckTaskExecutor")
    public void sendEmailAuthCode(String email) {
        String code = authCodeService.createAuthCode(email).getAuthCodeContent();
        String subject = "[우리끼니] 이메일 인증코드입니다.";

        StringBuilder sb = new StringBuilder();
        sb.append("<div align='center' style='border:1px solid black; font-family:verdana';>");
        sb.append("<img src='https://github.com/PrimeJin/WoorikkiniLogo/blob/master/%EC%9A%B0%EB%A6%AC%EB%81%BC%EB%8B%88%EB%A1%9C%EA%B3%A0.png?raw=true'");
        sb.append(" style='width:160px; height:160px; margin:50px 0px 30px 0px;'/>");
        sb.append("<br/>");
        sb.append("<div> 아래 인증코드를 회원가입창 인증코드란에 입력해주세요.</div>");
        sb.append("<div> 인증코드 유효시간은 발급시점으로부터 1시간입니다.</div>");
        sb.append("<br/>");
        sb.append("<div> 이메일 인증코드는 <strong>").append(code).append("</strong> 입니다.</div>");
        sb.append("<div style='margin-top:40px'></div>");
        sb.append("</div>");

        this.sendEmail(email, subject, sb.toString(), true);
    }

    @Async("passwordFindTaskExecutor")
    public void sendEmailPasswordCode(String email, String passwordCode) {
        String subject = "[우리끼니] 비밀번호를 변경해주세요.";

        StringBuilder sb = new StringBuilder();
        //서버주소
        sb.append("<div align='center' style='border:1px solid black; font-family:verdana';>");
        sb.append("<img src='https://github.com/PrimeJin/WoorikkiniLogo/blob/master/%EC%9A%B0%EB%A6%AC%EB%81%BC%EB%8B%88%EB%A1%9C%EA%B3%A0.png?raw=true'");
        sb.append(" style='width:160px; height:160px; margin:50px 0px 30px 0px;'/>");
        sb.append("<br/>");
        sb.append("<div> 아래 링크를 클릭하여 비밀번호를 변경해주세요.</div>");
        sb.append("<div> 링크 유효기간은 발급시점으로부터 1시간입니다.</div>");
        sb.append("<br/>");
        sb.append("<a href='https://i8a804.p.ssafy.io/user/password?userEmail=");
        sb.append(email);
        sb.append("&passwordCodeContent=");
        sb.append(passwordCode);
        sb.append("'>비밀번호 변경페이지</a>");
        sb.append("<div style='margin-top:40px'></div>");
        sb.append("</div>");
        this.sendEmail(email, subject, sb.toString(), true);
    }
}
