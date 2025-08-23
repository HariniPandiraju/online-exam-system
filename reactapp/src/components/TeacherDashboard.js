// src/components/TeacherDashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../utils/api';
import '../styles/dashboard.css';
import '../styles/lists.css';

export default function TeacherDashboard({ teacherUsername }) {
    const [exams, setExams] = useState([]);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, [teacherUsername]);

    const fetchExams = async () => {
        if (!teacherUsername) return;
        
        try {
            setLoading(true);
            setErr('');
            const res = await api.getExamsByTeacher(teacherUsername);
            const examList = res.data || [];
            setExams(examList);
            
            // Calculate stats
            const total = examList.length;
            const active = examList.filter(exam => exam.isActive).length;
            const inactive = total - active;
            setStats({ total, active, inactive });
            
        } catch (e) {
            setErr(e.message || 'Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (examId, currentStatus) => {
        try {
            if (currentStatus) {
                await api.deactivateExam(examId);
            } else {
                await api.activateExam(examId);
            }
            await fetchExams(); // Refresh the list
        } catch (error) {
            alert('Failed to update exam status');
        }
    };

    const handleCreateExam = () => {
        navigate('/create-exam');
    };

    const handleEditExam = (examId) => {
        navigate(`/edit-exam/${examId}`);
    };

    const handleViewResults = (examId) => {
        navigate(`/exam-results/${examId}`);
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (err) return <div className="error-message">{err}</div>;

    return (
        <div className="dashboard-container">
            <div className="container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title">Welcome Back, {teacherUsername}!</h1>
                        <p className="welcome-subtitle">Manage your exams and track student performance</p>
                        <div className="welcome-actions">
                            <button className="welcome-btn" onClick={handleCreateExam}>
                                + Create New Exam
                            </button>
                            <Link to="/question-bank" className="welcome-btn">
                                Question Bank
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total Exams</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.active}</span>
                        <span className="stat-label">Active Exams</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.inactive}</span>
                        <span className="stat-label">Draft Exams</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <div className="card-icon">📝</div>
                        <h3 className="card-title">Create New Exam</h3>
                        <p className="card-description">
                            Create a new exam with multiple choice questions and configure settings.
                        </p>
                        <button className="card-action" onClick={handleCreateExam}>
                            Create Exam
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon">📊</div>
                        <h3 className="card-title">View Reports</h3>
                        <p className="card-description">
                            Analyze student performance and generate detailed reports.
                        </p>
                        <Link to="/reports" className="card-action">
                            View Reports
                        </Link>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon">🏦</div>
                        <h3 className="card-title">Question Bank</h3>
                        <p className="card-description">
                            Manage and organize your question library for reuse across exams.
                        </p>
                        <Link to="/question-bank" className="card-action">
                            Manage Questions
                        </Link>
                    </div>
                </div>

                {/* Exams List */}
                <div className="list-container">
                    <div className="list-header">
                        <h2 className="list-title">My Exams</h2>
                        <span className="list-count">{exams.length} exams</span>
                    </div>

                    <div className="list-body">
                        {exams.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📝</div>
                                <h3 className="empty-title">No Exams Created Yet</h3>
                                <p className="empty-description">
                                    Get started by creating your first exam. Add questions and activate it for students.
                                </p>
                                <button className="empty-action" onClick={handleCreateExam}>
                                    Create Your First Exam
                                </button>
                            </div>
                        ) : (
                            exams.map((exam) => (
                                <div key={exam.examId} className="list-item">
                                    <div className="item-header">
                                        <h3 className="item-title">{exam.title}</h3>
                                        <div className="item-meta">
                                            <span className={`status-badge ${exam.isActive ? 'status-active' : 'status-inactive'}`}>
                                                {exam.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="item-description">{exam.description}</p>
                                    
                                    <div className="item-stats">
                                        <div className="stat-item">
                                            <span className="stat-icon">⏱️</span>
                                            <span>{exam.duration} minutes</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-icon">📅</span>
                                            <span>Created {new Date(exam.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="item-actions">
                                        <button 
                                            className="action-btn-small btn-view"
                                            onClick={() => handleViewResults(exam.examId)}
                                        >
                                            📊 View Results
                                        </button>
                                        
                                        <button 
                                            className="action-btn-small btn-edit"
                                            onClick={() => handleEditExam(exam.examId)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        
                                        <button
                                            className={`action-btn-small ${exam.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                                            onClick={() => handleToggleStatus(exam.examId, exam.isActive)}
                                        >
                                            {exam.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
