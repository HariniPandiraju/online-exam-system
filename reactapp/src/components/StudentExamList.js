import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../utils/api';
import '../styles/lists.css';
import '../styles/dashboard.css';

export default function StudentExamList() {
    const [exams, setExams] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [startingExam, setStartingExam] = useState(null);
    const navigate = useNavigate();

    // Get current user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentUsername = user.username || 'student1';

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.getAvailableExams();
            setExams(res.data || []);
        } catch (e) {
            setError(e.response?.data?.message || e.message || 'Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = async (examId, examTitle) => {
        const confirmStart = window.confirm(
            `Are you ready to start "${examTitle}"?\n\n` +
            'Once started, the timer will begin and you must complete the exam within the time limit.'
        );

        if (!confirmStart) return;

        setStartingExam(examId);
        try {
            const response = await api.startExam(examId, studentUsername);
            const { studentExamId, questions } = response.data;
            
            // Navigate to exam interface with questions data
            navigate(`/student/exams/${studentExamId}`, {
                state: {
                    questions,
                    exam: exams.find(e => e.examId === examId),
                    studentExamId,
                    studentUsername
                }
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to start exam');
        } finally {
            setStartingExam(null);
        }
    };

    const formatDuration = (minutes) => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
        }
        return `${minutes} minutes`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <div className="loading">Loading available exams...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <div className="container">
                {/* Header */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title">Available Exams</h1>
                        <p className="welcome-subtitle">
                            Choose an exam to start. Make sure you have enough time to complete it.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-number">{exams.length}</span>
                        <span className="stat-label">Available Exams</span>
                    </div>
                </div>

                {/* Exams List */}
                <div className="list-container">
                    <div className="list-header">
                        <h2 className="list-title">Exams</h2>
                        <span className="list-count">{exams.length} available</span>
                    </div>

                    <div className="list-body">
                        {exams.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📝</div>
                                <h3 className="empty-title">No Exams Available</h3>
                                <p className="empty-description">
                                    There are currently no active exams. Please check back later or contact your teacher.
                                </p>
                                <button 
                                    className="empty-action"
                                    onClick={() => navigate('/student/dashboard')}
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        ) : (
                            exams.map((exam) => (
                                <div key={exam.examId} className="list-item">
                                    <div className="item-header">
                                        <h3 className="item-title">{exam.title}</h3>
                                        <div className="item-meta">
                                            <span className="status-badge status-active">
                                                Available
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="item-description">{exam.description}</p>
                                    
                                    <div className="item-stats">
                                        <div className="stat-item">
                                            <span className="stat-icon">⏱️</span>
                                            <span>Duration: {formatDuration(exam.duration)}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-icon">📅</span>
                                            <span>Created: {formatDate(exam.createdAt)}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-icon">👨‍🏫</span>
                                            <span>By: {exam.createdBy}</span>
                                        </div>
                                    </div>

                                    <div className="item-actions">
                                        <button
                                            className="action-btn-small btn-view"
                                            onClick={() => handleStartExam(exam.examId, exam.title)}
                                            disabled={startingExam === exam.examId}
                                        >
                                            {startingExam === exam.examId ? (
                                                <>⏳ Starting...</>
                                            ) : (
                                                <>🚀 Start Exam</>
                                            )}
                                        </button>
                                        
                                        <div className="action-btn-small" style={{
                                            background: '#f0fff4',
                                            color: '#22543d',
                                            border: '1px solid #9ae6b4',
                                            cursor: 'default'
                                        }}>
                                            📊 MCQ Format
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Instructions */}
                {exams.length > 0 && (
                    <div className="dashboard-card">
                        <div className="card-icon">💡</div>
                        <h3 className="card-title">Exam Instructions</h3>
                        <div className="card-description">
                            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem' }}>
                                <li>Ensure you have a stable internet connection</li>
                                <li>Do not refresh or close the browser during the exam</li>
                                <li>Your answers are automatically saved every 30 seconds</li>
                                <li>Submit your exam before the time runs out</li>
                                <li>You can navigate between questions using the question palette</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
