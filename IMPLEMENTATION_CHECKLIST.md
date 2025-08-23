# Implementation Plan Checklist (REPLANNED)

## Original Question/Task

**Question:** <h1>Online Exam System: Implementing Exam Creation and Student Assessment</h1>

<h2>Overview</h2>
<p>You are tasked with developing a core component of an Online Exam System that allows teachers to create exams and students to take them. The system should support basic exam creation, student assessment, and automatic evaluation of multiple-choice questions.</p>

<h2>Question Requirements</h2>

<h3>Backend Requirements (Spring Boot)</h3>

<h4>1. Data Models</h4>
<p>Create the following entities with appropriate relationships:</p>
<ul>
    <li><b>Exam</b>
        <ul>
            <li><code>examId</code> (Long): Primary key</li>
            <li><code>title</code> (String): Exam title (not null, max 100 characters)</li>
            <li><code>description</code> (String): Exam description (max 500 characters)</li>
            <li><code>duration</code> (Integer): Duration in minutes (minimum 10, maximum 180)</li>
            <li><code>createdBy</code> (String): Teacher's username who created the exam</li>
            <li><code>createdAt</code> (LocalDateTime): Timestamp when exam was created</li>
            <li><code>isActive</code> (Boolean): Whether the exam is active and available for students</li>
        </ul>
    </li>
    <li><b>Question</b>
        <ul>
            <li><code>questionId</code> (Long): Primary key</li>
            <li><code>examId</code> (Long): Foreign key to Exam</li>
            <li><code>questionText</code> (String): The question text (not null, max 500 characters)</li>
            <li><code>optionA</code> (String): First option (not null, max 200 characters)</li>
            <li><code>optionB</code> (String): Second option (not null, max 200 characters)</li>
            <li><code>optionC</code> (String): Third option (not null, max 200 characters)</li>
            <li><code>optionD</code> (String): Fourth option (not null, max 200 characters)</li>
            <li><code>correctOption</code> (String): Correct answer (must be one of: "A", "B", "C", or "D")</li>
            <li><code>marks</code> (Integer): Points for correct answer (1-10)</li>
        </ul>
    </li>
    <li><b>StudentExam</b>
        <ul>
            <li><code>studentExamId</code> (Long): Primary key</li>
            <li><code>examId</code> (Long): Foreign key to Exam</li>
            <li><code>studentUsername</code> (String): Username of the student</li>
            <li><code>startTime</code> (LocalDateTime): When student started the exam</li>
            <li><code>endTime</code> (LocalDateTime): When student completed the exam (null if not completed)</li>
            <li><code>score</code> (Integer): Total score achieved (null if not completed)</li>
            <li><code>status</code> (String): Status of the exam ("NOT_STARTED", "IN_PROGRESS", "COMPLETED")</li>
        </ul>
    </li>
    <li><b>StudentAnswer</b>
        <ul>
            <li><code>answerId</code> (Long): Primary key</li>
            <li><code>studentExamId</code> (Long): Foreign key to StudentExam</li>
            <li><code>questionId</code> (Long): Foreign key to Question</li>
            <li><code>selectedOption</code> (String): Student's answer (one of: "A", "B", "C", or "D")</li>
            <li><code>isCorrect</code> (Boolean): Whether the answer is correct</li>
        </ul>
    </li>
</ul>

<h4>2. REST API Endpoints</h4>

<h5>2.1 Exam Management (for Teachers)</h5>
<ul>
    <li><b>Create a new exam</b>
        <ul>
            <li>Endpoint: <code>POST /api/exams</code></li>
            <li>Request body: Exam details (title, description, duration, createdBy)</li>
            <li>Response: Created exam with examId</li>
            <li>Status codes:
                <ul>
                    <li>201: Exam created successfully</li>
                    <li>400: Invalid input (validation errors)</li>
                </ul>
            </li>
            <li>Example request:
                <pre>
{
  "title": "Java Basics Quiz",
  "description": "Test your knowledge of Java fundamentals",
  "duration": 30,
  "createdBy": "teacher1"
}
                </pre>
            </li>
        </ul>
    </li>
    <li><b>Add a question to an exam</b>
        <ul>
            <li>Endpoint: <code>POST /api/exams/{examId}/questions</code></li>
            <li>Request body: Question details</li>
            <li>Response: Created question with questionId</li>
            <li>Status codes:
                <ul>
                    <li>201: Question added successfully</li>
                    <li>400: Invalid input (validation errors)</li>
                    <li>404: Exam not found</li>
                </ul>
            </li>
            <li>Example request:
                <pre>
{
  "questionText": "What is a correct syntax to output 'Hello World' in Java?",
  "optionA": "System.out.println('Hello World');",
  "optionB": "Console.WriteLine('Hello World');",
  "optionC": "print('Hello World');",
  "optionD": "echo('Hello World');",
  "correctOption": "A",
  "marks": 2
}
                </pre>
            </li>
        </ul>
    </li>
    <li><b>Get all exams created by a teacher</b>
        <ul>
            <li>Endpoint: <code>GET /api/exams?createdBy={teacherUsername}</code></li>
            <li>Response: List of exams with basic details (id, title, description, duration, isActive)</li>
            <li>Status codes:
                <ul>
                    <li>200: Success</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><b>Activate/deactivate an exam</b>
        <ul>
            <li>Endpoint: <code>PATCH /api/exams/{examId}/status</code></li>
            <li>Request body: <code>{ "isActive": true/false }</code></li>
            <li>Response: Updated exam status</li>
            <li>Status codes:
                <ul>
                    <li>200: Status updated successfully</li>
                    <li>404: Exam not found</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

