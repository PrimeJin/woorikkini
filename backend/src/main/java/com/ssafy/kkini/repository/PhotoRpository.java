package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoRpository extends JpaRepository<Photo,Long> {

}
