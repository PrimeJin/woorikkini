package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Memory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.core.io.Resource;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemoryGetFormDto {

    private int memoryId;
    private int userId;
    private String memoryContent;
    private String memoryTitle;
    private List<String> photoPathList;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    public MemoryGetFormDto(Memory entity){
        this.memoryId = entity.getMemoryId();
        this.memoryTitle = entity.getMemoryTitle();
        this.memoryContent = entity.getMemoryContent();
        this.userId = entity.getUser().getUserId();
        this.createdTime = entity.getCreatedTime();
        this.updatedTime = entity.getUpdatedTime();
    }


}
