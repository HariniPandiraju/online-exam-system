import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../utils/api';
import '../styles/dashboard.css';

export default function ExamResults() {
    const { studentExamId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await api.getExamResults(studentExamId);
                setData(res.data);
            } catch (e) {
                setError(e.message || 'Failed to load results');
            } finally {
                setLoading(false);
            }
        };
        if (studentExamId) fetchResults();
    }, [studentExamId]);

    const calculatePercentage = () => {
        if (!data || !data.questions || data.questions.length === 0) return 0;
        const totalMarks = data.questions.reduce((sum, q) => sum + q.marks, 0);
        return totalMarks > 0 ? Math.round((data.score / totalMarks) * 100) : 0;
    };

    const getGrade = (percentage) => {
        if (percentage >= 90) return { grade: 'A+', color: '#22543d' };
        if (percentage >= 80) return { grade: 'A', color: '#2f855a' };
        if (percentage >= 70) return { grade: 'B+', color: '#38a169' };
        if (percentage >= 60) return { grade: 'B', color: '#48bb78' };
        if (percentage >= 50) return { grade: 'C', color: '#ed8936' };
        return { grade: 'F', color: '#e53e3e' };
    };

    const getCorrectAnswers = () => {
        if (!data || !data.questions) return 0;
        return data.questions.filter(q => q.isCorrect).length;
    };

    if (loading) return <div className="loading">Loading results...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!data) return <div className="error-message">No results available</div>;

    const percentage = calculatePercentage();
    const gradeInfo = getGrade(percentage);
    const correctAnswers = getCorrectAnswers();
    const totalQuestions = data.questions?.length || 0;

    return (
        <div className="dashboard-container">
            <div className="container">
                {/* Results Header */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title">Exam Results</h1>
                        <h2 className="welcome-subtitle">{data.examTitle}</h2>
                        <p>{data.description}</p>
                    </div>
                </div>

                {/* Score Summary */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-number" style={{ color: gradeInfo.color }}>
                            {data.score}
                        </span>
                        <span className="stat-label">Total Score</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number" style={{ color: gradeInfo.color }}>
                            {percentage}%
                        </span>
                        <span className="stat-label">Percentage</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number" style={{ color: gradeInfo.color }}>
                            {gradeInfo.grade}
                        </span>
                        <span className="stat-label">Grade</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{correctAnswers}/{totalQuestions}</span>
                        <span className="stat-label">Correct Answers</span>
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="dashboard-card">
                    <div className="card-icon">📊</div>
                    <h3 className="card-title">Performance Summary</h3>
                    <div className="card-description">
                        <p>You answered <strong>{correctAnswers}</strong> out of <strong>{totalQuestions}</strong> questions correctly.</p>
                        <p>Your final score is <strong>{data.score}</strong> points with a percentage of <strong>{percentage}%</strong>.</p>
                        <p>Grade: <strong style={{ color: gradeInfo.color }}>{gradeInfo.grade}</strong></p>
                    </div>
                    <div className="form-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/student/exams')}
                        >
                            Back to Exams
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => window.print()}
                        >
                            Print Results
                        </button>
                    </div>
                </div>

                {/* Detailed Question Analysis */}
                <div className="list-container">
                    <div className="list-header">
                        <h2 className="list-title">Question Analysis</h2>
                        <span className="list-count">{totalQuestions} questions</span>
                    </div>

                    <div className="list-body">
                        {data.questions && data.questions.map((q, i) => (
                            <div key={i} className="list-item">
                                <div className="item-header">
                                    <h3 className="item-title">Question {i + 1}</h3>
                                    <div className="item-meta">
                                        <span className={`status-badge ${q.isCorrect ? 'status-completed' : 'status-inactive'}`}>
                                            {q.isCorrect ? `Correct (+${q.marksEarned})` : 'Incorrect (0)'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="item-description">
                                    <strong>Q:</strong> {q.questionText}
                                </div>

                                <div className="item-stats">
                                    <div className="stat-item">
                                        <span className="stat-icon">A.</span>
                                        <span className={q.correctOption === 'A' ? 'correct-answer' : ''}>{q.optionA}</span>
                                        {q.selectedOption === 'A' && <span style={{ color: '#667eea', fontWeight: 'bold' }}> (Your Answer)</span>}
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-icon">B.</span>
                                        <span className={q.correctOption === 'B' ? 'correct-answer' : ''}>{q.optionB}</span>
                                        {q.selectedOption === 'B' && <span style={{ color: '#667eea', fontWeight: 'bold' }}> (Your Answer)</span>}
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-icon">C.</span>
                                        <span className={q.correctOption === 'C' ? 'correct-answer' : ''}>{q.optionC}</span>
                                        {q.selectedOption === 'C' && <span style={{ color: '#667eea', fontWeight: 'bold' }}> (Your Answer)</span>}
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-icon">D.</span>
                                        <span className={q.correctOption === 'D' ? 'correct-answer' : ''}>{q.optionD}</span>
                                        {q.selectedOption === 'D' && <span style={{ color: '#667eea', fontWeight: 'bold' }}> (Your Answer)</span>}
                                    </div>
                                </div>

                                <div className="item-actions">
                                    <div className="action-btn-small" style={{ 
                                        background: q.isCorrect ? '#c6f6d5' : '#fed7d7',
                                        color: q.isCorrect ? '#22543d' : '#742a2a',
                                        border: `1px solid ${q.isCorrect ? '#9ae6b4' : '#feb2b2'}`
                                    }}>
                                        {q.isCorrect ? '✅' : '❌'} Correct Answer: {q.correctOption}
                                    </div>
                                    <div className="action-btn-small" style={{ 
                                        background: '#ebf8ff',
                                        color: '#2a4365',
                                        border: '1px solid #bee3f8'
                                    }}>
                                        {q.marks} marks
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
