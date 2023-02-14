package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Memory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, Integer> {
    List<Memory> findByUser_UserId(int userId);

    Memory findByMemoryId(int memoryId);

}
