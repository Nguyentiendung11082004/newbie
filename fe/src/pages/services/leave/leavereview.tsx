import React, { useEffect, useState } from 'react';
import { Table, Button, Select, Tag, DatePicker, Space, Typography, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { LeaveServices } from '../../../services/student.services';
import { useAppSelector } from '../../../redux/hook';
import { toast } from 'react-toastify';


const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const LeaveReview = () => {
    const lecturer = useAppSelector((state) => state.user.userInfo.profile);
    console.log("lecturer", lecturer)
    const [data, setData] = useState<any[]>([]);
    const [filter, setFilter] = useState({
        page: 1,
        teaching_assignment_id: '',
        status: '',
        fromDate: '',
        toDate: ''
    });

    const getLeaves = async () => {
        const res = await LeaveServices.GetAllLeave(filter);
        if (res) setData(res.data);
    };
    const handleUpdateStatus = async (id) => {
         let res = await LeaveServices.ApproveLeave({
            leaveId: id
         })
         if (res.StatusCodes === 200) {
            toast.success('Thành công');
            getLeaves();
        } else {
            toast.error(res.message);
        }
    }
    useEffect(() => {
        if (lecturer?._id) {
            getLeaves();
        }
    }, [filter]);


    const columns: ColumnsType<any> = [
        {
            title: 'Sinh viên',
            dataIndex: 'student_name',
            render: (_, record) => `${record.student_id?.name}`
        },
        {
            title: 'Môn học',
            dataIndex: 'subject',
            render: (_, record) => record.teaching_assignment_id?.subject_id?.name
        },
        {
            title: 'Lớp học',
            dataIndex: 'class',
            render: (_, record) => record.teaching_assignment_id?.class_id?.ClassName
        },
        {
            title: 'Từ ngày',
            dataIndex: 'fromDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Đến ngày',
            dataIndex: 'toDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Lý do',
            dataIndex: 'reason'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                const color = status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red';
                const text = status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối';
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Hành động',
            render: (_, record) => {
                return record.status === 'pending' ? (
                    <Space>
                        <Button onClick={() => handleUpdateStatus(record._id)} type='primary'>Duyệt</Button>
                        {/* <Button onClick={() => handleUpdateStatus(record._id)} danger>Từ chối</Button> */}
                    </Space>
                ) : null;
            }
        }
    ];

    return (
        <>
            <div className='flex justify-between items-center mb-4'>
                <Title level={4}>Phê duyệt đơn xin nghỉ học</Title>
                <Space>
                    <Select
                        placeholder="Trạng thái"
                        onChange={(value) => setFilter((prev) => ({ ...prev, status: value }))}
                        allowClear
                        style={{ width: 140 }}
                    >
                        <Option value="pending">Chờ duyệt</Option>
                        <Option value="approved">Đã duyệt</Option>
                        <Option value="rejected">Từ chối</Option>
                    </Select>
                    <RangePicker
                        format="DD/MM/YYYY"
                        onChange={(dates) => {
                            setFilter((prev) => ({
                                ...prev,
                                fromDate: dates?.[0]?.toISOString() || '',
                                toDate: dates?.[1]?.toISOString() || ''
                            }))
                        }}
                    />
                </Space>
            </div>
            <Table rowKey="_id" columns={columns} dataSource={data} />
        </>
    );
};

export default LeaveReview;
