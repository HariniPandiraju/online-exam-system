package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examId", nullable = false)
    private Exam exam;

    @Column(length = 500, nullable = false)
    private String questionText;

    @Column(length = 200, nullable = false)
    private String optionA;

    @Column(length = 200, nullable = false)
    private String optionB;

    @Column(length = 200, nullable = false)
    private String optionC;

    @Column(length = 200, nullable = false)
    private String optionD;

    @Pattern(regexp = "[ABCD]", message = "Correct option must be one of: A, B, C, or D")
    @Column(length = 1, nullable = false)
    private String correctOption;

    @Min(1)
    @Max(10)
    @Column(nullable = false)
    private Integer marks;
}
