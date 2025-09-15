import React, { useState } from 'react';
import * as api from '../utils/api';

export default function DatabaseTest() {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testCreateExam = async () => {
        setLoading(true);
        try {
            const examData = {
                title: 'Database Test Exam',
                description: 'Testing database connection',
                duration: 30
            };
            
            console.log('Creating exam with data:', examData);
            const response = await api.createExam(examData);
            console.log('Response:', response);
            
            setResult(`✅ SUCCESS: Exam created in database!\n` +
                     `Exam ID: ${response.data.examId}\n` +
                     `Title: ${response.data.title}\n` +
                     `Response: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            console.error('Error:', error);
            setResult(`❌ ERROR: ${error.message}\n` +
                     `Details: ${error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No response data'}\n` +
                     `Status: ${error.response?.status || 'No status'}`);
        } finally {
            setLoading(false);
        }
    };

    const testGetExams = async () => {
        setLoading(true);
        try {
            console.log('Getting exams from database...');
            const response = await api.getExamsByTeacher('teacher1');
            console.log('Response:', response);
            
            setResult(`✅ SUCCESS: Retrieved ${response.data.length} exams from database!\n` +
                     `Exams: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            console.error('Error:', error);
            setResult(`❌ ERROR: ${error.message}\n` +
                     `Details: ${error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No response data'}`);
        } finally {
            setLoading(false);
        }
    };

    const testConnection = async () => {
        setLoading(true);
        try {
            console.log('Testing basic connection...');
            const response = await fetch('http://localhost:9090/api/exams?createdBy=teacher1');
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                setResult(`✅ SUCCESS: Backend connection working!\n` +
                         `Status: ${response.status}\n` +
                         `Data: ${JSON.stringify(data, null, 2)}`);
            } else {
                setResult(`❌ ERROR: Backend responded with status ${response.status}\n` +
                         `Response: ${await response.text()}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setResult(`❌ ERROR: Cannot connect to backend\n` +
                     `Message: ${error.message}\n` +
                     `Make sure Spring Boot server is running on port 9090`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>🗄️ Database Connection Test</h2>
            <p>Test the connection between React frontend, Spring Boot backend, and MySQL database.</p>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                    onClick={testConnection} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    🌐 Test Backend Connection
                </button>
                
                <button 
                    onClick={testCreateExam} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    📝 Test Create Exam (Database)
                </button>
                
                <button 
                    onClick={testGetExams} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#17a2b8', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    📋 Test Get Exams (Database)
                </button>
            </div>
            
            <div style={{ 
                background: '#f8f9fa', 
                border: '1px solid #dee2e6',
                padding: '15px', 
                borderRadius: '8px',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '14px',
                maxHeight: '400px',
                overflow: 'auto'
            }}>
                {loading ? '⏳ Testing...' : result || '💡 Click a button above to test database connectivity'}
            </div>
            
            <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
                <h3>📋 Prerequisites:</h3>
                <ul>
                    <li>✅ MySQL server running on localhost:3306</li>
                    <li>✅ Database 'projectdb' exists</li>
                    <li>✅ Spring Boot server running on localhost:9090</li>
                    <li>✅ React app running on localhost:3000</li>
                </ul>
                
                <h4>🔧 If tests fail:</h4>
                <ol>
                    <li>Check MySQL is running: <code>mysql -u root -p</code></li>
                    <li>Create database: <code>CREATE DATABASE IF NOT EXISTS projectdb;</code></li>
                    <li>Start Spring Boot: <code>cd springapp && mvn spring-boot:run</code></li>
                    <li>Check backend logs for database connection errors</li>
                </ol>
            </div>
        </div>
    );
}