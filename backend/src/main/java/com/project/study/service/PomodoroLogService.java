package com.project.study.service;

import com.project.study.entities.PetEntity;
import com.project.study.entities.PomodoroLogEntity;
import com.project.study.repository.PetRepository;
import com.project.study.repository.PomodoroLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PomodoroLogService {

    private final PomodoroLogRepository pomodoroLogRepository;
    private final PetRepository petRepository;

    public PomodoroLogService(PomodoroLogRepository pomodoroLogRepository, PetRepository petRepository) {
        this.pomodoroLogRepository = pomodoroLogRepository;
        this.petRepository = petRepository;
    }

    /**
     * Create a log entry when a Pomodoro finishes
     */
    public PomodoroLogEntity createLog(Long petId, String taskName, int durationMinutes) {
        Optional<PetEntity> petOpt = petRepository.findById(petId);

        if (petOpt.isEmpty()) {
            throw new IllegalArgumentException("Pet with id " + petId + " not found");
        }

        LocalDateTime now = LocalDateTime.now();
        PomodoroLogEntity log = new PomodoroLogEntity(
                now.minusMinutes(durationMinutes), // start time
                now,                               // end time
                durationMinutes,
                taskName,
                petOpt.get()
        );

        return pomodoroLogRepository.save(log);
    }

    /**
     * Fetch all logs for a given pet
     */
    public List<PomodoroLogEntity> getLogsForPet(Long petId) {
        return pomodoroLogRepository.findByPetId(petId);
    }
}
