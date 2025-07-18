import React from 'react';
import AdminSumary from './AdminSumary';
import EnrollByStream from './EnrollByStream';
import StudentByMajorChart from './StudentByMajor';
type Props = {}

const DashboardAdmin = (props: Props) => {
  return (
    <div>
      <AdminSumary />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <EnrollByStream />
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <StudentByMajorChart />
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin