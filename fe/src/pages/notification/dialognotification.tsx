import React, { useEffect, useState } from 'react'
import { Modal as AntModal, Input, Row, Col, Select } from "antd"
import TextArea from 'antd/es/input/TextArea'
import { NotificationServices } from '../../services/student.services';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { GetDataClass } from '../../redux/slices/classSlice';
import { Notification } from '../../types/notification';
type Props = {
    dialog: boolean,
    setDialog: any;
    dataEdit: any;
    setDataEdit: any
}

const DialogNotification = ({ dialog, setDialog, dataEdit, setDataEdit }: Props) => {
    const init = {
        title: "",
        content: "",
        class_id: "",
        target_type: "all" as "all",
    }
    const arrClass = useAppSelector((state: any) => state.class);
    const user = useAppSelector((state) => state.user.userInfo.user);
    const dispatch = useAppDispatch();
    const [payload, setPayload] = useState<Notification | null>(init)
    const handleConfirm = async (pay) => {
        try {
            const payloadToSend = { ...pay };
            if (user.role !== "teacher") {
                delete payloadToSend.class_id;
            } else {
                delete payloadToSend.target_type;
            }
            const res = Object.keys(dataEdit ?? {}).length > 0
                ? await NotificationServices.Update(payloadToSend)
                : await NotificationServices.Add(payloadToSend);
            if (res) {
                toast.success(res.message)
                setDialog(false)
                setPayload(init)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const handleCancel = () => {
        setDialog(false)
        setDataEdit(null)
    }
    const getById = async (id) => {
        let res = await NotificationServices.Get(id) as any;
        setPayload(res.data)
    }

    useEffect(() => {
        if (Object.keys(dataEdit ?? {}).length > 0 && dialog) {
            getById(dataEdit._id)
        }
    }, [dataEdit, dialog])
    useEffect(() => {
        dispatch(GetDataClass());
    }, []);
    return (
        <AntModal
            title={`${Object.keys(dataEdit ?? {}).length > 0 ? 'Cập nhật thông báo' : 'Thêm mới thông báo'}`}
            open={dialog}
            onOk={() => handleConfirm(payload)}
            onCancel={handleCancel}
            width={900}
            getContainer={false}
        >
            <div style={{ width: '100%', marginTop: '1rem' }}>
                <Row gutter={[18, 18]}>
                    <Col span={24}>
                        <div className="form-item">
                            <label className="form-label">Tiêu đề</label>
                            <Input
                                placeholder="Nhập tiêu đề thông báo"
                                value={payload?.title}
                                onChange={(e) =>
                                    setPayload((prev) => ({
                                        ...(prev ?? init),
                                        title: e.target?.value,
                                    }))
                                }
                            />
                        </div>
                    </Col>

                    <Col span={24}>
                        <div className="form-item">
                            <label className="form-label">Nội dung</label>
                            <TextArea
                                rows={5}
                                placeholder="Nhập nội dung thông báo"
                                value={payload?.content}
                                onChange={(e) =>
                                    setPayload((prev) => ({
                                        ...(prev ?? init),
                                        content: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </Col>
                    {
                        user.role === 'teacher' && <Col span={24}>
                            <div className="form-item">
                                <label className="form-label">Chọn lớp học</label>
                                <Select
                                    style={{ width: '100%' }}
                                    value={(payload?.class_id)}
                                    onChange={(e) => setPayload((prev) => ({ ...(prev ?? init), class_id: e }))}
                                    options={arrClass?.data?.map((e: any) => ({
                                        value: e._id,
                                        label: e.ClassName
                                    }))}
                                />
                            </div>
                        </Col>
                    }

                </Row>
            </div>
        </AntModal>
    )
}

export default DialogNotification