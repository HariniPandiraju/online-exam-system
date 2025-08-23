import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import ExamCreator from './components/ExamCreator';
import StudentExamList from './components/StudentExamList';
import ExamInterface from './components/ExamInterface';
import ExamResults from './components/ExamResults';
import TeacherDashboard from './components/TeacherDashboard';
import Login from './components/Login';
import Signup from './components/Signup';

// Import all styles
import './styles/index.css';
import './styles/navigation.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/forms.css';
import './styles/lists.css';
import './styles/exam.css';

function ProtectedRoute({ children, requiredRole }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (!requiredRole || parsedUser.role === requiredRole) {
                setUser(parsedUser);
            }
        }
        setLoading(false);
    }, [requiredRole]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <Login />;
    }

    return children;
}

function ExamInterfaceWrapper() {
    const location = useLocation();
    const params = useParams();
    
    if (!location.state) {
        return (
            <ExamInterface
                location={{
                    state: {
                        questions: [
                            {
                                questionId: 11,
                                questionText: 'Fallback Q1?',
                                optionA: 'A',
                                optionB: 'B',
                                optionC: 'C',
                                optionD: 'D',
                                marks: 2,
                            }
                        ],
                        exam: { duration: 15 },
                        studentExamId: params.studentExamId,
                        studentUsername: 'student1',
                    }
                }}
            />
        );
    }
    return <ExamInterface location={location} />;
}

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <Router>
            <Navbar />
            
            <Routes>
                <Route path="/" element={
                    <div className="dashboard-container">
                        <div className="container">
                            <div className="welcome-section">
                                <div className="welcome-content">
                                    <h1 className="welcome-title">Online Exam System</h1>
                                    {user ? (
                                        <div>
                                            <p className="welcome-subtitle">Welcome back, {user.fullName || user.name || user.username}!</p>
                                            <p>Role: {user.role}</p>
                                            <div className="welcome-actions">
                                                {user.role === 'TEACHER' ? (
                                                    <>
                                                        <a href="/teacher/dashboard" className="welcome-btn">Go to Dashboard</a>
                                                        <a href="/create-exam" className="welcome-btn">Create New Exam</a>
                                                    </>
                                                ) : (
                                                    <>
                                                        <a href="/student/dashboard" className="welcome-btn">Go to Dashboard</a>
                                                        <a href="/student/exams" className="welcome-btn">View Exams</a>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="welcome-subtitle">Please login to access the exam system.</p>
                                            <div className="welcome-actions">
                                                <a href="/login" className="welcome-btn">Login</a>
                                                <a href="/signup" className="welcome-btn">Sign Up</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                } />
                
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Teacher Routes */}
                <Route path="/teacher/dashboard" element={
                    <ProtectedRoute requiredRole="TEACHER">
                        <TeacherDashboard teacherUsername={user?.username || 'teacher1'} />
                    </ProtectedRoute>
                } />
                
                <Route path="/create-exam" element={
                    <ProtectedRoute requiredRole="TEACHER">
                        <ExamCreator />
                    </ProtectedRoute>
                } />

                <Route path="/edit-exam/:examId" element={
                    <ProtectedRoute requiredRole="TEACHER">
                        <ExamCreator />
                    </ProtectedRoute>
                } />
                
                {/* Student Routes */}
                <Route path="/student/dashboard" element={
                    <ProtectedRoute requiredRole="STUDENT">
                        <div className="dashboard-container">
                            <div className="container">
                                <div className="welcome-section">
                                    <div className="welcome-content">
                                        <h1 className="welcome-title">Student Dashboard</h1>
                                        <p className="welcome-subtitle">Welcome, {user?.fullName || user?.name || user?.username}!</p>
                                        <div className="welcome-actions">
                                            <a href="/student/exams" className="welcome-btn">View Available Exams</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
                
                <Route path="/student/exams" element={
                    <ProtectedRoute requiredRole="STUDENT">
                        <StudentExamList />
                    </ProtectedRoute>
                } />
                
                <Route path="/student/exams/:studentExamId" element={
                    <ProtectedRoute requiredRole="STUDENT">
                        <ExamInterfaceWrapper />
                    </ProtectedRoute>
                } />
                
                <Route path="/student/results/:studentExamId" element={
                    <ProtectedRoute requiredRole="STUDENT">
                        <ExamResults />
                    </ProtectedRoute>
                } />

                {/* About and Contact pages */}
                <Route path="/about" element={
                    <div className="dashboard-container">
                        <div className="container">
                            <h1>About Us</h1>
                            <p>This is an online exam system for educational institutions.</p>
                        </div>
                    </div>
                } />

                <Route path="/contact" element={
                    <div className="dashboard-container">
                        <div className="container">
                            <h1>Contact Us</h1>
                            <p>Email: support@examsystem.com</p>
                            <p>Phone: +1-234-567-8900</p>
                        </div>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;
