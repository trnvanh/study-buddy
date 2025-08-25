package com.project.study.dto;

import java.time.LocalDateTime;

//import java.util.List;
//import java.time.LocalDateTime;

public class PomodoroLogDto {
    private Long id;
    private int durationMinutes;
    private int petId;
    private String taskName;
    private LocalDateTime startTime; 
    private LocalDateTime endTime;  
    
    // private TaskDto task;

    public PomodoroLogDto() {
    }
    public PomodoroLogDto(Long id, int durationMinutes, int petId, String taskName, LocalDateTime starTime, LocalDateTime endTime) {
        this.id = id;
        this.durationMinutes = durationMinutes;
        this.petId = petId;
        this.taskName = taskName;
        this.startTime = starTime;
        this.endTime = endTime;
    }

    // getters & setters

    public int getPetId() {
        return petId;
    }

    public void setPetId(int petId) {
        this.petId = petId;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskName() {
        return taskName;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
