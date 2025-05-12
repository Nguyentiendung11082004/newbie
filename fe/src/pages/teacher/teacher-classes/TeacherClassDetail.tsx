import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AttendanceServices, TeacherServices } from '../../../services/student.services';
import { Button, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { formatDateStringGMT } from '../../../common/helpfunction';

type Props = {}
const { Title } = Typography;
const TeacherClassDetail = (props: Props) => {
    const { id } = useParams();
    console.log("id", id)
    const [data, setData] = useState([]);
    const date = new Date();
    const [payload, setPayload] = useState({
        teaching_assignment_id: id,
        date: formatDateStringGMT(date, 'dd/mm/yyyy'),
        attendances: []
    })
    const handleSetForm = (props, value, item) => {

        setPayload((prev: any) => ({
            ...prev,
            attendances: prev.attendances.map((e) => {
                if (e.student_id === item.student_id._id) {
                    return {
                        ...e,
                        [props]: value
                    }
                }
                return e;
            })
        }))
    }
    const handleSubmitAttendance = async () => {
        let res = await AttendanceServices.CreateAttendance(payload)
        console.log("res",res)
        if(res) {
           
        }
    }
    const columns: ColumnType<any[]>[] = [
        {
            title: 'STT',
            dataIndex: 'STT',
            render: (_value, _record, index) => index + 1,
        },
        {
            title: 'Tên sinh viên',
            dataIndex: '',
            render: (_value, _record, index) => {
                return <div>
                    {_value?.student_id?.name}
                </div>
            }
        },
        {
            title: 'Email',
            dataIndex: '',
            render: (_value, _record, index) => {
                return <div>
                    {_value?.student_id?.email}
                </div>
            }
        },
        {
            title: 'Trạng thái điểm danh',
            dataIndex: 'status',
            render: (_value, _record, index) => {
                console.log("_value",_value)
                return <div style={{ color: `${_value === 'Approved' ? 'green' : 'red'}` }}>
                    {_value}
                </div>
            }
        },
        {
            title: 'Thao tác',
            dataIndex: '',
            render: (_value, _record, index) => {
                return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            style={{
                                padding: '4px 12px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                opacity: 0.4,
                            }}
                            onClick={() => handleSetForm('status', "absent", _value)}
                        >
                            Vắng mặt
                        </button>
                        <button
                            style={{
                                padding: '4px 12px',
                                backgroundColor: '#22c55e',
                                color: 'white',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)', // đổ bóng xanh
                                transform: 'scale(1.05)', // phóng to nhẹ
                                fontWeight: 'bold',       // chữ đậm
                                transition: 'all 0.2s ease-in-out', // mượt hơn khi hover
                            }}
                            onClick={() => handleSetForm('status', "present", _value)}
                        >
                            Có mặt
                        </button>
                    </div>
                );
            },
        }


    ]
    const getData = async (id: string) => {
        let res = await TeacherServices.GetById({
            teaching_assignment_id: id,
            date: formatDateStringGMT(date, 'DD/MM/YYYY')
        });
        setData(res?.data)
        const attendances = res?.data?.map(item => ({
            student_id: item.student_id._id,
            status: 'absent',
            note: ''
        }));
        setPayload(prev => ({
            ...prev,
            attendances
        }));
    }
    useEffect(() => {
        if (id) {
            getData(id)
        }
    }, [])
    return (
        <>
            <div className='flex justify-between items-center text-red'>
                <Title level={4}>Điểm danh</Title>
                <Button
                    type="primary"
                    onClick={handleSubmitAttendance}
                >
                    Xác nhận điểm danh
                </Button>
            </div>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
            />
        </>
    )
}

export default TeacherClassDetail