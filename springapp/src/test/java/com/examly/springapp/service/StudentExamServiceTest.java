package com.examly.springapp.service;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.time.LocalDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentExamServiceTest {
    @Mock
    private StudentExamRepository studentExamRepository;
    @Mock
    private ExamRepository examRepository;
    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private StudentAnswerRepository studentAnswerRepository;
    @InjectMocks
    private StudentExamService studentExamService;
    @BeforeEach
    void setup() { MockitoAnnotations.openMocks(this); }
    @Test
    void startExam_duplicateCheck() {
        Exam exam = new Exam(); exam.setExamId(6L); exam.setIsActive(true);
        when(examRepository.findById(6L)).thenReturn(Optional.of(exam));
        when(studentExamRepository.findByExamAndStudentUsernameAndStatusIn(eq(exam), anyString(), anyList()))
                .thenReturn(List.of(new StudentExam()));
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            studentExamService.startExam(6L, "student2")
        );
        assertTrue(ex.getMessage().contains("active attempt"));
    }
    @Test
    void startAndCompleteExamTest() {
        Exam exam = new Exam(); exam.setExamId(5L); exam.setIsActive(true);
        Question q = new Question(); q.setQuestionId(4L); q.setCorrectOption("A"); q.setMarks(3); q.setExam(exam);
        StudentExam studentExam = new StudentExam(); studentExam.setStudentExamId(8L); studentExam.setExam(exam);
        studentExam.setStartTime(LocalDateTime.now()); studentExam.setStudentUsername("bob"); studentExam.setStatus("IN_PROGRESS");
        when(examRepository.findById(5L)).thenReturn(Optional.of(exam));
        when(studentExamRepository.findByExamAndStudentUsernameAndStatusIn(eq(exam), anyString(), anyList()))
                .thenReturn(List.of());
        when(studentExamRepository.save(any(StudentExam.class))).then(inv-> { StudentExam s = inv.getArgument(0); s.setStudentExamId(8L); return s; });
        when(questionRepository.findByExam(exam)).thenReturn(List.of(q));
        // Start
        Map<String, Object> result = studentExamService.startExam(5L, "bob");
        assertEquals(8L, result.get("studentExamId"));
        // Submit and complete
        when(studentExamRepository.findById(8L)).thenReturn(Optional.of(studentExam));
        when(questionRepository.findById(4L)).thenReturn(Optional.of(q));
        when(studentAnswerRepository.findByStudentExamAndQuestion(studentExam, q)).thenReturn(null);
        when(studentAnswerRepository.save(any(StudentAnswer.class))).then(inv-> { StudentAnswer ans = inv.getArgument(0); ans.setAnswerId(15L); return ans; });
        StudentAnswer answer = studentExamService.submitAnswer(8L, 4L, "A");
        assertTrue(answer.getIsCorrect());
        when(studentAnswerRepository.findByStudentExam(studentExam)).thenReturn(List.of(answer));
        when(studentExamRepository.save(any(StudentExam.class))).then(inv->inv.getArgument(0));
        Map<String, Object> finalScore = studentExamService.completeExam(8L);
        assertEquals(3, finalScore.get("finalScore"));
    }
    @Test
    void validationConstraintsTest() {
        when(examRepository.findById(10L)).thenReturn(Optional.empty());
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            studentExamService.startExam(10L, "bob")
        );
        assertTrue(ex.getMessage().contains("not found"));
    }
}
