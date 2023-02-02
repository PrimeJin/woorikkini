package com.example.demo.service;

import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;
    public void sendEmail() {
        SimpleMailMessage simpleMessage = new SimpleMailMessage();
        simpleMessage.setTo("sky585456@naver.com");
        simpleMessage.setSubject("Subject simple");
        simpleMessage.setText("text smaple");
        javaMailSender.send(simpleMessage);

    }

}
