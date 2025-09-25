package com.project.study.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import com.project.study.entities.PomodoroLogEntity;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PomodoroLogRepository extends JpaRepository<PomodoroLogEntity, Long> {
    List<PomodoroLogEntity> findByPetId(Integer petId);

    //@Query("SELECT p FROM PomodoroLog p WHERE p.pet.id = :petId AND p.startTime >= :start AND p.startTime <= :end")
    //List<PomodoroLogEntity> findByPet_IdAndStartTimeBetween(Long petId, LocalDateTime start, LocalDateTime end);

    // Count time in a period (daily, weekly, monthly, etc)
    @Query("SELECT COUNT(p) FROM PomodoroLogEntity p WHERE p.endTime >= :start AND p.endTime < :end")
    long countBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Count total duration (uses entity field names)
    @Query("SELECT SUM(p.durationMinutes) FROM PomodoroLogEntity p")
    Long sumAllDurations();

}
