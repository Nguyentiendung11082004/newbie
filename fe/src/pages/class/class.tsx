import { Button, Table, Typography } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { IClass } from '../../types/class';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { useEffect, useState } from 'react';
import { GetDataClass } from '../../redux/slices/classSlice';
import DialogClass from './dialogclass';
import React from 'react';
const { Title } = Typography;
const Class = () => {
    const dispatch = useAppDispatch()
    const { data, filter } = useAppSelector((state: any) => state.class);
    const [open, setOpen] = useState(false);
    const handleAdd = () => {
        setOpen(true)
    }
    const columns: ColumnType<IClass>[] = [
        {
            title: 'STT',
            dataIndex: 'STT',
            render: (_value, _record, index) => (filter.CurrentPage - 1) * filter.PageSize + index + 1,
        },
        {
            title: 'Tên lớp học',
            dataIndex: 'ClassName'
        },
        {
            title: 'Năm học',
            dataIndex: 'AcademicYear',
        },
        {
            title: 'Ngành học',
            dataIndex: '',
            render: (_value: any, _record: any, index: any) => _record.MajorId?.name,
        }
    ];
    const handlePageChange = () => {

    }
    useEffect(() => {
        dispatch(GetDataClass())
    }, [])
    return (
        <>
            <div className='flex justify-between items-center'>
                <Title level={4}>Danh sách lớp học</Title>
                <Button type='primary' onClick={handleAdd}>Thêm lớp học</Button>
            </div>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
                pagination={{
                    current: filter.CurrentPage,
                    pageSize: filter.PageSize,
                    total: filter.totalDocs,
                    onChange: handlePageChange
                }}
            />
            <DialogClass isModalOpen={open} setOpen={setOpen} />
        </>
    );
};

export default Class;
