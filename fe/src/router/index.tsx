import React from 'react'
import NotFound from '../pages/NotFound'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import Class from '../pages/class/class'
import DashboardAdmin from '../pages/dashboard'
import EnrollmentApproval from '../pages/enrollment-approval'
import Grade from '../pages/grade'
import History from '../pages/history'
import Leave from '../pages/services/leave/leave'
import LeaveReview from '../pages/services/leave/leavereview'
import StudentWalletPage from '../pages/students/StudentWalletPage'
import StudentDebt from '../pages/students/studentdebt'
import Students from '../pages/students/students'
import Subject from '../pages/subject'
import SubjectStudent from '../pages/subjectstudent'
import Teacher from '../pages/teacher'
import TeacherClass from '../pages/teacher/teacher-classes'
import TeacherClassDetail from '../pages/teacher/teacher-classes/TeacherClassDetail'
import TechingAssignment from '../pages/techingassment'
import Test from '../pages/test/test'
export const privateRoutes = [
  { path: '/admin/dashboard', element: <DashboardAdmin /> },
  { path: '/admin/classes', element: <Class /> },
  { path: '/admin/teachers', element: <Teacher /> },
  { path: '/admin/students', element: <Students /> },
  { path: '/admin/subjects', element: <Subject /> },
  { path: '/admin/teaching-assignment', element: <TechingAssignment /> },
  { path: '/admin/test', element: <Test /> },

  { path: '/teacher/enrollment-approval', element: <EnrollmentApproval /> },
  { path: '/teacher/classes', element: <TeacherClass /> },
  { path: '/teacher/classes/:id', element: <TeacherClassDetail /> },
  { path: '/teacher/grade', element: <Grade /> },
  { path: '/leave-request/review', element: <LeaveReview /> },


  { path: '/student/subjects', element: <SubjectStudent /> },
  { path: '/student/grade', element: <Grade /> },


  { path: '/history/:id', element: <History /> },
  { path: '/leave-request', element: <Leave /> },
  { path: '/services/tuition', element: <StudentWalletPage /> },
  { path: '/services/debt', element: <StudentDebt /> }

];

export const publicRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '*', element: <NotFound /> },
];
