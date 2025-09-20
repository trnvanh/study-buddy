package com.project.study.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.study.entities.PetEntity;
import com.project.study.repository.PetRepository;

@Service
public class PetService {
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<PetEntity> getAllPets() {
        return petRepository.findAll();
    }

    public Optional<PetEntity> getPet(Long id) {
        return petRepository.findById(id);
    }

    public PetEntity createPet(PetEntity pet) {
        return petRepository.save(pet);
    }

    public PetEntity updatePet(Long id, PetEntity updatedPet) {
        return petRepository.findById(id).map(pet -> {
            pet.setName(updatedPet.getName());
            pet.setImageUrl(updatedPet.getImageUrl());
            pet.setUnlocked(updatedPet.isUnlocked());
            pet.setHoursToUnlock(updatedPet.getHoursToUnlock());
            return petRepository.save(pet);
        }).orElseThrow();
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }
}
