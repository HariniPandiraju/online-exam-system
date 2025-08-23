package com.examly.springapp.repository;

import com.examly.springapp.model.Question;
import com.examly.springapp.model.StudentAnswer;
import com.examly.springapp.model.StudentExam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    StudentAnswer findByStudentExamAndQuestion(StudentExam studentExam, Question question);
    List<StudentAnswer> findByStudentExam(StudentExam studentExam);
}
