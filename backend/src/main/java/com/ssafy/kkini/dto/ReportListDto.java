package com.ssafy.kkini.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReportListDto {
    private int reportId;
    private LocalDateTime createdTime;
    private String reportCategory;

    private String reportContent;

    private String reportedUser;

    private long reportedCount;

    private String userActivation;
}
