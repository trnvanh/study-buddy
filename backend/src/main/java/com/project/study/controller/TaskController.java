package com.project.study.controller;

import com.project.study.entities.TaskEntity;
import com.project.study.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository repo;

    public TaskController(TaskRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<TaskEntity> all() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<TaskEntity> create(@RequestBody TaskEntity payload) {
        TaskEntity saved = repo.save(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public TaskEntity update(@PathVariable Long id, @RequestBody TaskEntity payload) {
        return repo.findById(id).map(existing -> {
            existing.setTitle(payload.getTitle());
            existing.setTime(payload.getTime());
            existing.setDuration(payload.getDuration());
            existing.setDone(payload.isDone());
            return repo.save(existing);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    @PutMapping("/{id}/toggle")
    public TaskEntity toggle(@PathVariable Long id) {
        return repo.findById(id).map(existing -> {
            existing.setDone(!existing.isDone());
            return repo.save(existing);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
