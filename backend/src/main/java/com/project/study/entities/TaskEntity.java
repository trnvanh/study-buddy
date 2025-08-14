package com.project.study.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String time;

    @Column(nullable = false)
    private String due;
    @Column(nullable = false)
    private String day;

    @Column(nullable = false)
    private boolean done = false;

    // Constructor
    public TaskEntity() {}

    public TaskEntity(String title, String time, String due, String day, boolean done) {
        this.title = title;
        this.time = time;
        this.due = due;
        this.day = day;
        this.done = done;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getDue() { return due; }
    public void setDue(String due) { this.due = due; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
}
