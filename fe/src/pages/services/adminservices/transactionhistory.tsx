import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { StaticServices } from '../../../services/static.services';
import dayjs from 'dayjs';
import { Form, Select, DatePicker, Button, Row, Col } from 'antd';
const { RangePicker } = DatePicker;
import { Typography, Space } from 'antd';
const { Title, Text } = Typography;
const TransactionHistory = () => {
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        total: 0
    });
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        setLoading(true);
        try {
            const params = {
                page: filter.page,
                limit: filter.limit,
            };
            const res = await StaticServices.GetAllTransactions(params) as any;
            setData(res.data);
            setFilter(prev => ({
                ...prev,
                total: res.pagination.total,
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [filter.page]);

    const columns: ColumnsType<any> = [
        {
            title: 'Mã SV',
            dataIndex: ['student_id', 'StudentCode'],
            key: 'studentCode',
        },
        {
            title: 'Tên sinh viên',
            dataIndex: ['student_id', 'name'],
            key: 'name',
        },
        {
            title: 'Loại giao dịch',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) =>
                type === 'topup'
                    ? <Tag color="blue">Nạp tiền</Tag>
                    : <Tag color="green">Thanh toán</Tag>
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            // align: 'right',
            render: (amount: number) =>
                amount.toLocaleString('vi-VN') + ' đ'
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (status: string) => {
        //         if (status === 'Success') return <Tag color="green">Thành công</Tag>;
        //         if (status === 'Pending') return <Tag color="orange">Đang xử lý</Tag>;
        //         return <Tag color="red">Thất bại</Tag>;
        //     }
        // },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) =>
                dayjs(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        }
    ];

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={3} style={{ marginBottom: 0 }}>
                    Lịch sử giao dịch
                </Title>
                <Text type="secondary">
                    Quản lý toàn bộ giao dịch nạp tiền và thanh toán học phí
                </Text>
            </Space>
            <Space
                style={{
                    marginTop: 16,
                    marginBottom: 16,
                    width: '100%',
                    justifyContent: 'space-between'
                }}
            >
                <Space>
                    <Select
                        placeholder="Loại giao dịch"
                        allowClear
                        style={{ width: 160 }}
                        onChange={(value) =>
                            setFilter((prev) => ({
                                ...prev,
                                page: 1,
                                type: value
                            }))
                        }
                        options={[
                            { value: 'topup', label: 'Nạp tiền' },
                            { value: 'payment', label: 'Thanh toán' }
                        ]}
                    />

                    <Select
                        placeholder="Trạng thái"
                        allowClear
                        style={{ width: 160 }}
                        onChange={(value) =>
                            setFilter((prev) => ({
                                ...prev,
                                page: 1,
                                status: value
                            }))
                        }
                        options={[
                            { value: 'Success', label: 'Thành công' },
                            { value: 'Pending', label: 'Đang xử lý' },
                            { value: 'Failed', label: 'Thất bại' }
                        ]}
                    />

                    <RangePicker
                        onChange={(dates) =>
                            setFilter((prev) => ({
                                ...prev,
                                page: 1,
                                fromDate: dates?.[0]?.toISOString(),
                                toDate: dates?.[1]?.toISOString()
                            }))
                        }
                    />
                </Space>

                <Button
                    onClick={() =>
                        setFilter({
                            page: 1,
                            limit: filter.limit,
                            total: 0
                        })
                    }
                >
                    Reset
                </Button>
            </Space>
            <Table
                title={() => (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 16,
                        fontWeight: 600
                    }}>
                        <span>Lịch sử giao dịch</span>
                    </div>
                )}
                rowKey="_id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{
                    current: filter.page,
                    pageSize: filter.limit,
                    total: filter.total,
                    showSizeChanger: false,
                    onChange: (page, limit) =>
                        setFilter({ page, limit, total: filter.total })
                }}
            />
        </>
    );
};

export default TransactionHistory;
