package com.project.study.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.study.entities.PetEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, Long> {
	// Find by exact name
	Optional<PetEntity> findByName(String name);

	// Find unlocked/locked pets
	List<PetEntity> findByUnlockedTrue();
	List<PetEntity> findByUnlockedFalse();

	// Find pets that unlock at or before the given hours
	List<PetEntity> findByHoursToUnlockLessThanEqual(long hours);

	// Convenience: the next pet to unlock
	Optional<PetEntity> findTopByOrderByHoursToUnlockAsc();
}
