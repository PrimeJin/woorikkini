package com.ssafy.kkini.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "report")
public class Report extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reportId;

    private int reportUserId;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private User reportedUser;
    private String reportContent;
    private String reportCategory;

    @Builder
    public Report(int reportId, int reportUserId, User reportedUser, String reportContent, String reportCategory) {
        this.reportId = reportId;
        this.reportUserId = reportUserId;
        this.reportedUser = reportedUser;
        this.reportContent = reportContent;
        this.reportCategory = reportCategory;
    }
}
