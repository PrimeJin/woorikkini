package com.ssafy.kkini.service;

import com.ssafy.kkini.repository.KeywordRepository;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class StatsService {
    private UserRepository userRepository;
    private KeywordRepository keywordRepository;

    public StatsService(UserRepository userRepository, KeywordRepository keywordRepository){
        this.userRepository = userRepository;
        this.keywordRepository = keywordRepository;
    }

    


}
