import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LayoutDashboard from '../layout'
import Class from '../pages/class/class'
import Students from '../pages/students/students'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'

const RouterApp = () => {
  return (
    <Routes>
      <Route path='/' element={<LayoutDashboard />}>
        <Route path='/admin/classes' element={<Class />} />
        <Route path='/admin/students' element={<Students />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}

export default RouterApp