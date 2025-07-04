import React, { useEffect, useState } from 'react';
import { Card, Table, Select, Button, Space, Input, InputNumber, Row, Col, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { GetDataClass } from '../../redux/slices/classSlice';
import { GetDataSubject } from '../../redux/slices/subjectSlice';
import { GradeServices } from '../../services/student.services';
import { toast } from 'react-toastify';
import { SearchOutlined, SaveOutlined, FilterOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const Grade = () => {
    const dispatch = useAppDispatch();
    const { data: classList } = useAppSelector((state: any) => state.class);
    const { data: subjectList } = useAppSelector((state: any) => state.subject);
    const [data, setData] = useState([]);
    const [payload, setPayload] = useState({
        class_id: '',
        subject_id: '',
        semester_id: '6864d9e0352ab358356f77f9',
        grades: []
    });

    const columns = [
        { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_: any, __: any, index: number) => index + 1, width: 60 },
        { title: 'Họ và tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Mã sinh viên', dataIndex: 'StudentCode', key: 'studentCode' },
        {
            title: 'Điểm quá trình', key: 'processScore', render: (rowData) => (
                <InputNumber min={0} max={10} value={rowData?.processScore ?? null} onChange={(e) => handleSetform("processScore", e, rowData)} />
            )
        },
        {
            title: 'Điểm giữa kỳ', key: 'midtermScore', render: (rowData) => (
                <InputNumber min={0} max={10} value={rowData?.midtermScore ?? null} onChange={(e) => handleSetform("midtermScore", e, rowData)} />
            )
        },
        {
            title: 'Điểm cuối kỳ', key: 'finalScore', render: (rowData) => (
                <InputNumber min={0} max={10} value={rowData?.finalScore ?? null} onChange={(e) => handleSetform("finalScore", e, rowData)} />
            )
        },
        {
            title: 'Điểm TB', key: 'averageScore', render: (rowData) => (
                <InputNumber min={0} max={10} value={rowData?.averageScore ?? null} disabled />
            )
        },
        {
            title: 'Trạng thái', dataIndex: '', key: 'status', render: (rowData) => {
                return <span style={{ color: `${rowData.averageScore >= 5 ? 'green' : 'red'}` }}>{rowData.status}</span>
            }
        },
    ];

    const getData = async (payload) => {
        try {
            const res = await GradeServices.GetStudentForGrading(payload);
            setData(res.data);
            // toast.success('Lấy dữ liệu thành công');
        } catch (error) {
            const message = error.response?.data?.message || "Đã có lỗi xảy ra";
            setPayload((prev) => ({ ...prev, grades: [] }));
            toast.error(message);
        }
    };

    const handleSetform = (field, value, row) => {
        setPayload((prev: any) => ({
            ...prev,
            grades: prev.grades.map((item) =>
                item.student_id === row.student_id
                    ? { ...item, [field]: value }
                    : item
            )
        }));
    };

    const handleGetData = () => {
        if (!payload.class_id || !payload.subject_id) {
            toast.error('Vui lòng chọn lớp và môn học');
            return;
        }
        getData(payload);
    };

    const handleGhiLai = async () => {
        try {
            await GradeServices.CreateGrade(payload);
            getData(payload);
            toast.success('Ghi điểm thành công');
        } catch {
            toast.error('Có lỗi xảy ra khi ghi điểm');
        }
    };

    useEffect(() => {
        setPayload((prev: any) => ({
            ...prev,
            grades: data
        }));
    }, [data]);

    useEffect(() => {
        dispatch(GetDataClass());
        dispatch(GetDataSubject());
    }, []);

    return (
        <Card>
            <Title level={3}>Quản lý điểm</Title>
            <Row gutter={[16, 16]} align="middle" className="mb-4">
                <Col>
                    <Select
                        placeholder="Chọn lớp"
                        className="w-44"
                        value={payload.class_id}
                        onChange={(e) => setPayload((prev) => ({ ...prev, class_id: e }))}
                    >
                        {classList?.map((e) => (
                            <Option key={e._id} value={e._id}>
                                {e.ClassName}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Select
                        placeholder="Chọn môn"
                        className="w-52"
                        value={payload.subject_id}
                        onChange={(e) => setPayload((prev) => ({ ...prev, subject_id: e }))}
                    >
                        {subjectList?.map((e) => (
                            <Option key={e._id} value={e._id}>
                                {e.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Input.Search placeholder="Tìm kiếm sinh viên" className="w-56" />
                </Col>
                <Col>
                    <button
                        onClick={handleGetData}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
                    >
                        <FilterOutlined /> Lọc
                    </button>
                </Col>
                <Col>
                    <button
                        onClick={handleGhiLai}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition"
                    >
                        <SaveOutlined /> Ghi lại
                    </button>
                </Col>
                <Col>
                    <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg shadow transition">
                        <FileExcelOutlined /> Export Excel
                    </button>
                </Col>
                <Col>
                    <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow transition">
                        <PrinterOutlined /> In
                    </button>
                </Col>
            </Row>


            <Table
                columns={columns}
                dataSource={payload.grades}
                rowKey="student_id"
                pagination={{ pageSize: 10 }}
                bordered
            />


        </Card>
    );
};

export default Grade;
