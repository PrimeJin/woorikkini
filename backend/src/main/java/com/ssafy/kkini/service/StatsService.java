package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.StatsGetDto;
import com.ssafy.kkini.repository.KeywordRepository;
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

    public StatsService(UserRepository userRepository, KeywordRepository keywordRepository){
        this.userRepository = userRepository;
        this.keywordRepository = keywordRepository;
    }


    public List<StatsGetDto> getGenderStats() {
        List<StatsGetDto> list = new ArrayList<>();

        int femaleStats = userRepository.countAllByGender("female");
        StatsGetDto female = new StatsGetDto("female",femaleStats);
        list.add(female);
        int maleStats = userRepository.countAllByGender("male");
        StatsGetDto male = new StatsGetDto("male",femaleStats);
        list.add(female);

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

        //날짜를 어떻게 할것인가
        int femaleStats = userRepository.countAllByAge("female");
        StatsGetDto female = new StatsGetDto("female",femaleStats);
        list.add(female);
        int maleStats = userRepository.countAllByGender("male");
        StatsGetDto male = new StatsGetDto("male",femaleStats);
        list.add(female);

        return list;
    }
    public List<StatsGetDto> getKeywordList() {
        List<StatsGetDto> list = new ArrayList<>();

        int femaleStats = userRepository.countAllByGender("female");
        StatsGetDto female = new StatsGetDto("female",femaleStats);
        list.add(female);
        int maleStats = userRepository.countAllByGender("male");
        StatsGetDto male = new StatsGetDto("male",femaleStats);
        list.add(female);

        return list;
    }


}
