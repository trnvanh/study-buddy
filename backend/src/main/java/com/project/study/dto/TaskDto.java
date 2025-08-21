package com.project.study.dto;

import java.time.*;

public class TaskDto {
    private Long id;
    private String title;
    private LocalDateTime time;
    private String duration;
    private boolean done;

    // Default constructor
    public TaskDto() {}

    // Constructor with all fields
    public TaskDto(Long id, String title, LocalDateTime time, String duration, String day, boolean done) {
        this.id = id;
        this.title = title;
        this.time = time;
        this.duration = duration;
        this.done = done;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
}
