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
        <Route path='/admin/students' element={<Students />} />
        <Route path='/admin/subjects' element={<Subject />} />
        <Route path='/student/subjects' element={<SubjectStudent />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}

export default RouterApp