<h5>2.2 Student Exam Operations</h5>
<ul>
    <li><b>Get available exams for students</b>
        <ul>
            <li>Endpoint: <code>GET /api/student/exams</code></li>
            <li>Response: List of active exams with basic details (id, title, description, duration)</li>
            <li>Status codes:
                <ul>
                    <li>200: Success</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><b>Start an exam</b>
        <ul>
            <li>Endpoint: <code>POST /api/student/exams/{examId}/start</code></li>
            <li>Request body: <code>{ "studentUsername": "student1" }</code></li>
            <li>Response: Created StudentExam with studentExamId and list of questions (without correct answers)</li>
            <li>Status codes:
                <ul>
                    <li>201: Exam started successfully</li>
                    <li>400: Student already has an active attempt for this exam</li>
                    <li>404: Exam not found or not active</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><b>Submit an answer</b>
        <ul>
            <li>Endpoint: <code>POST /api/student/exams/{studentExamId}/answers</code></li>
            <li>Request body: <code>{ "questionId": 1, "selectedOption": "B" }</code></li>
            <li>Response: Saved answer with answerId and isCorrect status</li>
            <li>Status codes:
                <ul>
                    <li>201: Answer submitted successfully</li>
                    <li>400: Invalid option or exam already completed</li>
                    <li>404: StudentExam or Question not found</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><b>Complete an exam</b>
        <ul>
            <li>Endpoint: <code>POST /api/student/exams/{studentExamId}/complete</code></li>
            <li>Response: Completed exam details with final score</li>
            <li>Status codes:
                <ul>
                    <li>200: Exam completed successfully</li>
                    <li>400: Exam already completed</li>
                    <li>404: StudentExam not found</li>
                </ul>
            </li>
            <li>Note: This endpoint should:
                <ul>
                    <li>Calculate the total score based on submitted answers</li>
                    <li>Set the endTime to current time</li>
                    <li>Update the status to "COMPLETED"</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><b>Get exam results</b>
        <ul>
            <li>Endpoint: <code>GET /api/student/exams/{studentExamId}/results</code></li>
            <li>Response: Detailed exam results including all questions, correct answers, student's answers, and score</li>
            <li>Status codes:
                <ul>
                    <li>200: Success</li>
                    <li>400: Exam not yet completed</li>
                    <li>404: StudentExam not found</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

<h3>Frontend Requirements (React)</h3>

<h4>1. Components</h4>

<h5>1.1 Teacher Dashboard</h5>
<p>Create a <code>TeacherDashboard</code> component that displays:</p>
<ul>
    <li>A list of exams created by the teacher</li>
    <li>Each exam should show:
        <ul>
            <li>Title</li>
            <li>Description (truncated if too long)</li>
            <li>Duration</li>
            <li>Status (Active/Inactive)</li>
            <li>Created date</li>
        </ul>
    </li>
    <li>A button to create a new exam</li>
    <li>Each exam in the list should have buttons to:
        <ul>
            <li>Activate/Deactivate the exam</li>
            <li>View/Edit exam details</li>
        </ul>
    </li>
</ul>

<h5>1.2 Exam Creator</h5>
<p>Create an <code>ExamCreator</code> component that allows teachers to:</p>
<ul>
    <li>Create a new exam with:
        <ul>
            <li>Title (required)</li>
            <li>Description</li>
            <li>Duration in minutes (required, between 10-180)</li>
        </ul>
    </li>
    <li>Add multiple-choice questions to the exam, each with:
        <ul>
            <li>Question text (required)</li>
            <li>Four options (all required)</li>
            <li>Correct answer selection (required)</li>
            <li>Marks for the question (required, between 1-10)</li>
        </ul>
    </li>
    <li>Save the exam when at least one question has been added</li>
</ul>

