package com.project.study.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.study.entities.ProfileEntity;
import com.project.study.repository.ProfileRepository;

@Service
public class ProfileService {
    private final ProfileRepository repo;

    public ProfileService(ProfileRepository repo) {
        this.repo = repo;
    }

    public ProfileEntity getOrCreateProfile(String deviceId) {
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

    public ProfileEntity updateProfile(String deviceId, ProfileEntity profileData) {
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

    public ProfileEntity uploadAvatar(String deviceId, MultipartFile file) throws IOException {
        ProfileEntity profile = repo.findByDeviceId(deviceId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        Path filePath = uploadDir.resolve(fileName);
        Files.write(filePath, file.getBytes());
        profile.setAvatarUrl("/uploads/" + fileName);
        repo.save(profile);
        return profile;
    }
}
