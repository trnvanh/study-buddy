package com.project.study.controller;

import com.project.study.dto.StatsResponseDto;
import com.project.study.service.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/progress")
    public StatsResponseDto getProgress() {
        return statsService.getStats();
    }
}