<h5>1.3 Student Exam List</h5>
<p>Create a <code>StudentExamList</code> component that displays:</p>
<ul>
    <li>A list of available (active) exams</li>
    <li>Each exam should show:
        <ul>
            <li>Title</li>
            <li>Description</li>
            <li>Duration</li>
        </ul>
    </li>
    <li>A "Start Exam" button for each exam</li>
</ul>

<h5>1.4 Exam Interface</h5>
<p>Create an <code>ExamInterface</code> component that allows students to:</p>
<ul>
    <li>View one question at a time</li>
    <li>Select an answer from the four options</li>
    <li>Navigate between questions (Previous/Next buttons)</li>
    <li>See a question navigator showing which questions have been answered</li>
    <li>Submit the exam when ready</li>
    <li>View a timer showing remaining time</li>
</ul>

<h5>1.5 Exam Results</h5>
<p>Create an <code>ExamResults</code> component that displays:</p>
<ul>
    <li>Exam title and description</li>
    <li>Total score achieved</li>
    <li>List of all questions showing:
        <ul>
            <li>Question text</li>
            <li>The student's selected answer</li>
            <li>The correct answer</li>
            <li>Whether the student's answer was correct</li>
            <li>Marks earned for each question</li>
        </ul>
    </li>
</ul>

<h4>2. Routing</h4>
<p>Implement routing using React Router with the following routes:</p>
<ul>
    <li><code>/teacher</code> - Teacher Dashboard</li>
    <li><code>/teacher/exams/new</code> - Create a new exam</li>
    <li><code>/teacher/exams/:examId</code> - View/Edit exam details</li>
    <li><code>/student</code> - Student Exam List</li>
    <li><code>/student/exams/:studentExamId</code> - Take an exam</li>
    <li><code>/student/results/:studentExamId</code> - View exam results</li>
</ul>

<h4>3. State Management</h4>
<ul>
    <li>Use React hooks (useState, useEffect) for component state management</li>
    <li>Implement proper form validation for all input fields</li>
    <li>Display appropriate loading states and error messages</li>
</ul>

<h4>4. API Integration</h4>
<ul>
    <li>Create a service layer to interact with the backend API</li>
    <li>Handle API responses and errors appropriately</li>
    <li>Implement proper data fetching and submission logic</li>
</ul>

<p>Note: This application uses MySQL as the backend database.</p>

**Created:** 2025-07-26 05:46:43 (Replan #2)
**Total Steps:** 2
**Previous Execution:** 2 steps completed before replanning

## Replanning Context
- **Replanning Attempt:** #2
- **Trigger:** V2 execution error encountered

## Previously Completed Steps

✅ Step 1: Breakdown Step 9 (Implement major React components) into smaller focused component implementation steps
✅ Step 2: Implement and align Jest test cases for all frontend components

## NEW Implementation Plan Checklist

### Step 1: FIX ExamCreator component and its test to ensure addQuestionToExam API is reliably called after exam creation, even during test execution
- [x] **Status:** ✅ Completed
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/6a40c2a0-b5f8-410b-9902-ca6b385ffe42/reactapp/src/components/ExamCreator.js
  - /home/coder/project/workspace/question_generation_service/solutions/6a40c2a0-b5f8-410b-9902-ca6b385ffe42/reactapp/src/components/ExamCreator.test.js
- **Description:** Adjust the state update and API call sequence in ExamCreator so the addQuestionToExam API is called after exam creation, even in the async/reactive test environment. Update test to properly observe and wait for API invocation.

### Step 2: Lint, build, and test the frontend React application
- [x] **Status:** ✅ Completed
- **Description:** This step validates the entire React frontend, confirming build quality and full test coverage for all implemented features.

## NEW Plan Completion Status

| Step | Status | Completion Time |
|------|--------|----------------|
| Step 1 | ✅ Completed | 2025-07-26 05:47:29 |
| Step 2 | ✅ Completed | 2025-07-26 05:50:36 |

## Notes & Issues

### Replanning History
- Replan #2: V2 execution error encountered

### Errors Encountered
- Step 2: ExamCreator.test.js expects addQuestionToExam and createExam to be called after firing Add Question, but the exam isn't actually created because the description is never filled in; thus validation fails and createExam is NOT called. Need to update the test to provide a valid description to the exam form before firing the Add Question button.

### Important Decisions
- Step 2: All frontend build, lint, and test steps pass after aligning ExamCreator test to real user flow (exam entered and saved before question submitted).

### Next Actions
- Resume implementation following the NEW checklist
- Use `update_plan_checklist_tool` to mark steps as completed
- Use `read_plan_checklist_tool` to check current status

---
*This checklist was updated due to replanning. Previous progress is preserved above.*