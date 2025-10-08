import { Button, Card, DatePicker, Input, InputNumber, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import "../../../index.css";
import { StudentWalletServices } from '../../../services/student.services';
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
import { Modal as AntModal } from "antd"
import { toast } from 'react-toastify';

const StudentWalletPage = () => {
    const [data, setData] = useState<any>([]);
    const [isOpen, setIsOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const getData = async () => {
        let res = await StudentWalletServices.GetStudentWalletById({});
        if (res) {
            setData(res?.data)
        }
    }


    useEffect(() => {
        if (!isOpen) {
            getData()
        }
    }, [isOpen]);
    const columns: ColumnsType<any> = [
        // {
        //     title: 'STT',
        //     dataIndex: '',
        //     render: (value, record, idx) => (currentPage - 1) * pageSize + idx + 1
        // },
        {
            title: 'Ngày',
            dataIndex: 'createdAt',
            render: value => dayjs(value).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Loại giao dịch',
            dataIndex: 'type',
            render: type =>
                type === 'topup' ? <Tag color="green">Nạp tiền</Tag> : <Tag color="red">Thanh toán</Tag>,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (value, record) => (
                <Text type={record.type === 'topup' ? 'success' : 'danger'}>
                    {record.type === 'topup' ? '+' : '-'}
                    {value.toLocaleString()}₫
                </Text>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        // {
        //     title: 'Thời gian',
        //     dataIndex: '',
        //     render: (value, record) => (
        //         <Text>
        //             {formatDateStringGMT(record.createdAt, 'dd/mm/yyyy')}
        //         </Text>
        //     ),
        // },
    ];

    const handleChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };
    const handleOk = () => { }
    const handleHuy = () => {
        setIsOpen(false)
    }
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card>
                <Title level={4}>Thông tin sinh viên</Title>
                <Text strong>Tên:</Text> {data?.student_id?.name} <br />
                <Text strong>Email:</Text> {data?.student_id?.email} <br />
                <Text strong>Mã sinh viên:</Text> {data?.student_id?.StudentCode}
            </Card>

            <Card style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                <Title level={3} style={{ color: '#389e0d' }}>
                    💰 Số dư: {data?.balance?.toLocaleString() ?? 0}₫
                </Title>
                <Space>
                    <Button type="primary" onClick={() => setIsOpen(true)}>Nạp tiền</Button>
                </Space>
            </Card>

            <Card title="Lịch sử giao dịch">
                <Table
                    columns={columns}
                    dataSource={data?.transactions}
                    rowKey="_id"
                    pagination={false}
                    // pagination={{
                    //     current: currentPage,
                    //     pageSize: pageSize,
                    //     total: data?.transactions?.length,
                    //     // showSizeChanger: true, // Cho phép đổi số dòng/trang
                    // }}
                    // onChange={handleChange}
                    rowClassName={(record) => {
                        if (record.type === 'topup') return 'row-topup';
                        if (record.type === 'payment') return 'row-payment';
                        return '';
                    }}
                />
            </Card>
            <DialogTopUp isOpen={isOpen} setIsOpen={setIsOpen} />
        </Space>
    );
};
type Props = {
    isOpen?: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DialogTopUp = ({ isOpen, setIsOpen }: Props) => {
    const init = {
        type: "topup",
        amount: 0,
        description: ""
    }
    const [payload, setPayload] = useState(init)
    const handleOk = async () => {
        let res = await StudentWalletServices.TopUpWallter(payload);
        if (res.StatusCodes === 200) {
            handleHuy()
            toast.success(res.message)
        }

    }
    const handleHuy = () => {
        setPayload(init)
        setIsOpen(false)
    }
    const setForm = (prop, value) => {
        setPayload((prev) => ({ ...prev, [prop]: value }))
    }
    return (
        <AntModal
            title={<span className="text-lg font-semibold text-gray-800">💳 Nạp tiền vào ví</span>}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleHuy}
            className="custom-modal"
        >
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                    <InputNumber
                        placeholder="Nhập số tiền"
                        type="number"
                        style={{
                            borderRadius: '8px',
                            marginTop: '5px',
                            width: '100%'
                        }}
                        min={0}
                        onChange={(e: any) => setForm("amount", e)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <Input.TextArea
                        placeholder="Nhập mô tả"
                        rows={3}
                        className="mt-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100"
                        onChange={(e) => setForm("description", e.target.value)}
                    />
                </div>
            </div>
        </AntModal>
    );
}

export default StudentWalletPage;

