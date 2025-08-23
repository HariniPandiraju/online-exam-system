package com.examly.springapp.controller;

import com.examly.springapp.model.Exam;
import com.examly.springapp.model.Question;
import com.examly.springapp.service.ExamService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import java.util.List;
import static org.mockito.ArgumentMatchers.*;

@WebMvcTest(TeacherController.class)
class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExamService examService;

    @Test
    @DisplayName("POST /api/exams - success")
    void createExamTest_success() throws Exception {
        Exam exam = new Exam();
        exam.setExamId(1L);
        exam.setTitle("Java Basics Quiz");
        exam.setDescription("Test your knowledge of Java fundamentals");
        exam.setDuration(30);
        exam.setCreatedBy("teacher1");
        exam.setIsActive(false);
        Mockito.when(examService.createExam(any(Exam.class))).thenReturn(exam);
        String requestBody = "{" +
                "\"title\": \"Java Basics Quiz\"," +
                "\"description\": \"Test your knowledge of Java fundamentals\"," +
                "\"duration\": 30," +
                "\"createdBy\": \"teacher1\"}";
        mockMvc.perform(post("/api/exams")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
        ).andExpect(status().isCreated())
         .andExpect(jsonPath("$.examId").value(1L));
    }

    @Test
    @DisplayName("POST /api/exams/{examId}/questions - success")
    void addQuestionToExamTest_success() throws Exception {
        Question q = new Question();
        q.setQuestionId(2L);
        q.setQuestionText("What is Java?");
        q.setOptionA("A programming language");
        q.setOptionB("A beverage");
        q.setOptionC("A dance move");
        q.setOptionD("A car brand");
        q.setCorrectOption("A");
        q.setMarks(5);
        Mockito.when(examService.addQuestion(eq(1L), any(Question.class))).thenReturn(q);
        String body = "{" +
                "\"questionText\":\"What is Java?\"," +
                "\"optionA\":\"A programming language\"," +
                "\"optionB\":\"A beverage\"," +
                "\"optionC\":\"A dance move\"," +
                "\"optionD\":\"A car brand\"," +
                "\"correctOption\":\"A\"," +
                "\"marks\":5}";
        mockMvc.perform(post("/api/exams/1/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
        ).andExpect(status().isCreated())
        .andExpect(jsonPath("$.questionId").value(2L));
    }

    @Test
    @DisplayName("GET /api/exams?createdBy={teacherUsername}")
    void getExamsByTeacher() throws Exception {
        Exam exam = new Exam();
        exam.setExamId(10L);
        exam.setTitle("Quiz");
        exam.setDescription("Short quiz");
        exam.setDuration(20);
        exam.setCreatedBy("teacher1");
        exam.setIsActive(true);
        Mockito.when(examService.getExamsByTeacher("teacher1")).thenReturn(List.of(exam));
        mockMvc.perform(get("/api/exams").param("createdBy", "teacher1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].examId").value(10L))
                .andExpect(jsonPath("$[0].createdBy").value("teacher1"));
    }

    @Test
    @DisplayName("PATCH /api/exams/{examId}/status")
    void activateExam() throws Exception {
        Exam ex = new Exam();
        ex.setExamId(6L);
        ex.setTitle("Title");
        ex.setIsActive(true);
        Mockito.when(examService.setExamActiveStatus(6L, true)).thenReturn(ex);
        mockMvc.perform(patch("/api/exams/6/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"isActive\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive").value(true));
    }

}
