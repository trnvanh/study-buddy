package com.project.study.dto;

//import java.util.List;

public class PetDto {
    private Long id;
    private String name;
    private String imageUrl;
    private String quote;

    public PetDto() {
    }
    public PetDto(Long id, String name, String imageUrl, String quote) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.quote = quote;
    }

    // getters & setters

    public String getImageUrl() {
        return imageUrl;
    }

    public String getName() {
        return name;
    }

    public String getQuote() {
        return quote;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setQuote(String quote) {
        this.quote = quote;
    }
}
