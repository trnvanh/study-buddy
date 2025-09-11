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

    // Daily count
    @Query("SELECT COUNT(p) FROM PomodoroLogEntity p WHERE p.endTime >= :startOfDay AND p.endTime < :endOfDay")
    long countDaily(@Param("startOfDay") LocalDateTime startOfDay,
                    @Param("endOfDay") LocalDateTime endOfDay);

    // Weekly count
    @Query("SELECT COUNT(p) FROM PomodoroLogEntity p WHERE p.endTime >= :startOfWeek AND p.endTime < :endOfWeek")
    long countWeekly(@Param("startOfWeek") LocalDateTime startOfWeek,
                     @Param("endOfWeek") LocalDateTime endOfWeek);

    // Monthly count
    @Query("SELECT COUNT(p) FROM PomodoroLogEntity p WHERE p.endTime >= :startOfMonth AND p.endTime < :endOfMonth")
    long countMonthly(@Param("startOfMonth") LocalDateTime startOfMonth,
                      @Param("endOfMonth") LocalDateTime endOfMonth);

    // Yearly count
    @Query("SELECT COUNT(p) FROM PomodoroLogEntity p WHERE p.endTime >= :startOfYear AND p.endTime < :endOfYear")
    long countYearly(@Param("startOfYear") LocalDateTime startOfYear,
                     @Param("endOfYear") LocalDateTime endOfYear);

    @Query("SELECT COUNT(p) FROM PomodoroLogEntity p WHERE p.endTime >= :start AND p.endTime < :end")
    long countBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Count total
    @Query("SELECT SUM(p.durationMinutes) FROM PomodoroLogEntity p")
    Long sumAllDurations();

}
