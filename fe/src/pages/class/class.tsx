import { Popconfirm, Table, Typography } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { IClass } from '../../types/class';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { useEffect, useState } from 'react';
import { GetDataClass } from '../../redux/slices/classSlice';
import DialogClass from './dialogclass';
import React from 'react';
import { Button } from '../../components/Button';
import { ClassServices } from '../../services/student.services';
import { toast } from 'react-toastify';
const { Title } = Typography;
const Class = () => {
    const dispatch = useAppDispatch()
    const { data, filter } = useAppSelector((state: any) => state.class);
    const [open, setOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState<any>(null);
    const handleAdd = () => {
        setOpen(true)
    }
    const handleEdit = (pay) => {
        setDataEdit(pay);
        setOpen(true);
    }
    const handleDelete = async (id) => {
        try {
            let res = await ClassServices.Delete(id);
            toast.success(res.message)
            dispatch(GetDataClass())
        } catch (error) {
            toast.error(error.message)
        }
    }
    const columns: ColumnType<IClass>[] = [
        {
            title: 'STT',
            align: "center",
            dataIndex: 'STT',
            render: (_value, _record, index) => (filter.CurrentPage - 1) * filter.PageSize + index + 1,
        },
        {
            title: 'Tên lớp học',
            align: "center",
            onCell: () => ({
                style: { textAlign: 'left' },
            }),
            dataIndex: 'ClassName'
        },
        {
            title: 'Năm học',
            align: "center",
            dataIndex: 'AcademicYear',
        },
        {
            title: 'Ngành học',
            align: "center",
            dataIndex: '',
            onCell: () => ({
                style: { textAlign: 'left' },
            }),
            render: (_value: any, _record: any, index: any) => _record.MajorId?.name,
        },
        {
            title: "Thao tác",
            align: "center",
            render: (_text, _record, index) => {
                return (
                    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                        <Button onClick={() => handleEdit(_record)} className="bg-amber-400 hover:bg-amber-500 text-white">Sửa </Button>
                        <Popconfirm
                            title="Bạn có chắc muốn xoá lớp?"
                            onConfirm={() => handleDelete(_record._id)}
                        >
                            <Button className="bg-red-600 hover:bg-red-700 text-white">Xoá </Button>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ];
    const handlePageChange = () => {

    }
    useEffect(() => {
        if (!open) {
            dispatch(GetDataClass())
        }
    }, [open])
    return (
        <>
            <div className='flex justify-between items-center'>
                <Title level={4}>Danh sách lớp học</Title>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAdd}>Thêm lớp học</Button>
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
            {open && <DialogClass open={open} setOpen={setOpen} dataEdit={dataEdit} />}
        </>
    );
};

export default Class;
