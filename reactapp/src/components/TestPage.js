import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';

export default function TestPage() {
    const [exams, setExams] = useState([]);
    const [activeExams, setActiveExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newExam, setNewExam] = useState({ title: '', description: '', duration: 60 });

    const loadExams = async () => {
        setLoading(true);
        try {
            const response = await api.getExamsByTeacher('teacher1');
            setExams(response.data || []);
            
            const activeResponse = await api.getAvailableExams();
            setActiveExams(activeResponse.data || []);
        } catch (error) {
            console.error('Error loading exams:', error);
        }
        setLoading(false);
    };

    const createTestExam = async () => {
        if (!newExam.title.trim() || newExam.title.length < 3) {
            alert('Title must be at least 3 characters');
            return;
        }
        
        try {
            console.log('Creating exam:', newExam);
            const response = await api.createExam(newExam);
            console.log('Exam created:', response.data);
            alert('Exam created with ID: ' + response.data.examId);
            setNewExam({ title: '', description: '', duration: 60 });
            loadExams();
        } catch (error) {
            console.error('Error creating exam:', error);
            alert('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    const toggleExamStatus = async (examId, currentStatus) => {
        try {
            await api.apiClient.patch(`/exams/${examId}/status`, { 
                isActive: !currentStatus 
            });
            loadExams();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        loadExams();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>Exam Management Test Page</h2>
            
            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>Create New Exam</h3>
                <div style={{ display: 'grid', gap: '10px', marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="Exam title (min 3 characters)"
                        value={newExam.title}
                        onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <textarea
                        placeholder="Exam description"
                        value={newExam.description}
                        onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                        style={{ padding: '8px', height: '60px' }}
                    />
                    <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={newExam.duration}
                        onChange={(e) => setNewExam({...newExam, duration: parseInt(e.target.value)})}
                        style={{ padding: '8px' }}
                        min="10"
                        max="300"
                    />
                </div>
                <button onClick={createTestExam} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Create Exam
                </button>
                <button onClick={loadExams} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Refresh
                </button>
            </div>

            {loading && <p>Loading...</p>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* All Exams */}
                <div>
                    <h3>All Exams ({exams.length})</h3>
                    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                        {exams.length === 0 ? (
                            <p>No exams found</p>
                        ) : (
                            exams.map(exam => (
                                <div key={exam.examId} style={{ 
                                    border: '1px solid #ddd', 
                                    padding: '10px', 
                                    margin: '10px 0',
                                    borderRadius: '5px',
                                    backgroundColor: exam.isActive ? '#e8f5e8' : '#f8f8f8'
                                }}>
                                    <h4>{exam.title}</h4>
                                    <p>{exam.description}</p>
                                    <p>Duration: {exam.duration} minutes</p>
                                    <p>Status: {exam.isActive ? 'ACTIVE' : 'INACTIVE'}</p>
                                    <button 
                                        onClick={() => toggleExamStatus(exam.examId, exam.isActive)}
                                        style={{ 
                                            padding: '5px 10px',
                                            backgroundColor: exam.isActive ? '#dc3545' : '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {exam.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Active Exams (Student View) */}
                <div>
                    <h3>Active Exams - Student View ({activeExams.length})</h3>
                    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                        {activeExams.length === 0 ? (
                            <p>No active exams available for students</p>
                        ) : (
                            activeExams.map(exam => (
                                <div key={exam.examId} style={{ 
                                    border: '1px solid #28a745', 
                                    padding: '10px', 
                                    margin: '10px 0',
                                    borderRadius: '5px',
                                    backgroundColor: '#e8f5e8'
                                }}>
                                    <h4>{exam.title}</h4>
                                    <p>{exam.description}</p>
                                    <p>Duration: {exam.duration} minutes</p>
                                    <p style={{ color: '#28a745', fontWeight: 'bold' }}>✓ AVAILABLE TO STUDENTS</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}