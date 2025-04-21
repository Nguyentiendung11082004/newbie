import { Express } from "express-serve-static-core"
import StudentRouter from "./students"
import ClassRouter from "./class"
import AuthRouter from "./auth"
import SubjectRouter from "./subject"
import EnrollmentRouter from "./ernollment"
import TeacherRouter from "./teacher"
import TeachingAssignmentRouter from "./teachingassgnment"
export default function routes(app: Express) {
    app.use('/api/v1/students', StudentRouter)
    app.use('/api/v1/class', ClassRouter)
    app.use('/api/v1/auth', AuthRouter)
    app.use('/api/v1/subject', SubjectRouter)
    app.use('/api/v1/enrollsubject', EnrollmentRouter)
    app.use('/api/v1/teacher', TeacherRouter)
    app.use('/api/v1/teachingassignment', TeachingAssignmentRouter)
}