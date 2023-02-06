package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Report;
import lombok.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportCreateFormDto {

    private int reportUser;  //신고자 userId

    private int reportedUser;  //피신고자 userId

    private String reportContent;

    private String reportCategory;

    public Report toEntity() {
        return Report.builder()
                .reportUser(reportUser)
                .reportedUser(reportedUser)
                .reportContent(reportContent)
                .reportCategory(reportCategory)
                .build();
    }
}
