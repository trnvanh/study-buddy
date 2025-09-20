package com.project.study.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.study.entities.TaskEntity;
import com.project.study.repository.TaskRepository;

/*
 * Controller-Service-Repository pattern
 * Implement business logic in service classes, not controllers 
 */
@Service
public class TaskService {
    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    // Add business logic methods 
    public List<TaskEntity> getAllTasks() {
        return repo.findAll();
    }

    public Optional<TaskEntity> getTask(Long id) {
        return repo.findById(id);
    }

    public TaskEntity createTask(TaskEntity payload) {
        return repo.save(payload);
    }

    public TaskEntity updateTask(Long id, TaskEntity payload) {
        return repo.findById(id).map(existing -> {
            existing.setTitle(payload.getTitle());
            existing.setTime(payload.getTime());
            existing.setDuration(payload.getDuration());
            existing.setDone(payload.isDone());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public TaskEntity toggleTask(Long id) {
        return repo.findById(id).map(existing -> {
            existing.setDone(!existing.isDone());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void deleteTask(Long id) {
        repo.deleteById(id);
    }
}
