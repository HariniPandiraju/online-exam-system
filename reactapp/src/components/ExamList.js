import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';

export default function ExamList() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadExams = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Loading exams...');
            const response = await api.getExamsByTeacher('teacher1');
            console.log('Exams loaded:', response.data);
            setExams(response.data || []);
        } catch (err) {
            console.error('Error loading exams:', err);
            setError('Failed to load exams: ' + (err.response?.data?.message || err.message));
        }
        setLoading(false);
    };

    useEffect(() => {
        loadExams();
    }, []);

    const toggleStatus = async (examId, currentStatus) => {
        try {
            await api.apiClient.patch(`/exams/${examId}/status`, { 
                isActive: !currentStatus 
            });
            loadExams(); // Reload
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>My Exams ({exams.length})</h2>
                <button onClick={loadExams} style={{ padding: '8px 16px' }}>
                    🔄 Refresh
                </button>
            </div>

            {loading && <div>Loading exams...</div>}
            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

            {!loading && exams.length === 0 && !error && (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>No exams found</h3>
                    <p>Create your first exam to get started</p>
                </div>
            )}

            <div style={{ display: 'grid', gap: '15px' }}>
                {exams.map(exam => (
                    <div key={exam.examId} style={{
                        border: '1px solid #ddd',
                        padding: '20px',
                        borderRadius: '8px',
                        backgroundColor: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 10px 0' }}>{exam.title}</h3>
                                <p style={{ margin: '0 0 10px 0', color: '#666' }}>{exam.description}</p>
                                <div style={{ fontSize: '14px', color: '#888' }}>
                                    Duration: {exam.duration} minutes | 
                                    Created: {new Date(exam.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    backgroundColor: exam.isActive ? '#d4edda' : '#f8d7da',
                                    color: exam.isActive ? '#155724' : '#721c24'
                                }}>
                                    {exam.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                                
                                <button
                                    onClick={() => toggleStatus(exam.examId, exam.isActive)}
                                    style={{
                                        padding: '6px 12px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        backgroundColor: exam.isActive ? '#dc3545' : '#28a745',
                                        color: 'white'
                                    }}
                                >
                                    {exam.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}