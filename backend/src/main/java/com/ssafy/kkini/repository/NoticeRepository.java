package com.ssafy.kkini.repository;

import com.ssafy.kkini.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Integer> {
}
