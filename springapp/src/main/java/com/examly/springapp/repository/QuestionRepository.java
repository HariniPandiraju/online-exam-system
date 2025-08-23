package com.examly.springapp.repository;

import com.examly.springapp.model.Exam;
import com.examly.springapp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByExam(Exam exam);
}
