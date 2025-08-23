import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../utils/api';
import '../styles/exam.css';

export default function ExamInterface(props) {
    const locationState = props.location?.state ?? {};
    const { questions = [], exam = {}, studentExamId = '' } = locationState;
    const { studentExamId: idFromUrl } = useParams();
    const sid = studentExamId || idFromUrl || '';
    const navigate = useNavigate();

    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState((exam.duration || 15) * 60); // in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    
    const current = questions[index] || {};

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Auto-save answers
    useEffect(() => {
        const autoSave = setTimeout(() => {
            if (answers[current.questionId] && current.questionId) {
                saveAnswer(current.questionId, answers[current.questionId]);
            }
        }, 30000); // Auto-save every 30 seconds

        return () => clearTimeout(autoSave);
    }, [answers, current.questionId]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerClass = () => {
        if (timeLeft <= 300) return 'timer-critical'; // 5 minutes
        if (timeLeft <= 900) return 'timer-warning'; // 15 minutes
        return '';
    };

    const selectOption = (opt) => {
        setAnswers((prev) => ({ ...prev, [current.questionId]: opt }));
    };

    const saveAnswer = async (questionId, selectedOption) => {
        try {
            await api.submitAnswer(sid, questionId, selectedOption);
            // Show auto-save indicator
            showAutoSaveIndicator();
        } catch (err) {
            console.error('Failed to save answer:', err);
        }
    };

    const showAutoSaveIndicator = () => {
        const indicator = document.querySelector('.auto-save-indicator');
        if (indicator) {
            indicator.classList.add('show');
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 2000);
        }
    };

    const next = async () => {
        if (answers[current.questionId]) {
            await saveAnswer(current.questionId, answers[current.questionId]);
        }
        if (index < questions.length - 1) {
            setIndex((i) => i + 1);
        }
    };

    const prev = () => {
        if (index > 0) setIndex((i) => i - 1);
    };

    const goToQuestion = (questionIndex) => {
        setIndex(questionIndex);
    };

    const handleAutoSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.completeExam(sid);
            navigate(`/student/results/${sid}`);
        } catch (err) {
            console.error('Auto-submit failed:', err);
        }
    };

    const handleSubmitExam = () => {
        setShowSubmitModal(true);
    };

    const confirmSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.completeExam(sid);
            navigate(`/student/results/${sid}`);
        } catch (err) {
            console.error('Submit failed:', err);
            setIsSubmitting(false);
            setShowSubmitModal(false);
        }
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    const getProgressPercentage = () => {
        return (getAnsweredCount() / questions.length) * 100;
    };

    if (!current.questionText) {
        return (
            <div className="exam-container">
                <div className="loading">No questions available</div>
            </div>
        );
    }

    return (
        <div className="exam-container">
            {/* Auto-save indicator */}
            <div className="auto-save-indicator">
                Answer saved automatically
            </div>

            {/* Exam Header */}
            <div className="exam-header">
                <div className="exam-info">
                    <h2>{exam.title || 'Exam'}</h2>
                    <div className="exam-meta">
                        <div className="meta-item">
                            <span>📝</span>
                            <span>Question {index + 1} of {questions.length}</span>
                        </div>
                        <div className="meta-item">
                            <span>✅</span>
                            <span>{getAnsweredCount()} answered</span>
                        </div>
                    </div>
                </div>
                
                <div className={`exam-timer ${getTimerClass()}`}>
                    <div className="timer-label">Time Remaining</div>
                    <div className="timer-display">{formatTime(timeLeft)}</div>
                </div>
            </div>

            <div className="exam-content">
                {/* Question Panel */}
                <div className="question-panel">
                    <div className="question-header">
                        <div className="question-number">Question {index + 1}</div>
                        <div className="question-text">{current.questionText}</div>
                    </div>

                    <div className="question-body">
                        <div className="answer-options">
                            {['A', 'B', 'C', 'D'].map(option => (
                                <label 
                                    key={option}
                                    className={`answer-option ${answers[current.questionId] === option ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${current.questionId}`}
                                        value={option}
                                        checked={answers[current.questionId] === option}
                                        onChange={() => selectOption(option)}
                                    />
                                    <div className="answer-text">
                                        {current[`option${option}`]}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="exam-controls">
                        <div className="control-group">
                            <button 
                                className="control-btn btn-nav" 
                                onClick={prev}
                                disabled={index === 0}
                            >
                                ← Previous
                            </button>
                            <button 
                                className="control-btn btn-nav" 
                                onClick={next}
                                disabled={index === questions.length - 1}
                            >
                                Next →
                            </button>
                        </div>

                        <button 
                            className="control-btn btn-submit" 
                            onClick={handleSubmitExam}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                        </button>
                    </div>
                </div>

                {/* Question Navigation Sidebar */}
                <div className="question-nav">
                    <h3 className="nav-title">Question Navigator</h3>
                    
                    {/* Progress */}
                    <div className="exam-progress">
                        <div className="progress-info">
                            <span>Progress</span>
                            <span>{Math.round(getProgressPercentage())}%</span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${getProgressPercentage()}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question Palette */}
                    <div className="question-palette">
                        {questions.map((_, i) => (
                            <button
                                key={i}
                                className={`palette-item ${i === index ? 'current' : ''} ${answers[questions[i].questionId] ? 'answered' : ''}`}
                                onClick={() => goToQuestion(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="palette-legend">
                        <div className="legend-item">
                            <div className="legend-color legend-current"></div>
                            <span>Current</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color legend-answered"></div>
                            <span>Answered</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color legend-unanswered"></div>
                            <span>Not Answered</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="submit-modal-overlay">
                    <div className="submit-modal">
                        <h3>Submit Exam?</h3>
                        <p>
                            You have answered {getAnsweredCount()} out of {questions.length} questions.
                            Are you sure you want to submit your exam?
                        </p>
                        <div className="submit-modal-actions">
                            <button 
                                className="btn btn-cancel"
                                onClick={() => setShowSubmitModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-confirm"
                                onClick={confirmSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

