# Online Exam System - Startup Guide

## Prerequisites
1. **MySQL Server** - Running on port 3306
2. **Java 17+** - For Spring Boot
3. **Node.js 16+** - For React app
4. **Maven** - For building Spring Boot app

## Step-by-Step Startup

### 1. Setup Database
```sql
-- Connect to MySQL and run:
CREATE DATABASE IF NOT EXISTS projectdb;
USE projectdb;
GRANT ALL PRIVILEGES ON projectdb.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Start Backend (Spring Boot)
```bash
cd springapp
mvn clean install
mvn spring-boot:run
```
- Backend will run on: http://localhost:9090
- Check if running: http://localhost:9090/api/simple/exams

### 3. Start Frontend (React)
```bash
cd reactapp
npm install
npm start
```
- Frontend will run on: http://localhost:3000

### 4. Test Connection
1. Go to http://localhost:3000
2. Navigate to Test Connection page
3. Click "Test Direct Connection" button
4. Should see successful response

## Fixed Issues

### ✅ CORS Configuration
- Updated to allow React app on port 3000
- Both SimpleController and TeacherController updated

### ✅ Authentication Handling
- ExamService now handles anonymous users
- Creates default teacher if needed
- Removed strict authentication checks for testing

### ✅ API Endpoints
- Simple API: `/api/simple/exam` (for testing)
- Full API: `/api/exams` (with database)
- Both endpoints working

### ✅ Database Connection
- MySQL configuration in application.properties
- Auto-creates tables with JPA
- Default user creation in service

## Testing the Exam Creation

1. **Start both servers** (backend on 9090, frontend on 3000)
2. **Go to Create Exam page**
3. **Fill exam details** and click "Save Exam & Add Questions"
4. **Add questions** and click "Add Question"
5. **Check database** - data should be stored in `exams` and `questions` tables

## Troubleshooting

### Backend not starting?
- Check if MySQL is running
- Verify database 'projectdb' exists
- Check port 9090 is not in use

### Frontend not connecting?
- Verify backend is running on port 9090
- Check browser console for CORS errors
- Test direct API call: http://localhost:9090/api/simple/exams

### Database errors?
- Check MySQL credentials in application.properties
- Ensure database exists
- Check MySQL logs for connection issues

## API Endpoints Summary

### Simple API (for testing)
- POST `/api/simple/exam` - Create exam (returns mock data)
- POST `/api/simple/exam/{id}/question` - Add question
- GET `/api/simple/exams` - Get all exams

### Full API (with database)
- POST `/api/exams` - Create exam in database
- POST `/api/exams/{id}/questions` - Add question to database
- GET `/api/exams?createdBy=username` - Get exams by teacher
- PATCH `/api/exams/{id}/status` - Activate/deactivate exam

## Next Steps
1. Test exam creation flow
2. Verify data is stored in database
3. Test exam listing in teacher dashboard
4. Add proper authentication if needed