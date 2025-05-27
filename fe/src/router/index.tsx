import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LayoutDashboard from '../layout'
import Class from '../pages/class/class'
import Students from '../pages/students/students'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import DashboardAdmin from '../pages/dashboard'
import PrivateRouter from './privaterouter'
import SubjectStudent from '../pages/subjectstudent'
import Subject from '../pages/subject'
import TechingAssignment from '../pages/techingassment'
import Teacher from '../pages/teacher'
import EnrollmentApproval from '../pages/enrollment-approval'
import Test from '../pages/test/test'
import NotFound from '../pages/NotFound'
import TeacherClass from '../pages/teacher/teacher-classes'
import TeacherClassDetail from '../pages/teacher/teacher-classes/TeacherClassDetail'
import History from '../pages/history'

const RouterApp = () => {
  return (
    <Routes>
      <Route path='/' element={
        <PrivateRouter>
          <LayoutDashboard />
        </PrivateRouter>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path='/admin/classes' element={<Class />} />
        <Route path='/admin/teachers' element={<Teacher />} />
        <Route path='/admin/students' element={<Students />} />
        <Route path='/admin/subjects' element={<Subject />} />
        <Route path='/admin/teaching-assignment' element={<TechingAssignment />} />
        <Route path='/admin/test' element={<Test />} />
        <Route path='/teacher/enrollment-approval' element={<EnrollmentApproval />} />
        <Route path='teacher/classes' element={<TeacherClass />} />
        <Route path='teacher/classes/:id' element={<TeacherClassDetail />} />
        

        <Route path='/student/subjects' element={<SubjectStudent />} />
        <Route path='/history/:id' element={<History />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default RouterApp