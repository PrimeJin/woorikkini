package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Report;
import com.ssafy.kkini.entity.User;
import com.ssafy.kkini.repository.UserRepository;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportCreateFormDto {
    private int reportUserId;  //신고자 userId

    private int reportedUserId;  //피신고자 userId

    private String reportContent;

    private String reportCategory;

    private User reportedUser;  //피신고자 user객체

    public Report toEntity() {
        return Report.builder()
                .reportUserId(reportUserId)
                .reportedUser(reportedUser)
                .reportContent(reportContent)
                .reportCategory(reportCategory)
                .reportedUser(reportedUser)
                .build();
    }
}
