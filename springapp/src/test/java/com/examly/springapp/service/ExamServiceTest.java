package com.examly.springapp.service;

import com.examly.springapp.model.Exam;
import com.examly.springapp.model.Question;
import com.examly.springapp.repository.ExamRepository;
import com.examly.springapp.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExamServiceTest {

    @Mock
    private ExamRepository examRepository;
    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private ExamService examService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createExam_setsTimestampAndDefaults() {
        Exam exam = new Exam();
        exam.setTitle("Java");
        exam.setDuration(20);
        exam.setCreatedBy("teacher1");
        when(examRepository.save(any(Exam.class))).thenAnswer(inv->inv.getArgument(0));
        Exam saved = examService.createExam(exam);
        assertNotNull(saved.getCreatedAt());
        assertFalse(saved.getIsActive());
    }

    @Test
    void addQuestion_throwsIfExamNotFound() {
        when(examRepository.findById(anyLong())).thenReturn(Optional.empty());
        Question q = new Question();
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                examService.addQuestion(1L, q)
        );
        assertEquals("Exam not found", ex.getMessage());
    }

    @Test
    void addQuestion_setsExamProperly() {
        Exam ex = new Exam(); ex.setExamId(3L);
        Question q = new Question();
        when(examRepository.findById(3L)).thenReturn(Optional.of(ex));
        when(questionRepository.save(any(Question.class))).then(inv->inv.getArgument(0));
        Question added = examService.addQuestion(3L, q);
        assertSame(ex, added.getExam());
    }
    
    @Test
    void setExamActiveStatus_success_and_fail() {
        Exam exam = new Exam();
        exam.setExamId(1L);
        when(examRepository.findById(1L)).thenReturn(Optional.of(exam));
        when(examRepository.save(any(Exam.class))).then(inv->inv.getArgument(0));
        Exam updated = examService.setExamActiveStatus(1L, true);
        assertTrue(updated.getIsActive());
        when(examRepository.findById(11L)).thenReturn(Optional.empty());
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                examService.setExamActiveStatus(11L, false)
        );
        assertEquals("Exam not found", ex.getMessage());
    }
}
