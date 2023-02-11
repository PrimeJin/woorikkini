package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Keyword;
import com.ssafy.kkini.entity.RoomKeyword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomKeywordRepository  extends JpaRepository<RoomKeyword, Long> {

    int countByKeywordId(Keyword keywordId);

}
