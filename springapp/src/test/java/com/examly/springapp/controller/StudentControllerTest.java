package com.examly.springapp.controller;

import com.examly.springapp.model.Exam;
import com.examly.springapp.model.StudentAnswer;
import com.examly.springapp.service.StudentExamService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
class StudentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentExamService studentExamService;

    @Test
    @DisplayName("GET /api/student/exams - available/exam list")
    void getAvailableExamsTest() throws Exception {
        Exam e = new Exam();
        e.setExamId(1L); e.setTitle("A");
        Mockito.when(studentExamService.getAvailableExams()).thenReturn(List.of(e));
        mockMvc.perform(get("/api/student/exams"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].examId").value(1L));
    }

    @Test
    @DisplayName("POST /api/student/exams/{examId}/start - start exam success")
    void startExamTest_success() throws Exception {
        Map<String, Object> resp = new HashMap<>();
        resp.put("studentExamId", 6L);
        List<Map<String, Object>> questions = new ArrayList<>();
        Map<String, Object> q = new HashMap<>();
        q.put("questionId", 11);
        q.put("questionText", "abc");
        q.put("optionA", "1");
        q.put("optionB", "2");
        q.put("optionC", "3");
        q.put("optionD", "4");
        q.put("marks", 2);
        questions.add(q);
        resp.put("questions", questions);
        Mockito.when(studentExamService.startExam(eq(99L), eq("student1"))).thenReturn(resp);
        String body = "{\"studentUsername\": \"student1\"}";
        mockMvc.perform(post("/api/student/exams/99/start")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.studentExamId").value(6L));
    }

    @Test
    @DisplayName("POST /api/student/exams/{studentExamId}/answers - submit answer success")
    void submitAnswerTest_success() throws Exception {
        StudentAnswer answer = new StudentAnswer();
        answer.setAnswerId(12L);
        answer.setIsCorrect(true);
        Mockito.when(studentExamService.submitAnswer(eq(6L), eq(11L), eq("B"))).thenReturn(answer);
        String body = "{\"questionId\":11, \"selectedOption\":\"B\"}";
        mockMvc.perform(post("/api/student/exams/6/answers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.answerId").value(12L))
                .andExpect(jsonPath("$.isCorrect").value(true));
    }

    @Test
    @DisplayName("POST /api/student/exams/{studentExamId}/complete - complete exam success")
    void completeExamTest_success() throws Exception {
        Map<String, Object> resp = new HashMap<>();
        resp.put("studentExamId", 6L);
        resp.put("finalScore", 7);
        Mockito.when(studentExamService.completeExam(eq(6L))).thenReturn(resp);
        mockMvc.perform(post("/api/student/exams/6/complete"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.finalScore").value(7));
    }

    @Test
    @DisplayName("GET /api/student/exams/{studentExamId}/results - get results success")
    void getResultsTest_success() throws Exception {
        Map<String, Object> resp = new HashMap<>();
        resp.put("examTitle", "Exam1");
        resp.put("description", "desc");
        resp.put("score", 14);
        List<Map<String, Object>> questions = new ArrayList<>();
        Map<String, Object> q = new HashMap<>();
        q.put("questionId", 1L);
        q.put("questionText", "T?");
        q.put("optionA", "1");
        q.put("optionB", "2");
        q.put("optionC", "3");
        q.put("optionD", "4");
        q.put("correctOption", "B");
        q.put("marks", 2);
        q.put("selectedOption", "A");
        q.put("isCorrect", false);
        q.put("marksEarned", 0);
        questions.add(q);
        resp.put("questions", questions);
        Mockito.when(studentExamService.getResults(eq(10L))).thenReturn(resp);
        mockMvc.perform(get("/api/student/exams/10/results"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(14))
                .andExpect(jsonPath("$.questions[0].isCorrect").value(false));
    }
}
