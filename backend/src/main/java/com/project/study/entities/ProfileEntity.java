package com.project.study.entities;

import jakarta.persistence.*;

@Entity
public class ProfileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deviceId; // to identify user/device without login
    private int pomodoroMinutes; 
    private int shortBreakMinutes;    
    private int longBreakMinutes;  
    private int goalPerWeek;      
    private String theme;        
    private boolean darkMode;
    private String shortTermGoal;
    private String longTermGoal;
    private String avatarUrl;

    // getters + setters
    public Long getId() { return id; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public int getPomodoroMinutes() { return pomodoroMinutes; }
    public void setPomodoroMinutes(int pomodoroMinutes) { this.pomodoroMinutes = pomodoroMinutes; }

    public int getShortBreakMinutes() { return shortBreakMinutes; }
    public void setShortBreakMinutes(int shortBreakMinutes) { this.shortBreakMinutes = shortBreakMinutes; }

    public int getLongBreakMinutes() { return longBreakMinutes; }
    public void setLongBreakMinutes(int longBreakMinutes) { this.longBreakMinutes = longBreakMinutes; }

    public int getGoalPerWeek() { return goalPerWeek; }
    public void setGoalPerWeek(int goalPerWeek) { this.goalPerWeek = goalPerWeek; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public boolean isDarkMode() { return darkMode; }
    public void setDarkMode(boolean darkMode) { this.darkMode = darkMode; }

    public String getShortTermGoal() { return shortTermGoal; }
    public void setShortTermGoal(String shortTermGoal) { this.shortTermGoal = shortTermGoal; }

    public String getLongTermGoal() { return longTermGoal; }
    public void setLongTermGoal(String longTermGoal) { this.longTermGoal = longTermGoal; }

    public String getAvatarUrl() {return avatarUrl;}
    public void setAvatarUrl(String avatarUrl) {this.avatarUrl = avatarUrl;}
}
