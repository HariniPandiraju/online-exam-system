import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';

export default function ExamFlow() {
    const [exams, setExams] = useState([]);
    const [activeExams, setActiveExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const loadExams = async () => {
        try {
            setLoading(true);
            // Get all exams (teacher view)
            const allExamsRes = await api.getExamsByTeacher('teacher1');
            setExams(allExamsRes.data || []);
            
            // Get active exams (student view)
            const activeExamsRes = await api.getAvailableExams();
            setActiveExams(activeExamsRes.data || []);
            
            setResult(`✅ Loaded ${allExamsRes.data?.length || 0} total exams, ${activeExamsRes.data?.length || 0} active exams`);
        } catch (error) {
            setResult(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const createTestExam = async () => {
        try {
            setLoading(true);
            const examData = {
                title: `Test Exam ${Date.now()}`,
                description: 'Auto-created test exam',
                duration: 30
            };
            
            const res = await api.createExam(examData);
            setResult(`✅ Created exam: ${res.data.title} (ID: ${res.data.examId})`);
            await loadExams();
        } catch (error) {
            setResult(`❌ Create failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleExamStatus = async (examId, currentStatus) => {
        try {
            setLoading(true);
            if (currentStatus) {
                await api.deactivateExam(examId);
                setResult(`✅ Deactivated exam ${examId}`);
            } else {
                await api.activateExam(examId);
                setResult(`✅ Activated exam ${examId}`);
            }
            await loadExams();
        } catch (error) {
            setResult(`❌ Toggle failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExams();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>🔄 Complete Exam Flow Test</h2>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button 
                    onClick={createTestExam} 
                    disabled={loading}
                    style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    ➕ Create Test Exam
                </button>
                <button 
                    onClick={loadExams} 
                    disabled={loading}
                    style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    🔄 Refresh
                </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
                <strong>Status:</strong> {loading ? '⏳ Loading...' : result}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Teacher View - All Exams */}
                <div>
                    <h3>👨🏫 Teacher View - All Exams ({exams.length})</h3>
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', maxHeight: '400px', overflow: 'auto' }}>
                        {exams.length === 0 ? (
                            <p>No exams found. Create one to test!</p>
                        ) : (
                            exams.map(exam => (
                                <div key={exam.examId} style={{ 
                                    padding: '10px', 
                                    border: '1px solid #eee', 
                                    borderRadius: '4px', 
                                    marginBottom: '10px',
                                    background: exam.isActive ? '#e8f5e8' : '#fff3cd'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{exam.title}</strong>
                                            <br />
                                            <small>{exam.description}</small>
                                            <br />
                                            <span style={{ 
                                                padding: '2px 6px', 
                                                borderRadius: '3px', 
                                                fontSize: '12px',
                                                background: exam.isActive ? '#28a745' : '#ffc107',
                                                color: exam.isActive ? 'white' : 'black'
                                            }}>
                                                {exam.isActive ? 'ACTIVE' : 'DRAFT'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => toggleExamStatus(exam.examId, exam.isActive)}
                                            disabled={loading}
                                            style={{
                                                padding: '5px 10px',
                                                background: exam.isActive ? '#dc3545' : '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {exam.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Student View - Active Exams Only */}
                <div>
                    <h3>🎓 Student View - Active Exams ({activeExams.length})</h3>
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', maxHeight: '400px', overflow: 'auto' }}>
                        {activeExams.length === 0 ? (
                            <p>No active exams available. Activate an exam to see it here!</p>
                        ) : (
                            activeExams.map(exam => (
                                <div key={exam.examId} style={{ 
                                    padding: '10px', 
                                    border: '1px solid #28a745', 
                                    borderRadius: '4px', 
                                    marginBottom: '10px',
                                    background: '#e8f5e8'
                                }}>
                                    <strong>{exam.title}</strong>
                                    <br />
                                    <small>{exam.description}</small>
                                    <br />
                                    <span style={{ fontSize: '12px', color: '#666' }}>
                                        Duration: {exam.duration} minutes
                                    </span>
                                    <br />
                                    <button style={{
                                        marginTop: '5px',
                                        padding: '5px 10px',
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}>
                                        🚀 Start Exam
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}