package com.ssafy.kkini.service;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;

@Service
public class EncryptService {
    public String encryptMD5(String content) {
        return this.encrypt(content, "MD5");
    }

    public String encrypt(String content, String algorithm) {
        try {
            MessageDigest md = MessageDigest.getInstance(algorithm);
            md.reset();

            byte[] bytes = content.getBytes();
            byte[] digest = md.digest(bytes);

            StringBuilder sb = new StringBuilder();

            for(int i=0; i<digest.length; i++) {
                sb.append(Integer.toString((digest[i] & 0xff) + 0x100, 16).substring(1));
            }

            return sb.toString();
        } catch(Exception e) {
            return null;
        }
    }
}
