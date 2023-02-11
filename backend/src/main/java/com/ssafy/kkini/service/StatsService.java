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
        StatsGetDto female = new StatsGetDto("female",femaleStats);
        list.add(female);
        int maleStats = userRepository.countAllByUserGender("male");
        StatsGetDto male = new StatsGetDto("male",femaleStats);
        list.add(male);

        return list;
    }
    public List<StatsGetDto> getAgeStats() {
        List<StatsGetDto> list = new ArrayList<>();

        // 현재 날짜 구하기
        int nowYear = 0;
        LocalDate now = LocalDate.now();
        // 포맷 정의
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy");
        // 포맷 적용
        nowYear = Integer.parseInt(now.format(formatter));
        System.out.println(nowYear);

        //20대
        int twenityesStats = userRepository.countByUserBirthYearBetween(nowYear-30 ,nowYear-20);
        StatsGetDto twenityes = new StatsGetDto("twenty",twenityesStats);
        list.add(twenityes);
        //30대
        int thirtiesStats = userRepository.countByUserBirthYearBetween(nowYear-40,nowYear-30);
        StatsGetDto thirties = new StatsGetDto("thirties",thirtiesStats);
        list.add(thirties);
        //40대
        int fortiesStats = userRepository.countByUserBirthYearBetween(nowYear-50, nowYear-40);
        StatsGetDto forties = new StatsGetDto("forties",fortiesStats);
        list.add(forties);
        //50대
        int fiftiesStats = userRepository.countByUserBirthYearBetween(nowYear-60, nowYear-50);
        StatsGetDto fifties = new StatsGetDto("fifties",fiftiesStats);
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
