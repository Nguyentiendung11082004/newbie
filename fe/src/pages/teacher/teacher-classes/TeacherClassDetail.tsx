import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AttendanceServices, TeacherServices } from '../../../services/student.services';
import { Button, Switch, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { formatDateStringGMT } from '../../../common/helpfunction';
import { toast } from 'react-toastify';

type Props = {}
const { Title } = Typography;
const TeacherClassDetail = (props: Props) => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const date = new Date();
    const [payload, setPayload] = useState({
        teaching_assignment_id: id,
        date: new Date().toISOString().split('T')[0],
        // date: '2025-07-02',
        attendances: []
    })
    const handleSetForm = (key, value, item) => {
        const itemId = typeof item.student_id === 'object' ? item.student_id._id : item.student_id;
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
        try {
            let res = await AttendanceServices.CreateAttendance(payload);
            toast.success(res.message)
            getData(id as string)
        } catch (error) {
            // toast.error(error.response.data?.message ?? 'Lỗi')
        }

    }
    const onChange = (checked: boolean) => {
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
                <Title level={4}>{`Điểm danh ngày : ${formatDateStringGMT(payload.date, 'dd/mm/yyyy')}`}</Title>
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