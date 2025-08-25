package com.project.study.controller;

import com.project.study.entities.PomodoroLogEntity;
import com.project.study.service.PomodoroLogService;
import com.project.study.dto.PomodoroLogDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pomodoro_logs")
public class PomodoroLogController {

    @Autowired
    private PomodoroLogService pomodoroLogService;

    // Create a new log
    @PostMapping("/create")
    public PomodoroLogEntity createLog(@RequestBody PomodoroLogDto request) {
        return pomodoroLogService.createLog(
            request.getPetId(),
            request.getDurationMinutes(),
            request.getTaskName(),
            request.getStartTime(),
            request.getEndTime() 
        );
    }

    // Get all logs for a pet
    @GetMapping("/pet/{petId}")
    public List<PomodoroLogEntity> getLogsForPet(@PathVariable Integer petId) {
        return pomodoroLogService.getLogsForPet(petId);
    }
}
