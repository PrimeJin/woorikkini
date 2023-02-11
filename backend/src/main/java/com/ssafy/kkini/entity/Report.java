package com.ssafy.kkini.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "report")
public class Report extends  BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reportId;

    private int reportUser;

    private int reportedUser;
    private String reportContent;
    private String reportCategory;

    @Builder
    public Report(int reportId, int reportUser, int reportedUser, String reportContent, String reportCategory) {
        this.reportId = reportId;
        this.reportUser = reportUser;
        this.reportedUser = reportedUser;
        this.reportContent = reportContent;
        this.reportCategory = reportCategory;
    }
}
