import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';

export default function ExamManager() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const response = await api.getExamsByTeacher('teacher1');
            setExams(response.data || []);
        } catch (error) {
            console.error('Error loading exams:', error);
        }
        setLoading(false);
    };

    const toggleExamStatus = async (examId, currentStatus) => {
        try {
            await api.apiClient.patch(`/exams/${examId}/status`, { 
                isActive: !currentStatus 
            });
            loadExams();
        } catch (error) {
            alert('Failed to update exam status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Exam Management</h2>
            {exams.map(exam => (
                <div key={exam.examId} style={{ 
                    border: '1px solid #ccc', 
                    padding: '15px', 
                    margin: '10px 0',
                    borderRadius: '5px'
                }}>
                    <h3>{exam.title}</h3>
                    <p>{exam.description}</p>
                    <p>Status: <strong>{exam.isActive ? 'ACTIVE' : 'INACTIVE'}</strong></p>
                    <button 
                        onClick={() => toggleExamStatus(exam.examId, exam.isActive)}
                        style={{ 
                            padding: '8px 16px',
                            backgroundColor: exam.isActive ? '#dc3545' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {exam.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            ))}
        </div>
    );
}