package com.project.study.service;

import org.springframework.stereotype.Service;

import com.project.study.repository.TaskRepository;

/*
 * Controller-Service-Repository pattern
 */
@Service
public class TaskService {
    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    // Add business logic methods 
}
