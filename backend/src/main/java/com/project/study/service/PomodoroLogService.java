package com.project.study.service;

import com.project.study.entities.PomodoroLogEntity;
import com.project.study.repository.PomodoroLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PomodoroLogService {

    private final PomodoroLogRepository pomodoroLogRepository;

    public PomodoroLogService(PomodoroLogRepository pomodoroLogRepository) {
        this.pomodoroLogRepository = pomodoroLogRepository;
    }

    /**
     * Create a log entry when a Pomodoro finishes
     */
    public PomodoroLogEntity createLog(Integer petId, int durationMinutes, String taskName, LocalDateTime startTime, LocalDateTime endTime) {
        //LocalDateTime now = LocalDateTime.now();

        PomodoroLogEntity log = new PomodoroLogEntity(
                startTime,
                endTime,
                durationMinutes,
                taskName,
                petId
        );

        return pomodoroLogRepository.save(log);
    }

    /**
     * Fetch all logs for a given pet
     */
    public List<PomodoroLogEntity> getLogsForPet(Integer petId) {
        return pomodoroLogRepository.findByPetId(petId);
    }
}
