import React, { useState } from 'react';
import * as api from '../utils/api';

export default function SimpleExamCreator() {
    const [exam, setExam] = useState({
        title: '',
        description: '',
        duration: 60
    });
    const [loading, setLoading] = useState(false);
    const [examId, setExamId] = useState(null);

    const createExam = async () => {
        if (!exam.title.trim() || exam.title.length < 3) {
            alert('Title must be at least 3 characters');
            return;
        }
        
        setLoading(true);
        try {
            console.log('Creating exam:', exam);
            const response = await api.createExam(exam);
            console.log('Response:', response.data);
            setExamId(response.data.examId);
            alert('Exam created successfully! ID: ' + response.data.examId);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Create Exam</h2>
            
            <div style={{ marginBottom: '15px' }}>
                <label>Title:</label>
                <input
                    type="text"
                    value={exam.title}
                    onChange={(e) => setExam({...exam, title: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    placeholder="Enter exam title (min 3 characters)"
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Description:</label>
                <textarea
                    value={exam.description}
                    onChange={(e) => setExam({...exam, description: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px', height: '80px' }}
                    placeholder="Enter exam description"
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Duration (minutes):</label>
                <input
                    type="number"
                    value={exam.duration}
                    onChange={(e) => setExam({...exam, duration: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    min="10"
                    max="300"
                />
            </div>

            <button 
                onClick={createExam}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Creating...' : 'Create Exam'}
            </button>

            {examId && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
                    ✅ Exam created successfully! ID: {examId}
                </div>
            )}
        </div>
    );
}