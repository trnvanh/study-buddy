package com.project.study.dto;

import java.util.List;

public class PetDto {
    private Long id;
    private String name;
    private String imageUrl;

    public PetDto() {
    }
    public PetDto(Long id, String name, String imageUrl) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    // getters & setters

    public String getImageUrl() {
        return imageUrl;
    }

    public String getName() {
        return name;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setName(String name) {
        this.name = name;
    }
}
