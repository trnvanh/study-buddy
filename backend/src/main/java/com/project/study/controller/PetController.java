package com.project.study.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.study.entities.PetEntity;
import com.project.study.service.PetService;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*") // CORS for frontend
public class PetController {
    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public List<PetEntity> getAllPets() {
        return petService.getAllPets();
    }

    @GetMapping("/{id}")
    public Optional<PetEntity> getPet(@PathVariable Long id) {
        return petService.getPet(id);
    }

    @PostMapping
    public PetEntity createPet(@RequestBody PetEntity pet) {
        return petService.createPet(pet);
    }

    @PutMapping("/{id}")
    public PetEntity updatePet(@PathVariable Long id, @RequestBody PetEntity updatedPet) {
        return petService.updatePet(id, updatedPet);
    }

    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable Long id) {
        petService.deletePet(id);
    }

}
