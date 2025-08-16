package com.project.study.dto;

public class TaskDto {
    private Long id;
    private String title;
    private String time;
    private String due;
    private String day;
    private boolean done;

    // Default constructor
    public TaskDto() {}

    // Constructor with all fields
    public TaskDto(Long id, String title, String time, String due, String day, boolean done) {
        this.id = id;
        this.title = title;
        this.time = time;
        this.due = due;
        this.day = day;
        this.done = done;
    }

    // Getters and Setters
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
