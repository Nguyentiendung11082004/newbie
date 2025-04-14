import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LayoutDashboard from '../layout'
import Class from '../pages/class/class'

const RouterApp = () => {
  return (
    <Routes>
        <Route path='/' element={<LayoutDashboard />}>
            <Route path='/admin/classes' element={<Class />} />
        </Route>
    </Routes>
  )
}

export default RouterApp