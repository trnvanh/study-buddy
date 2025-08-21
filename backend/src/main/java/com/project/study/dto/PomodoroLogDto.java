package com.project.study.dto;

import java.util.List;
import java.time.LocalDateTime;

public class PomodoroLogDto {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private PetDto pet;
    // private TaskDto task;

    public PomodoroLogDto() {
    }
    public PomodoroLogDto(Long id, LocalDateTime startTime, LocalDateTime endTime, PetDto pet) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.pet = pet;
    }

    // getters & setters
    public LocalDateTime getEndTime() {
        return endTime;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public PetDto getPet() {
        return pet;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setPet(PetDto pet) {
        this.pet = pet;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
}
