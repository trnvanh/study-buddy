package com.project.study.service;

import com.project.study.dto.StatsResponseDto;
import com.project.study.repository.PomodoroLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class StatsService {

    private final PomodoroLogRepository repository;

    public StatsService(PomodoroLogRepository repository) {
        this.repository = repository;
    }

    public StatsResponseDto getStats() {
        LocalDate today = LocalDate.now();

        // Day boundaries
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        // Week (Mon–Sun) boundaries using LocalDate, then convert
        LocalDate weekStartDate = today.with(java.time.DayOfWeek.MONDAY);
        LocalDate weekEndDateExclusive = weekStartDate.plusDays(7);

        LocalDate lastWeekStartDate = weekStartDate.minusWeeks(1);
        LocalDate lastWeekEndDateExclusive = weekStartDate;

        LocalDateTime startOfWeek = weekStartDate.atStartOfDay();
        LocalDateTime endOfWeek = weekEndDateExclusive.atStartOfDay();
        LocalDateTime startOfLastWeek = lastWeekStartDate.atStartOfDay();
        LocalDateTime endOfLastWeek = lastWeekEndDateExclusive.atStartOfDay();

        // Month boundaries
        LocalDate firstOfMonth = today.withDayOfMonth(1);
        LocalDate firstOfNextMonth = firstOfMonth.plusMonths(1);
        LocalDateTime startOfMonth = firstOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = firstOfNextMonth.atStartOfDay();

        // Year boundaries
        LocalDate firstOfYear = today.withDayOfYear(1);
        LocalDate firstOfNextYear = firstOfYear.plusYears(1);
        LocalDateTime startOfYear = firstOfYear.atStartOfDay();
        LocalDateTime endOfYear = firstOfNextYear.atStartOfDay();

        long daily = repository.countBetween(startOfDay, endOfDay);
        long weekly = repository.countBetween(startOfWeek, endOfWeek);
        long monthly = repository.countBetween(startOfMonth, endOfMonth);
        long yearly = repository.countBetween(startOfYear, endOfYear);
        long lastWeek = repository.countBetween(startOfLastWeek, endOfLastWeek);
        long totalMinutes = repository.sumAllDurations() != null ? repository.sumAllDurations() : 0;
        long totalHours = totalMinutes / 60;

        // Weekly trend Mon-Sun
        java.util.List<Long> weeklyTrend = new java.util.ArrayList<>(7);
        for (int i = 0; i < 7; i++) {
            LocalDateTime dayStart = weekStartDate.plusDays(i).atStartOfDay();
            LocalDateTime dayEnd = dayStart.plusDays(1);
            weeklyTrend.add(repository.countBetween(dayStart, dayEnd));
        }

        return new StatsResponseDto(daily, weekly, monthly, yearly, lastWeek, weeklyTrend, totalHours);
    }

}

