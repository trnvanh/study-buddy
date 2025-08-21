package com.project.study.entities;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "tasks")
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private boolean done = false;

    // Constructor
    public TaskEntity() {}

    public TaskEntity(String title, LocalDateTime time, String duration, boolean done) {
        this.title = title;
        this.time = time;
        this.duration = duration;
        this.done = done;
    }

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
