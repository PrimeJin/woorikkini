package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRpository extends JpaRepository<Photo,Long> {

    List<Photo> findAllByMemoryId(Long memoryId);

}
