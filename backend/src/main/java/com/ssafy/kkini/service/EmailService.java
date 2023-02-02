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
}
