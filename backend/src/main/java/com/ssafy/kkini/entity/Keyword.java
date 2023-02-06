package com.ssafy.kkini.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.List;

@Builder
@Getter
@DynamicInsert
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "keyword")
public class Keyword {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int keywordId;

    @Column(length = 30)
    private String keyword;


}
