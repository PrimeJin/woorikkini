package com.ssafy.kkini.dto;

import com.ssafy.kkini.entity.Memory;
import com.ssafy.kkini.entity.Photo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemoryGetFormDto {
    private Memory memory;
    private List<Photo> photoList;
}
