package com.project.study.controller;

import com.project.study.entities.PomodoroLogEntity;
import com.project.study.service.PomodoroLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pomodoro_logs")
public class PomodoroLogController {

    @Autowired
    private PomodoroLogService pomodoroLogService;

    // Create a new log
    @PostMapping("/create")
    public PomodoroLogEntity createLog(
            @RequestParam Long petId,
            @RequestParam String taskName,
            @RequestParam int durationMinutes) {
        return pomodoroLogService.createLog(petId, taskName, durationMinutes);
    }

    // Get all logs for a pet
    @GetMapping("/pet/{petId}")
    public List<PomodoroLogEntity> getLogsForPet(@PathVariable Long petId) {
        return pomodoroLogService.getLogsForPet(petId);
    }
}
