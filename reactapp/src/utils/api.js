import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ----------- Authentication Endpoints -----------
export const login = (credentials) => 
    apiClient.post('/auth/login', credentials);

export const register = (userData) => 
    apiClient.post('/auth/register', userData);

export const logout = () => 
    apiClient.post('/auth/logout');

// ----------- Teacher Endpoints -----------
export const createExam = (examData) =>
    apiClient.post('/exams', examData);

export const addQuestionToExam = (examId, questionData) =>
    apiClient.post(`/exams/${examId}/questions`, questionData);

export const getExamsByTeacher = (teacherUsername) =>
    apiClient.get('/exams', { params: { createdBy: teacherUsername } });

export const activateExam = (examId) =>
    apiClient.patch(`/exams/${examId}/status`, { isActive: true });

export const deactivateExam = (examId) =>
    apiClient.patch(`/exams/${examId}/status`, { isActive: false });

export const getExamById = (examId) =>
    apiClient.get(`/exams/${examId}`);

// ----------- Student Endpoints -----------
export const getAvailableExams = () =>
    apiClient.get('/student/exams');

export const startExam = (examId, studentUsername) =>
    apiClient.post(`/student/exams/${examId}/start`, { studentUsername });

export const submitAnswer = (studentExamId, questionId, selectedOption) =>
    apiClient.post(`/student/exams/${studentExamId}/answers`, {
        questionId,
        selectedOption,
    });

export const completeExam = (studentExamId) =>
    apiClient.post(`/student/exams/${studentExamId}/complete`);

export const getExamResults = (studentExamId) =>
    apiClient.get(`/student/exams/${studentExamId}/results`);

// Default export
export default {
    login,
    register,
    logout,
    createExam,
    addQuestionToExam,
    getExamsByTeacher,
    activateExam,
    deactivateExam,
    getExamById,
    getAvailableExams,
    startExam,
    submitAnswer,
    completeExam,
    getExamResults,
};
