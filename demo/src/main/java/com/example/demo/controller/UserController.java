package com.example.demo.controller;

import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private EmailService emailService;

    @GetMapping("/mail")
    public void sendEmail() {
        emailService.sendEmail();
    }
}
