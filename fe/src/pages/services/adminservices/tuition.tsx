import { Table, Tag, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { StaticServices } from '../../../services/static.services';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../../../types/api';
import { formatVND } from '../../../common/helpfunction';

type Props = {}
const { Title } = Typography;

const Tuition = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const columns: ColumnType<any>[] = [
        { title: "STT", render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1 },
        { title: "Tên sinh viên", dataIndex: "studentName" },
        { title: "Mã sinh viên", dataIndex: "studentCode" },
        { title: "Lớp", dataIndex: "className" },
        { title: "Môn học", dataIndex: "subjectName" },
        {
            title: "Học phí môn học", dataIndex: "tuitionFee",
            render: (value) => {
                return formatVND(value);
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: string) => {
                let color = "";
                let text = "";
                switch (status) {
                    case "Approved":
                        color = "green";
                        text = "Đã thanh toán";
                        break;
                    case "Pending":
                        color = "orange";
                        text = "Chưa thanh toán";
                        break;
                    case "CancelledByStudent":
                    case "Cancel":
                        color = "red";
                        text = "Đã hủy";
                        break;
                    default:
                        color = "gray";
                        text = status;
                }
                return <Tag color={color} style={{ fontWeight: 600, padding: "0 12px", borderRadius: 8 }}>{text}</Tag>;
            },
        },
    ];

    const getData = async (page = 1, limit = 10) => {
        const res = await StaticServices.GetPayments({ page, limit }) as AxiosResponse<ApiResponse<any>>;
        setData(res?.data?.data || []);
        setPagination({
            current: res?.data?.pagination?.page || 1,
            pageSize: res?.data?.pagination?.limit || 10,
            total: res?.data?.pagination?.total || 0,
        });
    };

    useEffect(() => {
        getData();
    }, []);

    const handleTableChange = (pagination: any) => {
        getData(pagination.current, pagination.pageSize);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <Title level={4}>Quản lý học phí</Title>
            </div>
            <Table
                rowKey={(record) => record.studentCode}
                columns={columns}
                dataSource={data}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
        </>
    );
};


export default Tuition