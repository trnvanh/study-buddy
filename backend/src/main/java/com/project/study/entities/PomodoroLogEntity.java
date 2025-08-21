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

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private PetEntity pet;

    // Constructors
    public PomodoroLogEntity() {}
    public PomodoroLogEntity(LocalDateTime startTime, LocalDateTime endTime, int durationMinutes, String taskName, PetEntity pet) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.durationMinutes = durationMinutes;
        this.taskName = taskName;
        this.pet = pet;
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
    public PetEntity getPet() { return pet; }
    public void setPet(PetEntity pet) { this.pet = pet; }
}
