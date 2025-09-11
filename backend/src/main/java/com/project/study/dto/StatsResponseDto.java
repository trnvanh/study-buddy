package com.project.study.dto;

import java.util.List;

public class StatsResponseDto {
    private long dailyCount;
    private long weeklyCount;
    private long monthlyCount;
    private long yearlyCount;
    private long lastWeekCount;
    private List<Long> weeklyTrend;
    private long totalHours;

    public StatsResponseDto() {}

    public StatsResponseDto(long dailyCount, long weeklyCount, 
    long monthlyCount, long yearlyCount, long lastWeekCount, List<Long> weeklyTrend, long totalHours) {
        this.dailyCount = dailyCount;
        this.weeklyCount = weeklyCount;
        this.monthlyCount = monthlyCount;
        this.yearlyCount = yearlyCount;
        this.lastWeekCount = lastWeekCount;
        this.weeklyTrend = weeklyTrend;
        this.totalHours = totalHours;
    }

    public long getDailyCount() {
        return dailyCount;
    }

    public void setDailyCount(long dailyCount) {
        this.dailyCount = dailyCount;
    }

    public long getWeeklyCount() {
        return weeklyCount;
    }

    public void setWeeklyCount(long weeklyCount) {
        this.weeklyCount = weeklyCount;
    }

    public long getMonthlyCount() {
        return monthlyCount;
    }

    public void setMonthlyCount(long monthlyCount) {
        this.monthlyCount = monthlyCount;
    }
    
    public long getYearlyCount() {
        return yearlyCount;
    }

    public void setYearlyCount(long yearlyCount) {
        this.yearlyCount = yearlyCount;
    }

    public void setLastWeekCount(long lastWeekCount) {
        this.lastWeekCount = lastWeekCount;
    }

    public long getLastWeekCount() {
        return lastWeekCount;
    }

    public List<Long> getWeeklyTrend() { 
        return weeklyTrend; 
    }
    public void setWeeklyTrend(List<Long> weeklyTrend) { 
        this.weeklyTrend = weeklyTrend; 
    }

    public long getTotalHours() { return totalHours; }

    public void setTotalHours(long totalHours) {
        this.totalHours = totalHours;
    }
}
