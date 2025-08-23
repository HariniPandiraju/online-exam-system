import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../utils/api';
import '../styles/forms.css';

export default function ExamCreator() {
    const navigate = useNavigate();
    const { examId } = useParams();
    const isEditing = Boolean(examId);
    
    const [exam, setExam] = useState({ 
        title: '', 
        description: '', 
        duration: '' 
    });
    const [errors, setErrors] = useState({});
    const [savedExamId, setSavedExamId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [question, setQuestion] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: '',
        marks: '1',
    });
    const [questionErrors, setQuestionErrors] = useState({});
    const [questionsAdded, setQuestionsAdded] = useState(0);
    const [addedQuestions, setAddedQuestions] = useState([]);
    const [addingQuestion, setAddingQuestion] = useState(false);

    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const teacherUsername = user.username || 'teacher1';

    useEffect(() => {
        if (isEditing) {
            loadExamForEditing();
        }
    }, [examId]);

    const loadExamForEditing = async () => {
        try {
            // Load exam details - you'll need to add this API endpoint
            // const examResponse = await api.getExamById(examId);
            // setExam(examResponse.data);
            // setSavedExamId(examId);
        } catch (error) {
            setErrors({ api: 'Failed to load exam for editing' });
        }
    };

    const validateExam = () => {
        const newErrors = {};
        
        if (!exam.title || exam.title.trim() === '') {
            newErrors.title = 'Exam title is required';
        } else if (exam.title.length > 100) {
            newErrors.title = 'Title must be 100 characters or less';
        }
        
        if (!exam.description || exam.description.trim() === '') {
            newErrors.description = 'Description is required';
        } else if (exam.description.length > 500) {
            newErrors.description = 'Description must be 500 characters or less';
        }
        
        if (!exam.duration || exam.duration.trim() === '') {
            newErrors.duration = 'Duration is required';
        } else {
            const duration = parseInt(exam.duration, 10);
            if (isNaN(duration) || duration < 10 || duration > 180) {
                newErrors.duration = 'Duration must be between 10 and 180 minutes';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateQuestion = () => {
        const newErrors = {};
        
        if (!question.questionText.trim()) {
            newErrors.questionText = 'Question text is required';
        } else if (question.questionText.length > 500) {
            newErrors.questionText = 'Question text must be 500 characters or less';
        }
        
        if (!question.optionA.trim()) newErrors.optionA = 'Option A is required';
        if (!question.optionB.trim()) newErrors.optionB = 'Option B is required';
        if (!question.optionC.trim()) newErrors.optionC = 'Option C is required';
        if (!question.optionD.trim()) newErrors.optionD = 'Option D is required';
        
        if (!question.correctOption) {
            newErrors.correctOption = 'Please select the correct answer';
        } else if (!['A', 'B', 'C', 'D'].includes(question.correctOption)) {
            newErrors.correctOption = 'Correct answer must be A, B, C, or D';
        }
        
        const marks = parseInt(question.marks, 10);
        if (isNaN(marks) || marks < 1 || marks > 10) {
            newErrors.marks = 'Marks must be between 1 and 10';
        }
        
        setQuestionErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveExam = async () => {
        if (!validateExam()) return;
        
        setSaving(true);
        try {
            const examData = {
                title: exam.title.trim(),
                description: exam.description.trim(),
                duration: parseInt(exam.duration, 10),
                createdBy: teacherUsername,
            };

            const res = await api.createExam(examData);
            setSavedExamId(res?.data?.examId);
            setErrors({});
            
            // Show success message
            alert('Exam created successfully! You can now add questions.');
            
        } catch (err) {
            setErrors({ api: err.response?.data?.message || 'Failed to create exam' });
        } finally {
            setSaving(false);
        }
    };

    const handleAddQuestion = async () => {
        if (!savedExamId) {
            alert('Please save the exam first before adding questions');
            return;
        }
        
        if (!validateQuestion()) return;
        
        setAddingQuestion(true);
        try {
            await api.addQuestionToExam(savedExamId, {
                questionText: question.questionText.trim(),
                optionA: question.optionA.trim(),
                optionB: question.optionB.trim(),
                optionC: question.optionC.trim(),
                optionD: question.optionD.trim(),
                correctOption: question.correctOption,
                marks: parseInt(question.marks, 10),
            });

            setQuestionsAdded((n) => n + 1);
            setAddedQuestions((prev) => [...prev, { ...question }]);
            
            // Reset question form
            setQuestion({
                questionText: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                correctOption: '',
                marks: '1',
            });
            setQuestionErrors({});
            
        } catch (err) {
            setQuestionErrors({ api: err.response?.data?.message || 'Failed to add question' });
        } finally {
            setAddingQuestion(false);
        }
    };

    const handleFinishExam = () => {
        if (questionsAdded === 0) {
            alert('Please add at least one question before finishing');
            return;
        }
        
        const confirmFinish = window.confirm(
            `You have created an exam with ${questionsAdded} questions. ` +
            'Would you like to go back to the dashboard?'
        );
        
        if (confirmFinish) {
            navigate('/teacher/dashboard');
        }
    };

    const handleCancel = () => {
        const confirmCancel = window.confirm(
            'Are you sure you want to cancel? Any unsaved changes will be lost.'
        );
        
        if (confirmCancel) {
            navigate('/teacher/dashboard');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="container">
                <div className="form-container">
                    <div className="form-header">
                        <h2 className="form-title">
                            {isEditing ? 'Edit Exam' : 'Create New Exam'}
                        </h2>
                        <p className="form-subtitle">
                            {isEditing ? 'Modify exam details and questions' : 'Set up your exam details and add questions'}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="form-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: savedExamId ? '100%' : '50%' }}
                            ></div>
                        </div>
                        <p className="progress-text">
                            Step {savedExamId ? '2' : '1'} of 2: {savedExamId ? 'Add Questions' : 'Exam Details'}
                        </p>
                    </div>

                    {/* Exam Details Section */}
                    <div className="form-section">
                        <h3>Exam Details</h3>
                        
                        {errors.api && (
                            <div className="error-message">{errors.api}</div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Title <span className="required-asterisk">*</span>
                                </label>
                                <input
                                    className={`form-input ${errors.title ? 'error' : ''}`}
                                    type="text"
                                    value={exam.title}
                                    onChange={(e) => setExam({ ...exam, title: e.target.value })}
                                    placeholder="Enter exam title"
                                    maxLength={100}
                                    disabled={saving}
                                />
                                {errors.title && <span className="form-error">{errors.title}</span>}
                                <span className="form-help">{exam.title.length}/100 characters</span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Duration (minutes) <span className="required-asterisk">*</span>
                                </label>
                                <input
                                    className={`form-input ${errors.duration ? 'error' : ''}`}
                                    type="number"
                                    value={exam.duration}
                                    onChange={(e) => setExam({ ...exam, duration: e.target.value })}
                                    placeholder="e.g., 60"
                                    min="10"
                                    max="180"
                                    disabled={saving}
                                />
                                {errors.duration && <span className="form-error">{errors.duration}</span>}
                                <span className="form-help">Between 10 and 180 minutes</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Description <span className="required-asterisk">*</span>
                            </label>
                            <textarea
                                className={`form-textarea ${errors.description ? 'error' : ''}`}
                                value={exam.description}
                                onChange={(e) => setExam({ ...exam, description: e.target.value })}
                                placeholder="Enter exam description and instructions"
                                maxLength={500}
                                rows={4}
                                disabled={saving}
                            />
                            {errors.description && <span className="form-error">{errors.description}</span>}
                            <span className="form-help">{exam.description.length}/500 characters</span>
                        </div>

                        <div className="form-actions">
                            <button 
                                className="btn btn-secondary" 
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            
                            {!savedExamId && (
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleSaveExam}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Exam & Add Questions'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Questions Section */}
                    {savedExamId && (
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Add Questions</h3>
                                <span className="questions-count">
                                    Questions Added: {questionsAdded}
                                </span>
                            </div>

                            {questionErrors.api && (
                                <div className="error-message">{questionErrors.api}</div>
                            )}

                            <div className="form-group">
                                <label className="form-label">
                                    Question Text <span className="required-asterisk">*</span>
                                </label>
                                <textarea
                                    className={`form-textarea ${questionErrors.questionText ? 'error' : ''}`}
                                    value={question.questionText}
                                    onChange={(e) => setQuestion({ ...question, questionText: e.target.value })}
                                    placeholder="Enter your question here"
                                    maxLength={500}
                                    rows={3}
                                    disabled={addingQuestion}
                                />
                                {questionErrors.questionText && (
                                    <span className="form-error">{questionErrors.questionText}</span>
                                )}
                                <span className="form-help">{question.questionText.length}/500 characters</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Option A <span className="required-asterisk">*</span></label>
                                    <input
                                        className={`form-input ${questionErrors.optionA ? 'error' : ''}`}
                                        type="text"
                                        value={question.optionA}
                                        onChange={(e) => setQuestion({ ...question, optionA: e.target.value })}
                                        placeholder="Enter option A"
                                        maxLength={200}
                                        disabled={addingQuestion}
                                    />
                                    {questionErrors.optionA && (
                                        <span className="form-error">{questionErrors.optionA}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Option B <span className="required-asterisk">*</span></label>
                                    <input
                                        className={`form-input ${questionErrors.optionB ? 'error' : ''}`}
                                        type="text"
                                        value={question.optionB}
                                        onChange={(e) => setQuestion({ ...question, optionB: e.target.value })}
                                        placeholder="Enter option B"
                                        maxLength={200}
                                        disabled={addingQuestion}
                                    />
                                    {questionErrors.optionB && (
                                        <span className="form-error">{questionErrors.optionB}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Option C <span className="required-asterisk">*</span></label>
                                    <input
                                        className={`form-input ${questionErrors.optionC ? 'error' : ''}`}
                                        type="text"
                                        value={question.optionC}
                                        onChange={(e) => setQuestion({ ...question, optionC: e.target.value })}
                                        placeholder="Enter option C"
                                        maxLength={200}
                                        disabled={addingQuestion}
                                    />
                                    {questionErrors.optionC && (
                                        <span className="form-error">{questionErrors.optionC}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Option D <span className="required-asterisk">*</span></label>
                                    <input
                                        className={`form-input ${questionErrors.optionD ? 'error' : ''}`}
                                        type="text"
                                        value={question.optionD}
                                        onChange={(e) => setQuestion({ ...question, optionD: e.target.value })}
                                        placeholder="Enter option D"
                                        maxLength={200}
                                        disabled={addingQuestion}
                                    />
                                    {questionErrors.optionD && (
                                        <span className="form-error">{questionErrors.optionD}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Correct Answer <span className="required-asterisk">*</span>
                                    </label>
                                    <select
                                        className={`form-select ${questionErrors.correctOption ? 'error' : ''}`}
                                        value={question.correctOption}
                                        onChange={(e) => setQuestion({ ...question, correctOption: e.target.value })}
                                        disabled={addingQuestion}
                                    >
                                        <option value="">Select correct answer</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                    {questionErrors.correctOption && (
                                        <span className="form-error">{questionErrors.correctOption}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Marks <span className="required-asterisk">*</span>
                                    </label>
                                    <input
                                        className={`form-input ${questionErrors.marks ? 'error' : ''}`}
                                        type="number"
                                        value={question.marks}
                                        onChange={(e) => setQuestion({ ...question, marks: e.target.value })}
                                        min="1"
                                        max="10"
                                        disabled={addingQuestion}
                                    />
                                    {questionErrors.marks && (
                                        <span className="form-error">{questionErrors.marks}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button 
                                    className="btn btn-outline" 
                                    onClick={handleAddQuestion}
                                    disabled={addingQuestion}
                                >
                                    {addingQuestion ? 'Adding...' : '+ Add Question'}
                                </button>
                                
                                {questionsAdded > 0 && (
                                    <button 
                                        className="btn btn-success" 
                                        onClick={handleFinishExam}
                                    >
                                        Finish Exam ({questionsAdded} questions)
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Added Questions Preview */}
                    {addedQuestions.length > 0 && (
                        <div className="form-section">
                            <h3>Added Questions</h3>
                            <div className="questions-preview">
                                {addedQuestions.map((q, i) => (
                                    <div key={i} className="question-preview">
                                        <div className="question-header">
                                            <span className="question-number">Q{i + 1}</span>
                                            <span className="question-marks">{q.marks} marks</span>
                                        </div>
                                        <div className="question-text">{q.questionText}</div>
                                        <div className="question-options">
                                            <div className={q.correctOption === 'A' ? 'correct-option' : ''}>A. {q.optionA}</div>
                                            <div className={q.correctOption === 'B' ? 'correct-option' : ''}>B. {q.optionB}</div>
                                            <div className={q.correctOption === 'C' ? 'correct-option' : ''}>C. {q.optionC}</div>
                                            <div className={q.correctOption === 'D' ? 'correct-option' : ''}>D. {q.optionD}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

