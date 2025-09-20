package com.project.study.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.project.study.entities.TaskEntity;
import com.project.study.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<TaskEntity> all() {
        return service.getAllTasks();
    }

    @PostMapping
    public ResponseEntity<TaskEntity> create(@RequestBody TaskEntity payload) {
        TaskEntity saved = service.createTask(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public TaskEntity update(@PathVariable Long id, @RequestBody TaskEntity payload) {
        return service.updateTask(id, payload);
    }

    @PutMapping("/{id}/toggle")
    public TaskEntity toggle(@PathVariable Long id) {
        return service.toggleTask(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteTask(id);
    }
}