import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function SimpleExamInterface() {
    const { examId } = useParams();
    const [examData, setExamData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock exam data - in real app, this would come from the start exam API
        const mockExamData = {
            examId: examId,
            title: 'Sample Exam',
            duration: 30,
            questions: [
                {
                    questionId: 1,
                    questionText: 'What is 2 + 2?',
                    optionA: '3',
                    optionB: '4',
                    optionC: '5',
                    optionD: '6',
                    marks: 1
                },
                {
                    questionId: 2,
                    questionText: 'What is the capital of France?',
                    optionA: 'London',
                    optionB: 'Berlin',
                    optionC: 'Paris',
                    optionD: 'Madrid',
                    marks: 1
                }
            ]
        };
        
        setExamData(mockExamData);
        setTimeLeft(mockExamData.duration * 60); // Convert to seconds
        setLoading(false);
    }, [examId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && examData) {
            handleSubmitExam();
        }
    }, [timeLeft, examData]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleSubmitExam = () => {
        const score = examData.questions.reduce((total, question) => {
            const correctAnswers = {
                1: 'B', // 2+2=4
                2: 'C'  // Paris
            };
            return total + (answers[question.questionId] === correctAnswers[question.questionId] ? question.marks : 0);
        }, 0);

        alert(`Exam Submitted!\nYour Score: ${score}/${examData.questions.length}\nAnswers: ${JSON.stringify(answers)}`);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div>Loading exam...</div>;
    if (!examData) return <div>Exam not found</div>;

    const question = examData.questions[currentQuestion];

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h2 style={{ margin: 0 }}>{examData.title}</h2>
                <div style={{ 
                    padding: '8px 16px', 
                    background: timeLeft < 300 ? '#dc3545' : '#28a745',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}>
                    Time Left: {formatTime(timeLeft)}
                </div>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Question {currentQuestion + 1} of {examData.questions.length}</span>
                    <span>{Object.keys(answers).length} answered</span>
                </div>
                <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: '#e9ecef', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        width: `${((currentQuestion + 1) / examData.questions.length) * 100}%`,
                        height: '100%',
                        background: '#007bff',
                        transition: 'width 0.3s'
                    }}></div>
                </div>
            </div>

            {/* Question */}
            <div style={{ 
                padding: '20px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3 style={{ marginBottom: '20px' }}>
                    Q{currentQuestion + 1}. {question.questionText} ({question.marks} mark{question.marks > 1 ? 's' : ''})
                </h3>
                
                <div style={{ display: 'grid', gap: '10px' }}>
                    {['A', 'B', 'C', 'D'].map(option => (
                        <label key={option} style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '12px',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: answers[question.questionId] === option ? '#e7f3ff' : 'white'
                        }}>
                            <input
                                type="radio"
                                name={`question-${question.questionId}`}
                                value={option}
                                checked={answers[question.questionId] === option}
                                onChange={() => handleAnswerChange(question.questionId, option)}
                                style={{ marginRight: '10px' }}
                            />
                            <span>{option}. {question[`option${option}`]}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    style={{
                        padding: '10px 20px',
                        background: currentQuestion === 0 ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    ← Previous
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {examData.questions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentQuestion(index)}
                            style={{
                                width: '40px',
                                height: '40px',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px',
                                background: answers[examData.questions[index].questionId] 
                                    ? '#28a745' 
                                    : index === currentQuestion 
                                        ? '#007bff' 
                                        : 'white',
                                color: answers[examData.questions[index].questionId] || index === currentQuestion 
                                    ? 'white' 
                                    : 'black',
                                cursor: 'pointer'
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {currentQuestion === examData.questions.length - 1 ? (
                    <button
                        onClick={handleSubmitExam}
                        style={{
                            padding: '10px 20px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Submit Exam
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQuestion(Math.min(examData.questions.length - 1, currentQuestion + 1))}
                        style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Next →
                    </button>
                )}
            </div>
        </div>
    );
}