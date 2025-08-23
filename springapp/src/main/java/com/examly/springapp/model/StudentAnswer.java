package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_answer")
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentExamId", nullable = false)
    private StudentExam studentExam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionId", nullable = false)
    private Question question;

    @Pattern(regexp = "[ABCD]", message = "Selected option must be one of: A, B, C, or D")
    @Column(length = 1, nullable = false)
    private String selectedOption;

    @Column(nullable = false)
    private Boolean isCorrect;

    @Column(nullable = false)
    private Integer marksEarned;
}
