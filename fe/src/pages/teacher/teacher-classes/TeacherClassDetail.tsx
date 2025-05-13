import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AttendanceServices, TeacherServices } from '../../../services/student.services';
import { Button, Switch, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { formatDateStringGMT } from '../../../common/helpfunction';

type Props = {}
const { Title } = Typography;
const TeacherClassDetail = (props: Props) => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const date = new Date();
    const [payload, setPayload] = useState({
        teaching_assignment_id: id,
        date: new Date().toISOString().split('T')[0],
        attendances: []
    })
    const handleSetForm = (key, value, item) => {
        const itemId = typeof item.student_id === 'object' ? item.student_id._id : item.student_id;
    
        // Cập nhật dữ liệu hiển thị (UI)
        setData((prev: any) =>
            prev.map((entry) => {
                const entryId = typeof entry.student_id === 'object' ? entry.student_id._id : entry.student_id;
                if (entryId === itemId) {
                    return {
                        ...entry,
                        [key]: value,
                    };
                }
                return entry;
            })
        );
    
        // Cập nhật dữ liệu sẽ gửi khi ấn "Xác nhận"
        setPayload((prev: any) => ({
            ...prev,
            attendances: prev.attendances.map((e) => {
                if (e.student_id === itemId) {
                    return {
                        ...e,
                        [key]: value,
                    };
                }
                return e;
            }),
        }));
    };
    
      

    const handleSubmitAttendance = async () => {
        console.log("payload", payload.attendances)
        let res = await AttendanceServices.CreateAttendance(payload)
        if (res) {
            getData(id as string)
        }
    }
    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };
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
                return <div style={{ color: `${_value === 'present' ? 'green' : 'red'}` }}>
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
                        <Switch
                            checked={_value.status === 'present'}
                            onChange={(checked) =>
                                handleSetForm('status', checked ? 'present' : 'absent', _value)
                            }
                            checkedChildren="Có mặt"
                            unCheckedChildren="Vắng mặt"
                        />
                        {/* <button
                            style={{
                                padding: '4px 12px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                opacity: current === 'absent' ? 1 : 0.4,
                                boxShadow: '0 0 10px rgba(220, 38, 38, 0.6)',
                                transform: 'scale(1.05)', // phóng to nhẹ
                                fontWeight: 'bold',       // chữ đậm
                                transition: 'all 0.2s ease-in-out', // mượt hơn khi hover
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
                                opacity: current === 'present' ? 1 : 0.4,
                                boxShadow: '0 0 10px rgbax(34, 197, 94, 0.6)', // đổ bóng xanhx
                                transform: 'scale(1.05)', // phóng to nhẹ
                                fontWeight: 'bold',       // chữ đậm
                                transition: 'all 0.2s ease-in-out', // mượt hơn khi hover
                            }}
                            onClick={() => handleSetForm('status', "present", _value)}
                        >
                            Có mặt
                        </button> */}
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
            status: item?.status ?? 'absent',
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
                pagination={false}
            />
        </>
    )
}

export default TeacherClassDetail