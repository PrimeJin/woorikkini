package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeywordRepository extends JpaRepository<Keyword, Long> {
    Keyword findByKeywordId(int keywordId);
}
