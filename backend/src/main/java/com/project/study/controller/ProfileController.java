package com.project.study.controller;

import com.project.study.entities.ProfileEntity;
import com.project.study.repository.ProfileRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*") 
public class ProfileController {
    private final ProfileRepository repo;

    public ProfileController(ProfileRepository repo) {
        this.repo = repo;
    }

    // GET profile by deviceId
    @GetMapping("/{deviceId}")
    public ProfileEntity getProfile(@PathVariable String deviceId) {
        return repo.findByDeviceId(deviceId)
                   .orElseGet(() -> {
                       ProfileEntity newProfile = new ProfileEntity();
                       newProfile.setDeviceId(deviceId);
                       newProfile.setPomodoroMinutes(25);
                       newProfile.setShortBreakMinutes(5);
                       newProfile.setLongBreakMinutes(15);
                       newProfile.setGoalPerWeek(4);
                       newProfile.setTheme("pink");
                       newProfile.setDarkMode(false);
                       newProfile.setAvatarUrl("");
                       return repo.save(newProfile);
                   });
    }

    // UPDATE profile
    @PutMapping("/{deviceId}")
    public ProfileEntity updateProfile(@PathVariable String deviceId, @RequestBody ProfileEntity profileData) {
        Optional<ProfileEntity> existing = repo.findByDeviceId(deviceId);
        if (existing.isPresent()) {
            ProfileEntity profile = existing.get();
            profile.setPomodoroMinutes(profileData.getPomodoroMinutes());
            profile.setShortBreakMinutes(profileData.getShortBreakMinutes());
            profile.setLongBreakMinutes(profileData.getLongBreakMinutes());
            profile.setGoalPerWeek(profileData.getGoalPerWeek());
            profile.setTheme(profileData.getTheme());
            profile.setDarkMode(profileData.isDarkMode());
            profile.setShortTermGoal(profileData.getShortTermGoal());
            profile.setLongTermGoal(profileData.getLongTermGoal());
            profile.setAvatarUrl(deviceId);
            return repo.save(profile);
        } else {
            profileData.setDeviceId(deviceId);
            return repo.save(profileData);
        }
    }

    // UPLOAD avatar url
    @PostMapping("/{deviceId}/avatar")
    public ProfileEntity uploadAvatar(
            @PathVariable String deviceId,
            @RequestParam("avatar") MultipartFile file) throws IOException {

        ProfileEntity profile = repo.findByDeviceId(deviceId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // generate unique filename
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // save file locally
        Path filePath = uploadDir.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // store relative URL
        profile.setAvatarUrl("/uploads/" + fileName);
        repo.save(profile);

        return profile;
    }
}
