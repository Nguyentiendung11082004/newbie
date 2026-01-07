import React, { useEffect, useState } from 'react'
import { DatePicker, Input, Select, Typography } from "antd";
import { Modal as AntModal, Card } from "antd"
import { LeaveServices, TechingAssignmentServices } from '../../../services/student.services';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

type Props = {
    isModalOpen: boolean,
    setIsOpen: any
}
const format = 'HH:mm';
const init = {
    fromDate: "",
    toDate: "",
    reason: "",
    teaching_assignment_id: ""
}
const DialogLeave = ({ isModalOpen, setIsOpen }: Props) => {
    const [teching, setTeching] = useState([])
    const [payload, setPayload] = useState(init)
    const handleOk = async () => {
        if (checkValid(payload)) {
            let res = await LeaveServices.CreateLeave(payload);
            if (res.StatusCodes === 201) {
                toast.success('Thành công');
                setPayload(init)
                setIsOpen(false)
            } else {
                toast.error(res.message);
            }
        }

    }
    const checkValid = (pay) => {
        if (!pay.reason || pay.reason.trim() === "") {
            toast.error("Vui lòng nhập lý do nghỉ học");
            return false;
        }

        if (!pay.teaching_assignment_id) {
            toast.error("Vui lòng chọn môn học");
            return false;
        }

        if (!pay.fromDate) {
            toast.error("Vui lòng chọn ngày bắt đầu");
            return false;
        }

        if (!pay.toDate) {
            toast.error("Vui lòng chọn ngày kết thúc");
            return false;
        }
        return true;
    }
    const handleHuy = () => {
        setPayload(init)
        setIsOpen(false)
    };
    const setForm = (prop: string, value: any) => {
        setPayload((prev) => ({
            ...prev,
            [prop]: value
        }))
    }
    const getData = async () => {
        let res = await TechingAssignmentServices.GetList();
        setTeching(res?.data)
    }
    useEffect(() => {
        if (isModalOpen) {
            getData()
        }
    }, [isModalOpen])
    return (
        <>
            <AntModal
                title="Đơn xin nghỉ học"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleHuy}
                width={800}
                getContainer={false}
                bodyStyle={{ padding: 24 }}
            >
                <div className="flex flex-col gap-6">
                    <Card className="shadow-sm border rounded-lg">
                        <Typography.Text strong>Nội dung</Typography.Text>
                        <Input.TextArea
                            placeholder="Nhập lý do xin nghỉ..."
                            rows={4}
                            className="mt-2"
                            onChange={(e) => setForm('reason', e.target.value)}
                        />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-sm border rounded-lg">
                            <Typography.Text strong>Từ ngày</Typography.Text>
                            <DatePicker
                                style={{ width: '100%' }}
                                className="mt-2"
                                placeholder="Chọn ngày bắt đầu"
                                onChange={(e) => setForm('fromDate', e ? e.format("YYYY-MM-DD") : "")}
                                picker={'date'}
                                value={payload?.fromDate ? dayjs(payload.fromDate) : null}
                                format="DD/MM/YYYY"
                            />
                        </Card>

                        <Card className="shadow-sm border rounded-lg">
                            <Typography.Text strong>Đến ngày</Typography.Text>
                            <DatePicker
                                style={{ width: '100%' }}
                                className="mt-2"
                                placeholder="Chọn ngày bắt đầu"
                                onChange={(e) => setForm('toDate', e ? e.format("YYYY-MM-DD") : "")}
                                picker={'date'}
                                value={payload?.toDate ? dayjs(payload.toDate) : null}
                                format="DD/MM/YYYY"
                            />
                        </Card>
                    </div>

                    <Card className="shadow-sm border rounded-lg">
                        <Typography.Text strong>Chọn môn</Typography.Text>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Chọn môn học liên quan"
                            options={teching?.map((e: any) => ({
                                value: e._id,
                                label: `${e.class_id.ClassName} - ${e.subject_id.name}`
                            }))}
                            onChange={(e) => setForm("teaching_assignment_id", e)}
                            className="mt-2"
                        />
                    </Card>
                </div>
            </AntModal>

        </>
    )
}

export default DialogLeave