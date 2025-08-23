package com.examly.springapp.controller;

import com.examly.springapp.model.Exam;
import com.examly.springapp.model.Question;
import com.examly.springapp.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/exams")
public class TeacherController {

    @Autowired
    private ExamService examService;

    // POST /api/exams - Create exam, returns 201 Created
    @PostMapping
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        Exam created = examService.createExam(exam);
        return ResponseEntity.status(201).body(created);
    }

    // POST /api/exams/{examId}/questions - Add question, returns 201 Created
    @PostMapping("/{examId}/questions")
    public ResponseEntity<Question> addQuestion(@PathVariable Long examId, @RequestBody Question question) {
        Question added = examService.addQuestion(examId, question);
        return ResponseEntity.status(201).body(added);
    }

    // GET /api/exams?createdBy=teacherUsername - Get exams by teacher
    @GetMapping
    public ResponseEntity<List<Exam>> getExamsByTeacher(@RequestParam String createdBy) {
        List<Exam> exams = examService.getExamsByTeacher(createdBy);
        return ResponseEntity.ok(exams);
    }

    // PATCH /api/exams/{examId}/status - Activate/deactivate exam with JSON body {"isActive":true}
    @PatchMapping("/{examId}/status")
    public ResponseEntity<Exam> setExamActiveStatus(@PathVariable Long examId, @RequestBody Map<String, Boolean> body) {
        boolean isActive = Boolean.TRUE.equals(body.get("isActive"));
        Exam updatedExam = examService.setExamActiveStatus(examId, isActive);
        return ResponseEntity.ok(updatedExam);
    }
}
