package com.examly.springapp.repository;

import com.examly.springapp.model.Exam;
import com.examly.springapp.model.StudentExam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentExamRepository extends JpaRepository<StudentExam, Long> {
    List<StudentExam> findByExamAndStudentUsernameAndStatusIn(Exam exam, String studentUsername, List<String> statuses);
}
