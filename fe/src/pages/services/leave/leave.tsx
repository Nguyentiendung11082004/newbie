import { Button, Table } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import { LeaveServices } from '../../../services/student.services'

type Props = {}

const leave = (props: Props) => {
    const [filter, setFilter] = useState({
        page: 1
    })
    const [data, setData] = useState([])
    const columns = [];
    const handle = () => { }
    const getData = async (pay) => {
        let res = await LeaveServices.GetAllLeave(pay)
    }

    useEffect(()=> {
        getData(filter)
    },[filter])
    return (
        <>
            <div className='flex justify-between items-center'>
                <Title level={4}>Danh sách phiếu xin nghỉ học</Title>
                <Button type='primary' onClick={handle}>Đăng ký nghỉ học</Button>
            </div>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
            />
        </>
    )
}

export default leave
