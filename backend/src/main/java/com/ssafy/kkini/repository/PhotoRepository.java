package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<Photo,Integer> {

    List<Photo> findAllByMemory_MemoryId(int memoryId);

    void deleteByPhotoId(int photoId);

//    List<Photo> getAllByMemoryId(int memoryId);
}
