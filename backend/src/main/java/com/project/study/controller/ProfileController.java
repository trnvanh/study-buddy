package com.project.study.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.study.entities.ProfileEntity;
import com.project.study.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // GET profile by deviceId
    @GetMapping("/{deviceId}")
    public ProfileEntity getProfile(@PathVariable String deviceId) {
        return profileService.getOrCreateProfile(deviceId);
    }

    // UPDATE profile
    @PutMapping("/{deviceId}")
    public ProfileEntity updateProfile(@PathVariable String deviceId, @RequestBody ProfileEntity profileData) {
        return profileService.updateProfile(deviceId, profileData);
    }

    // UPLOAD avatar url
    @PostMapping("/{deviceId}/avatar")
    public ProfileEntity uploadAvatar(
            @PathVariable String deviceId,
            @RequestParam("avatar") MultipartFile file) throws IOException {
        return profileService.uploadAvatar(deviceId, file);
    }
}
