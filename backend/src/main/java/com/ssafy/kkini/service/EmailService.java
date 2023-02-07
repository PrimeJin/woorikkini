package com.ssafy.kkini.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Async
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final AuthCodeService authCodeService;

    public void sendEmail(String to, String subject, String text) {
        this.sendEmail(to, subject, text, false);
    }
    public void sendEmail(String to, String subject, String text, boolean html) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text, html);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendEmailAuthCode(String email) {
        String code = authCodeService.createAuthCode(email).getAuthCodeContent();
        String subject = "[우리끼니] 이메일 인증코드입니다.";
        String text = "이메일 인증코드는 " + code + " 입니다.";

        this.sendEmail(email, subject, text);
    }

    public void sendEmailPasswordCode(String email, String passwordCode) {
        String subject = "[우리끼니] 비밀번호를 변경해주세요.";

        StringBuilder sb = new StringBuilder();
        //서버주소
//        sb.append("<a href='https://i8a804.p.ssafy.io/user/password?userEmail=");
        sb.append("<a href='https://i8a804.p.ssafy.io/api/user/password?userEmail=");
        sb.append(email);
        sb.append("&passwordCodeContent=");
        sb.append(passwordCode);
        sb.append("'>비밀번호 변경페이지</a>");
        this.sendEmail(email, subject, sb.toString(), true);
    }
}
