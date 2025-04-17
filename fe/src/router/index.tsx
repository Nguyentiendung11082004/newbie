import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LayoutDashboard from '../layout'
import Class from '../pages/class/class'
import Students from '../pages/students/students'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import DashboardAdmin from '../pages/dashboard'
import Subject from '../pages/subjectstudent'
import PrivateRouter from './privaterouter'

const RouterApp = () => {
  return (
    <Routes>
      <Route path='/' element={
        <PrivateRouter>
          <LayoutDashboard />
        </PrivateRouter>
      }>
        <Route path='/admin/dashboard' element={<DashboardAdmin />} />
        <Route path='/admin/classes' element={<Class />} />
        <Route path='/admin/students' element={<Students />} />
        <Route path='/student/subjects' element={<Subject />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}

export default RouterApp