package com.examly.springapp.service;

import com.examly.springapp.model.Exam;
import com.examly.springapp.model.Question;
import com.examly.springapp.model.StudentAnswer;
import com.examly.springapp.model.StudentExam;
import com.examly.springapp.repository.ExamRepository;
import com.examly.springapp.repository.QuestionRepository;
import com.examly.springapp.repository.StudentAnswerRepository;
import com.examly.springapp.repository.StudentExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class StudentExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private StudentExamRepository studentExamRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    public List<Exam> getAvailableExams() {
        return examRepository.findByIsActiveTrue();
    }

    public Map<String, Object> startExam(Long examId, String studentUsername) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found"));

        if (!exam.getIsActive()) {
            throw new IllegalArgumentException("Exam is not active");
        }

        List<StudentExam> existingAttempts = studentExamRepository
                .findByExamAndStudentUsernameAndStatusIn(exam, studentUsername, List.of("IN_PROGRESS", "NOT_STARTED"));
        if (!existingAttempts.isEmpty()) {
            throw new IllegalArgumentException("You already have an active attempt for this exam.");
        }

        StudentExam studentExam = new StudentExam();
        studentExam.setExam(exam);
        studentExam.setStudentUsername(studentUsername);
        studentExam.setStartTime(LocalDateTime.now());
        studentExam.setStatus("IN_PROGRESS");
        studentExam = studentExamRepository.save(studentExam);

        List<Question> questions = questionRepository.findByExam(exam);
        List<Map<String, Object>> questionList = new ArrayList<>();

        for (Question q : questions) {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("questionId", q.getQuestionId());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("optionA", q.getOptionA());
            qMap.put("optionB", q.getOptionB());
            qMap.put("optionC", q.getOptionC());
            qMap.put("optionD", q.getOptionD());
            qMap.put("marks", q.getMarks());
            questionList.add(qMap);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("studentExamId", studentExam.getStudentExamId());
        response.put("questions", questionList);

        return response;
    }

    public StudentAnswer submitAnswer(Long studentExamId, Long questionId, String selectedOption) {
        StudentExam studentExam = studentExamRepository.findById(studentExamId)
                .orElseThrow(() -> new IllegalArgumentException("Student exam not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        StudentAnswer existing = studentAnswerRepository.findByStudentExamAndQuestion(studentExam, question);
        if (existing != null) {
            throw new IllegalArgumentException("Answer already submitted for this question");
        }

        StudentAnswer answer = new StudentAnswer();
        answer.setStudentExam(studentExam);
        answer.setQuestion(question);
        answer.setSelectedOption(selectedOption);
        answer.setIsCorrect(selectedOption.equals(question.getCorrectOption()));
        answer.setMarksEarned(answer.getIsCorrect() ? question.getMarks() : 0);

        return studentAnswerRepository.save(answer);
    }

    public Map<String, Object> completeExam(Long studentExamId) {
        StudentExam studentExam = studentExamRepository.findById(studentExamId)
                .orElseThrow(() -> new IllegalArgumentException("Student exam not found"));

        List<StudentAnswer> answers = studentAnswerRepository.findByStudentExam(studentExam);
        int totalScore = answers.stream().mapToInt(StudentAnswer::getMarksEarned).sum();

        studentExam.setEndTime(LocalDateTime.now());
        studentExam.setStatus("COMPLETED");
        studentExam.setScore(totalScore);
        studentExamRepository.save(studentExam);

        Map<String, Object> response = new HashMap<>();
        response.put("studentExamId", studentExamId);
        response.put("finalScore", totalScore);
        return response;
    }

    public Map<String, Object> getResults(Long studentExamId) {
        StudentExam studentExam = studentExamRepository.findById(studentExamId)
                .orElseThrow(() -> new IllegalArgumentException("Student exam not found"));

        Exam exam = studentExam.getExam();
        List<StudentAnswer> answers = studentAnswerRepository.findByStudentExam(studentExam);

        Map<String, Object> result = new HashMap<>();
        result.put("examTitle", exam.getTitle());
        result.put("description", exam.getDescription());

        int totalScore = answers.stream().mapToInt(StudentAnswer::getMarksEarned).sum();
        result.put("score", totalScore);

        List<Map<String, Object>> questions = new ArrayList<>();
        for (StudentAnswer ans : answers) {
            Question q = ans.getQuestion();
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("questionId", q.getQuestionId());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("optionA", q.getOptionA());
            qMap.put("optionB", q.getOptionB());
            qMap.put("optionC", q.getOptionC());
            qMap.put("optionD", q.getOptionD());
            qMap.put("correctOption", q.getCorrectOption());
            qMap.put("marks", q.getMarks());
            qMap.put("selectedOption", ans.getSelectedOption());
            qMap.put("isCorrect", ans.getIsCorrect());
            qMap.put("marksEarned", ans.getMarksEarned());
            questions.add(qMap);
        }

        result.put("questions", questions);
        return result;
    }
}