package com.examly.springapp.controller;

import com.examly.springapp.model.StudentAnswer;
import com.examly.springapp.service.StudentExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/student/exams")
public class StudentController {

    @Autowired
    private StudentExamService studentExamService;

    @GetMapping
    public ResponseEntity<?> getAvailableExams() {
        return ResponseEntity.ok(studentExamService.getAvailableExams());
    }

    @PostMapping("/{examId}/start")
    public ResponseEntity<?> startExam(@PathVariable Long examId, @RequestBody Map<String, String> request) {
        String studentUsername = request.get("studentUsername");
        Map<String, Object> response = studentExamService.startExam(examId, studentUsername);
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/{studentExamId}/answers")
    public ResponseEntity<?> submitAnswer(@PathVariable Long studentExamId, @RequestBody Map<String, Object> request) {
        Long questionId = Long.valueOf(request.get("questionId").toString());
        String selectedOption = request.get("selectedOption").toString();
        StudentAnswer answer = studentExamService.submitAnswer(studentExamId, questionId, selectedOption);
        return ResponseEntity.status(201).body(answer);
    }

    @PostMapping("/{studentExamId}/complete")
    public ResponseEntity<?> completeExam(@PathVariable Long studentExamId) {
        Map<String, Object> response = studentExamService.completeExam(studentExamId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{studentExamId}/results")
    public ResponseEntity<?> getResults(@PathVariable Long studentExamId) {
        Map<String, Object> response = studentExamService.getResults(studentExamId);
        return ResponseEntity.ok(response);
    }
}
