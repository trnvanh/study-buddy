package com.project.study.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.study.entities.*;

public interface PetRepository extends JpaRepository<PetEntity, Long> {
    
}
