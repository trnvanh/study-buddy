package com.project.study.controller;

import com.project.study.entities.PetEntity;
import com.project.study.repository.PetRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*") // CORS for frontend
public class PetController {
    
    private final PetRepository petRepository;

    public PetController(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @GetMapping
    public List<PetEntity> getAllPets() {
        return petRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<PetEntity> getPet(@PathVariable Long id) {
        return petRepository.findById(id);
    }

    @PostMapping
    public PetEntity createPet(@RequestBody PetEntity pet) {
        return petRepository.save(pet);
    }

    @PutMapping("/{id}")
    public PetEntity updatePet(@PathVariable Long id, @RequestBody PetEntity updatedPet) {
        return petRepository.findById(id).map(pet -> {
            pet.setName(updatedPet.getName());
            pet.setImageUrl(updatedPet.getImageUrl());
            pet.setUnlocked(updatedPet.isUnlocked());
            pet.setHoursToUnlock(updatedPet.getHoursToUnlock());
            return petRepository.save(pet);
        }).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable Long id) {
        petRepository.deleteById(id);
    }

}
