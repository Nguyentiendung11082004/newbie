import React from 'react';
import dayjs from "dayjs";
import { Modal, Form, Input, Select, DatePicker, Radio, Button } from "antd";
export default function StudentForm({ props }: any) {
    const { payload, setPayload, listClass, listMajor, onSubmit, isModalOpen, setIsModalOpen, handleOk } = props;
    const [form] = Form.useForm();
    const handleClose = () => {
        setIsModalOpen(false)
    }
    
    return (
        <Modal open={isModalOpen} onOk={handleOk} onCancel={() => handleClose()} width={780}>
            <Form
                form={form}
                layout="vertical"
                initialValues={payload}
                onFinish={onSubmit}
            >
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: "Nhập họ tên" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mã sinh viên"
                        name="StudentCode"
                        rules={[{ required: true, message: "Nhập mã sinh viên" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Ngày sinh" name="dob">
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item label="Giới tính" name="gender">
                        <Radio.Group>
                            <Radio value="Nam">Nam</Radio>
                            <Radio value="Nữ">Nữ</Radio>
                            <Radio value="Khác">Khác</Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>
                <Form.Item label="Số điện thoại" name="phone">
                    <Input />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                    <Input.TextArea rows={2} />
                </Form.Item>
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Ngành học" name="major_id">
                        <Select
                            options={listMajor?.map((m: any) => ({
                                value: m._id,
                                label: m.name,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Lớp học" name="classId">
                        <Select
                            mode="multiple"
                            options={listClass?.map((c: any) => ({
                                value: c._id,
                                label: c.ClassName,
                            }))}
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
}
