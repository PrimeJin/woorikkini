package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.StatsGetDto;
import com.ssafy.kkini.entity.Keyword;
import com.ssafy.kkini.repository.KeywordRepository;
import com.ssafy.kkini.repository.RoomKeywordRepository;
import com.ssafy.kkini.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class StatsService {
    private UserRepository userRepository;
    private KeywordRepository keywordRepository;
    private RoomKeywordRepository roomKeywordRepository;

    public StatsService(UserRepository userRepository, KeywordRepository keywordRepository, RoomKeywordRepository roomKeywordRepository){
        this.userRepository = userRepository;
        this.keywordRepository = keywordRepository;
        this.roomKeywordRepository = roomKeywordRepository;
    }

    public List<StatsGetDto> getGenderStats() {
        List<StatsGetDto> list = new ArrayList<>();

        int femaleStats = userRepository.countAllByUserGender("female");
        StatsGetDto female = new StatsGetDto("여성",femaleStats);
        list.add(female);
        int maleStats = userRepository.countAllByUserGender("male");
        StatsGetDto male = new StatsGetDto("남성",maleStats);
        list.add(male);
        int notSelectStats = userRepository.countAllByUserGender("");
        StatsGetDto notSelect = new StatsGetDto("선택안함",notSelectStats);
        list.add(notSelect);

        return list;
    }
    public List<StatsGetDto> getAgeStats() {
        List<StatsGetDto> list = new ArrayList<>();

        // 현재 날짜 구하기
        int nowYear = 0;
        LocalDate now = LocalDate.now();
        // 포맷 정의
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        // 포맷 적용
        nowYear = Integer.parseInt(now.format(formatter));

        //20대
        int twenityesStats = userRepository.countByUserBirthYearBetween(nowYear-300000 ,nowYear-200000);
        StatsGetDto twenityes = new StatsGetDto("20대",twenityesStats);
        list.add(twenityes);
        //30대
        int thirtiesStats = userRepository.countByUserBirthYearBetween(nowYear-400000,nowYear-300000);
        StatsGetDto thirties = new StatsGetDto("30대",thirtiesStats);
        list.add(thirties);
        //40대
        int fortiesStats = userRepository.countByUserBirthYearBetween(nowYear-500000, nowYear-400000);
        StatsGetDto forties = new StatsGetDto("40대",fortiesStats);
        list.add(forties);
        //50대
        int fiftiesStats = userRepository.countByUserBirthYearBetween(nowYear-600000, nowYear-500000);
        StatsGetDto fifties = new StatsGetDto("50대",fiftiesStats);
        list.add(fifties);

        return list;
    }
    public List<StatsGetDto> getKeywordStats() {
        List<StatsGetDto> list = new ArrayList<>();

        List<Keyword> keywordList = keywordRepository.findAll();

        for (Keyword keword : keywordList) {
            int keywordStats = roomKeywordRepository.countByKeywordId(keword);
            StatsGetDto statsGetDto = new StatsGetDto(keword.getKeyword(),keywordStats);
            list.add(statsGetDto);
        }

        return list;
    }

}
