package com.ssafy.kkini.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.kkini.entity.Memory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemoryCreateFormDto {
    @NotNull(message = "제목은 필수 입력 값입니다.")
    private String memoryTitle;
    private String memoryContent;
    private String userId;

    public Memory toEntity(){
        return Memory.builder().title(this.memoryTitle)
                .content(this.memoryContent).build();
    }



}
