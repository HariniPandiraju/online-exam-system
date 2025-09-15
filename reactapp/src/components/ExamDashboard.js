import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';

export default function ExamDashboard() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newExam, setNewExam] = useState({
        title: '',
        description: '',
        duration: 60
    });

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        setLoading(true);
        try {
            const response = await api.getExamsByTeacher('teacher1');
            setExams(response.data || []);
            console.log('Loaded exams:', response.data);
        } catch (error) {
            console.error('Error loading exams:', error);
            alert('Error loading exams: ' + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    const createExam = async () => {
        if (!newExam.title.trim() || newExam.title.length < 3) {
            alert('Title must be at least 3 characters');
            return;
        }
        
        setCreating(true);
        try {
            const response = await api.createExam(newExam);
            console.log('Exam created:', response.data);
            alert('Exam created successfully!');
            setNewExam({ title: '', description: '', duration: 60 });
            loadExams();
        } catch (error) {
            console.error('Error creating exam:', error);
            alert('Error creating exam: ' + (error.response?.data?.message || error.message));
        }
        setCreating(false);
    };

    const toggleStatus = async (examId, currentStatus) => {
        try {
            await api.apiClient.patch(`/exams/${examId}/status`, { 
                isActive: !currentStatus 
            });
            console.log('Status updated for exam:', examId);
            loadExams();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Exam Management Dashboard</h1>
            
            {/* Create Exam Section */}
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '30px' 
            }}>
                <h2>Create New Exam</h2>
                <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={newExam.title}
                            onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                            placeholder="Enter exam title (minimum 3 characters)"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                marginTop: '5px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={newExam.description}
                            onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                            placeholder="Enter exam description"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                marginTop: '5px',
                                height: '80px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    
                    <div>
                        <label>Duration (minutes):</label>
                        <input
                            type="number"
                            value={newExam.duration}
                            onChange={(e) => setNewExam({...newExam, duration: parseInt(e.target.value)})}
                            min="10"
                            max="300"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                marginTop: '5px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                </div>
                
                <button 
                    onClick={createExam}
                    disabled={creating}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: creating ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {creating ? 'Creating...' : 'Create Exam'}
                </button>
            </div>

            {/* Exams List Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>My Exams ({exams.length})</h2>
                    <button 
                        onClick={loadExams}
                        disabled={loading}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Loading...' : '🔄 Refresh'}
                    </button>
                </div>

                {loading && <div>Loading exams...</div>}

                {!loading && exams.length === 0 && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        color: '#666'
                    }}>
                        <h3>No exams created yet</h3>
                        <p>Create your first exam using the form above</p>
                    </div>
                )}

                <div style={{ display: 'grid', gap: '15px' }}>
                    {exams.map(exam => (
                        <div key={exam.examId} style={{
                            border: '1px solid #ddd',
                            padding: '20px',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{exam.title}</h3>
                                    <p style={{ margin: '0 0 15px 0', color: '#666' }}>{exam.description}</p>
                                    <div style={{ fontSize: '14px', color: '#888' }}>
                                        <span>Duration: {exam.duration} minutes</span>
                                        <span style={{ marginLeft: '20px' }}>
                                            Created: {new Date(exam.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        borderRadius: '15px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        backgroundColor: exam.isActive ? '#d4edda' : '#f8d7da',
                                        color: exam.isActive ? '#155724' : '#721c24'
                                    }}>
                                        {exam.isActive ? '✅ ACTIVE' : '❌ INACTIVE'}
                                    </span>
                                    
                                    <button
                                        onClick={() => toggleStatus(exam.examId, exam.isActive)}
                                        style={{
                                            padding: '8px 16px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
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
        </div>
    );
}