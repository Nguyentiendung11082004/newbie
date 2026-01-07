import React, { useEffect, useState } from 'react'
import { NotificationServices } from '../../services/student.services'
import Title from 'antd/es/typography/Title'
import { Popconfirm, Table, Tag } from 'antd'
import dayjs from "dayjs";
import { Button } from '../../components/Button';
import DialogNotification from './dialognotification';
import { toast } from 'react-toastify';
import { Notification } from '../../types/notification';

type Props = {}

const ListNotification = (props: Props) => {
    const [data, setData] = useState<Notification[]>([])
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [dialog, setDialog] = useState(false)
    const [dataEdit, setDataEdit] = useState<Notification | null>(null)
    const getData = async () => {
        let res = await NotificationServices.GetList();
        setData(res.data || [])
    }
    const handleAdd = () => {
        setDataEdit(null)
        setDialog(true)
    }
    const handleEdit = (pay) => {
        setDataEdit(pay)
        setDialog(true)
    }
    const handleDelete = async (id) => {
        try {
            let res = await NotificationServices.Delete(id)
            toast.success(res.message)
            getData()
        } catch (error) {
            toast.error(error.message)
        }
    }
    const columns: any = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * pageSize + index + 1,
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            width: 250,
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            // ellipsis: true,
        },
        {
            title: "Người gửi",
            dataIndex: "sender_role",
            key: "sender_role",
            width: 120,
            render: (role) =>
                role === "admin" ? (
                    <Tag color="red">Admin</Tag>
                ) : (
                    <Tag color="blue">Giảng viên</Tag>
                ),
        },
        {
            title: "Phạm vi",
            dataIndex: "target_type",
            key: "target_type",
            width: 120,
            render: (type) => {
                switch (type) {
                    case "all":
                        return <Tag color="green">Toàn hệ thống</Tag>;
                    case "student":
                        return <Tag>Student</Tag>;
                    case "teacher":
                        return <Tag>Teacher</Tag>;
                    case "class":
                        return <Tag>Lớp</Tag>;
                    case "subject":
                        return <Tag>Môn học</Tag>;
                    default:
                        return "-";
                }
            },
        },
        {
            title: "Thời gian",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 160,
            render: (date) => dayjs(date).format("HH:mm DD/MM/YYYY"),
        },
        {
            title: "Thao tác",
            render: (_text, _record, index) => {
                return (
                    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                        <Button onClick={() => handleEdit(_record)} className="bg-amber-400 hover:bg-amber-500 text-white">Sửa </Button>
                        <Popconfirm
                            title="Bạn có chắc muốn xoá thông báo này?"
                            onConfirm={() => handleDelete(_record._id)}
                        >
                            <Button className="bg-red-600 hover:bg-red-700 text-white">Xoá </Button>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ];
    useEffect(() => {
        if (!dialog) {
            getData()
        }
    }, [dialog])
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <Title level={4}>Danh sách thông báo</Title>
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">Thêm mới </Button>
            </div>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
                // loading={loading}
                pagination={{
                    current: page,
                    pageSize,
                    showSizeChanger: false,
                    onChange: (p) => setPage(p)
                }}
            />
            <DialogNotification dialog={dialog} setDialog={setDialog} dataEdit={dataEdit} setDataEdit={setDataEdit} />
        </>
    )
}

export default ListNotification