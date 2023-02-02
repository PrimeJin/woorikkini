package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Memory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, Long> {
    List<Memory> FindAllByUserId(Long UserId);
}
