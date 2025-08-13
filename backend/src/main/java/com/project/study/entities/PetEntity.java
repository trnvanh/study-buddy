package com.project.study.entities;

import jakarta.persistence.*;

@Entity
public class PetEntity {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String imageUrl;
    private boolean isUnlocked;

    public PetEntity() {
    }

    public PetEntity(String name, String imageUrl, boolean isUnlocked) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.isUnlocked = isUnlocked;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public boolean isUnlocked() {
        return isUnlocked;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setUnlocked(boolean unlocked) {
        isUnlocked = unlocked;
    }
}
