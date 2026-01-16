import { Express } from "express-serve-static-core"
import StudentRouter from "./students"
import ClassRouter from "./class"
import AuthRouter from "./auth"
import SubjectRouter from "./subject"
import EnrollmentRouter from "./ernollment"
import TeacherRouter from "./teacher"
import TeachingAssignmentRouter from "./teachingassgnment"
import AttendanceRouter from "./attendance"
import StaticRoute from "./statistical"
import GradeRoute from "./grade"
import LeaveRoute from "./leave"
import sseRouter from "./sse.route"
import StudentWalletRouter from "./wallet"
import { sendMail } from "../middlewares/email"
import NotificationRouter from "./notification"
import SemestersRouter from "./semesters"
import { ResultVnpayCallback } from "../controllers/wallet"
import MajorRouter from "./major"
export default function routes(app: Express) {
    app.use('/api/v1/students', StudentRouter)
    app.use('/api/v1/class', ClassRouter)
    app.use('/api/v1/auth', AuthRouter)
    app.use('/api/v1/subject', SubjectRouter)
    app.use('/api/v1/enrollsubject', EnrollmentRouter)
    app.use('/api/v1/teacher', TeacherRouter)
    app.use('/api/v1/teachingassignment', TeachingAssignmentRouter)
    app.use('/api/v1/attendance', AttendanceRouter)
    app.use('/api/v1/static', StaticRoute)
    app.use('/api/v1/grade', GradeRoute)
    app.use('/api/v1/leaverequest', LeaveRoute)
    app.use('/sse', sseRouter)
    app.use('/api/v1/wallet', StudentWalletRouter)
    app.use('/api/v1/notification', NotificationRouter)
    app.use('/api/v1/semesters', SemestersRouter)
    app.use('/api/v1/major', MajorRouter)
    app.use("/api/v1/payments/vnpay-callback", ResultVnpayCallback);
}