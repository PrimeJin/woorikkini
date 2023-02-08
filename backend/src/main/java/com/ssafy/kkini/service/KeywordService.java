package com.ssafy.kkini.service;

import com.ssafy.kkini.entity.Keyword;
import com.ssafy.kkini.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KeywordService {
    private KeywordRepository keywordRepository;

    public KeywordService(KeywordRepository keywordRepository) {
        this.keywordRepository = keywordRepository;
    }

    public List<Map<String, Object>> getKeyword() {
        List<Keyword> keywordList = keywordRepository.findAll();
        List<Map<String, Object>> keywordResult = new ArrayList<>();

        keywordList.stream().forEach(keyword ->{
            Map<String, Object> map = new HashMap<>();
            map.put( "id", keyword.getKeywordId());
            map.put("keyword", keyword.getKeyword());
            keywordResult.add(map);
        });

        return keywordResult;
    }
}
