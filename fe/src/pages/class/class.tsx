import { Table, Typography } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { IClass } from '../../types/class';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { useEffect } from 'react';
import { GetDataClass } from '../../redux/slices/classSlice';
const { Title } = Typography;
const Class = () => {
    const dispatch = useAppDispatch()
    const { data, filter } = useAppSelector((state: any) => state.class);
    console.log("data", data)
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
        }
    ];
    const handlePageChange = () => {

    }
    useEffect(() => {
        dispatch(GetDataClass())
    }, [])
    return (
        <>
            <Title level={4}>Danh sách lớp học</Title>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data.data}
                pagination={{
                    current: filter.CurrentPage,
                    pageSize: filter.PageSize,
                    total: filter.totalDocs,
                    onChange: handlePageChange
                }}
            />
        </>
    );
};

export default Class;
