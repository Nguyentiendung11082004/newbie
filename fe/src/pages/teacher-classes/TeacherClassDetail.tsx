import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TeacherServices } from '../../../services/student.services';
import { Button, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';

type Props = {}
const { Title } = Typography;
const TeacherClassDetail = (props: Props) => {
    const { id } = useParams();
    const [data, setData] = useState([])
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
            dataIndex: '',
            render: (_value, _record, index) => {
                return <div>
                    {_value?.class_id?.ClassName}
                </div>
            }
        },
        {
            title: 'Thao tác',
            dataIndex: '',
            render: (_value, _record, index) => {
                return (
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Vắng mặt
                        </button>
                        <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                            Có mặt
                        </button>
                    </div>
                );
            },
        }

    ]
    const getData = async (id: string) => {
        let res = await TeacherServices.GetById({
            teaching_assignment_id: id
        });
        setData(res?.data)
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