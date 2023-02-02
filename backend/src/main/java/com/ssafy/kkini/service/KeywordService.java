package com.ssafy.kkini.service;

import com.ssafy.kkini.entity.Keyword;
import com.ssafy.kkini.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KeywordService {
    private KeywordRepository keywordRepository;

    public KeywordService(KeywordRepository keywordRepository) {
        this.keywordRepository = keywordRepository;
    }

    public Map<Integer,String> getKeyword() {
        List<Keyword> keywordList = keywordRepository.findAll();
        Map<Integer, String> keywordResult = new HashMap<>();
        keywordList.stream().forEach(keyword -> keywordResult.put(keyword.getKeywordId(), keyword.getKeyword()));

        return keywordResult;
    }
}
