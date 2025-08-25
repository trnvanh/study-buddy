package com.project.study.entities;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class PomodoroLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime; 
    private LocalDateTime endTime;   
    private int durationMinutes;     
    private String taskName;         
    private Integer petId;

    // Constructors
    public PomodoroLogEntity() {}
    public PomodoroLogEntity(LocalDateTime startTime, LocalDateTime endTime, int durationMinutes, String taskName, Integer petId) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.durationMinutes = durationMinutes;
        this.taskName = taskName; // can be null
        this.petId = petId;
    }

    // Getters and setters
    public Long getId() { return id; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }
    public Integer getPetId() { return petId; }
    public void setPet(int petId) { this.petId = petId; }
}
