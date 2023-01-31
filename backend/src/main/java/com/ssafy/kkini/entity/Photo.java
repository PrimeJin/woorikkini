package com.ssafy.kkini.entity;

import com.ssafy.kkini.entity.Memory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Getter
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PHOTO")
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT UNSIGNED")
    private Long photoId;

    @ManyToOne
    @JoinColumn(name = "memoryId")
    private Memory memory;
    private String originalFilename;
    private String saveFilename;

//    CREATE TABLE `photo` (
//            `photo_id`	int	NOT NULL,
//            `memory_id`	int	NOT NULL,
//            `original_filename`	varchar(30)	NULL,
//	`save_filename`	varchar(100)	NULL
//);
}
