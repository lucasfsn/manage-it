package com.manageit.manageit.controller;

import com.manageit.manageit.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

//    @GetMapping("/{taskId}")
//    public ResponseEntity<TaskDto> getTask()

}
