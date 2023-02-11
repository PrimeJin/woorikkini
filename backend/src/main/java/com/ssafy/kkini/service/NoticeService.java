package com.ssafy.kkini.service;

import com.ssafy.kkini.dto.NoticeCreateFormDto;
import com.ssafy.kkini.dto.NoticeInfoDto;
import com.ssafy.kkini.dto.NoticeUpdateFormDto;
import com.ssafy.kkini.entity.Notice;
import com.ssafy.kkini.repository.NoticeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {
    private NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @Transactional
    public Notice createNotice(NoticeCreateFormDto noticeCreateFormDto) {
        return noticeRepository.save(noticeCreateFormDto.toEntity());
    }

    public NoticeInfoDto getNotice(int noticeId) {
        Optional<Notice> notice = noticeRepository.findById(noticeId);
        if(notice.isPresent()) {
            return new NoticeInfoDto(notice.get());
        } else {
            return null;
        }
    }

    public Page<Notice> getNoticeList(int page, int limit) {
        Pageable paging = PageRequest.of(page, limit, Sort.Direction.DESC, "createdTime");
        Page<Notice> noticeList = noticeRepository.findAll(paging);
        return noticeList;
    }

    @Transactional
    public Notice updateNotice(NoticeUpdateFormDto noticeUpdateFormDto) {
        Notice updatedNotice = noticeUpdateFormDto.toEntity();
        return noticeRepository.save(updatedNotice);
    }

    @Transactional
    public int deleteNotice(int noticeId) {
        Optional<Notice> notice = noticeRepository.findById(noticeId);
        if(notice.isPresent()) {
            noticeRepository.deleteById(noticeId);
            return 1;
        } else {
            return 0;
        }
    }
}
