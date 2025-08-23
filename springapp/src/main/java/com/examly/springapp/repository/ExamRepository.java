package com.examly.springapp.repository;

import com.examly.springapp.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByIsActiveTrue();
    List<Exam> findByCreatedBy(String teacherUsername);
}
