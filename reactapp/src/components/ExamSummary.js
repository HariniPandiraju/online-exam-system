import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';

export default function ExamSummary() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await api.getSimpleExams();
            setExams(res.data || []);
        } catch (error) {
            console.error('Failed to fetch exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (examId, currentStatus) => {
        try {
            if (currentStatus) {
                await api.deactivateSimpleExam(examId);
            } else {
                await api.activateSimpleExam(examId);
            }
            fetchExams(); // Refresh
        } catch (error) {
            alert('Failed to update status: ' + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>📋 Exam Management</h2>
            <p>Total Exams: {exams.length}</p>
            
            {exams.length === 0 ? (
                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>No Exams Created</h3>
                    <p>Create your first exam to get started!</p>
                    <a href="/test-create" style={{ 
                        display: 'inline-block', 
                        padding: '10px 20px', 
                        background: '#007bff', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '4px' 
                    }}>
                        Create Exam
                    </a>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {exams.map((exam) => (
                        <div key={exam.examId} style={{ 
                            padding: '15px', 
                            border: '1px solid #ddd', 
                            borderRadius: '8px',
                            background: exam.isActive ? '#e8f5e8' : '#fff3cd'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{exam.title}</h3>
                                    <p style={{ margin: '0 0 10px 0', color: '#666' }}>{exam.description}</p>
                                    <div style={{ fontSize: '14px', color: '#888' }}>
                                        Duration: {exam.duration} minutes | 
                                        Status: <strong style={{ color: exam.isActive ? 'green' : 'orange' }}>
                                            {exam.isActive ? 'Active' : 'Draft'}
                                        </strong>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleStatus(exam.examId, exam.isActive)}
                                    style={{
                                        padding: '8px 16px',
                                        background: exam.isActive ? '#dc3545' : '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {exam.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                    onClick={fetchExams}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    🔄 Refresh
                </button>
                <a href="/test-create" style={{ 
                    display: 'inline-block', 
                    padding: '10px 20px', 
                    background: '#007bff', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '4px' 
                }}>
                    ➕ Create New Exam
                </a>
            </div>
        </div>
    );
}