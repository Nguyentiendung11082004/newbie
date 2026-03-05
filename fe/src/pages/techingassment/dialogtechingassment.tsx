import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Modal, Select, Table, TimePicker } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDayOffWeek, uuidv4 } from '../../common/helpfunction';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { GetDataClass } from '../../redux/slices/classSlice';
import { GetDataSubject } from '../../redux/slices/subjectSlice';
import { GetDataTeacher } from '../../redux/slices/teacherSlice';
import { SemestersServices, TechingAssignmentServices } from '../../services/student.services';

type Props = {
    isModalOpen: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    dataEdit: any;
    setDataEdit: any;
}
const init = {
    teacher_id: "",
    subject_id: "",
    room: "",
    class_id: "",
    semester_id: "",
    startDate: "",
    numberOfClasses: 0,
    weeklySchedule: []
}
const format = 'HH:mm';
const DialogTechngassment = ({ isModalOpen, setVisible, dataEdit, setDataEdit }: Props) => {
    const [payload, setPayload] = useState(init);
    const dispatch = useAppDispatch();
    const arrThu = getDayOffWeek();
    const subject = useAppSelector((state: any) => state.subject);
    const teacher = useAppSelector((state: any) => state.teacher);
    const arrClass = useAppSelector((state: any) => state.class);
    const [listSemesters, setListSemeters] = useState([])
    const handleOk = async () => {
        try {
            if (dataEdit?._id) {
                let res = await TechingAssignmentServices.Update(dataEdit._id, payload);
                if (res) {
                    toast.success(res.data.message)
                    setVisible(false)
                }
            } else {
                let res = await TechingAssignmentServices.Add(payload);
                if (res) {
                    toast.success(res.data.message)
                    setVisible(false)
                    setPayload(init)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const handleClose = () => {
        setDataEdit(null)
        setVisible(false)

    }
    const getSemesters = async () => {
        let res = await SemestersServices.GetSemesters() as any;
        setListSemeters(res?.data)
    }
    const getById = async (id: string) => {
        let res = await TechingAssignmentServices.GetById(id)
        if (res) {
            setPayload(res.data.data)
        }
    }
    const handleSetForm = (props: any, value: any, record?: any) => {
        setPayload((prev: any) => {
            if (record) {
                const result = prev.weeklySchedule.map((e: any) => {
                    if (e.GUID ? e.GUID === record.GUID : e._id === record._id) {
                        return {
                            ...e,
                            [props]: value
                        }
                    }
                    return e
                });
                return {
                    ...prev,
                    weeklySchedule: result
                };
            }
            return {
                ...prev,
                [props]: value
            };
        });
    };

    const columns: any = [
        {
            title: 'STT',
            dataIndex: 'STT',
            render: (_value: any, _record: any, index: any) => index + 1,
        },
        {
            title: 'Thứ',
            render: (_value: any, _record: any, index: any) => <div>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Thứ"
                    value={_record?.dayOfWeek}
                    onChange={(e: any) => handleSetForm('dayOfWeek', e, _record)}
                    options={arrThu.map((e) => ({
                        value: e.value,
                        label: e.label
                    }))}
                />
            </div>
        },
        {
            title: 'Giờ bắt đầu',
            render: (_value: any, _record: any, index: any) => {
                return (
                    <TimePicker value={_record?.startTime ? dayjs(_record.startTime, format) : null} format={format}
                        onChange={(time, timeString: any) => handleSetForm("startTime", timeString, _record)} />
                )
            }
        },
        {
            title: 'Giờ kết thúc',
            render: (_value: any, _record: any, index: any) => <div>
                <TimePicker value={_record?.endTime ? dayjs(_record.endTime, format) : null} format={format}
                    onChange={(time, timeString: any) => handleSetForm("endTime", timeString, _record)}
                />
            </div>
        },
        {
            title: () => {
                return <>
                    <Button onClick={handleAdd}><PlusOutlined /></Button>
                </>
            },
            render: (_value: any, _record: any, index: any) => <div>
                <Button onClick={() => handleDelete(_record)}><DeleteOutlined /></Button>
            </div>
        }
    ];
    const handleAdd = () => {
        setPayload((prev: any) => ({
            ...prev,
            weeklySchedule: [
                ...prev.weeklySchedule,
                {
                    GUID: uuidv4(),
                }
            ]
        }))
    }
    const handleDelete = (value: any) => {
        setPayload((prev) => ({
            ...prev,
            weeklySchedule: prev.weeklySchedule.filter((e: any) => value.GUID ? e.GUID !== value.GUID : e._id !== value._id)
        }))
    }
    useEffect(() => {
        dispatch(GetDataTeacher());
        dispatch(GetDataClass());
        dispatch(GetDataSubject());
        getSemesters()
    }, []);
    useEffect(() => {
        if (dataEdit?._id) {
            getById(dataEdit._id);
        } else {
            setPayload(init);
        }
    }, [dataEdit]);

    return (
        <Modal title="Phân công giảng dạy" open={isModalOpen} onOk={handleOk} onCancel={() => handleClose()} width={1200}>
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn môn học</label>
                    <Select
                        // mode="multiple"
                        // disabled
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={(payload?.subject_id)}
                        onChange={(e) => handleSetForm('subject_id', e)}
                        options={subject.data?.map((e: any) => ({
                            value: e._id,
                            label: e.name
                        }))}
                    />
                </div>

                <div className='my-1'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn lớp học</label>
                    <Select
                        // mode="multiple"
                        // disabled
                        style={{ width: '100%' }}
                        value={(payload?.class_id)}
                        onChange={(e) => handleSetForm('class_id', e)}
                        options={arrClass?.data?.map((e: any) => ({
                            value: e._id,
                            label: e.ClassName
                        }))}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn giảng viên</label>
                    <Select
                        // mode="multiple"
                        // disabled
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={(payload?.teacher_id)}
                        onChange={(e) => handleSetForm('teacher_id', e)}
                        options={teacher.data?.data?.map((e: any) => ({
                            value: e._id,
                            label: e.name
                        }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
                    <DatePicker
                        onChange={(e) => handleSetForm('startDate', e ? e.format("YYYY-MM-DD") : "")}
                        style={{ width: 280 }}
                        className="border border-gray-300 rounded-lg p-2 mt-4  text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Chọn"
                        picker={'date'}
                        value={payload?.startDate ? dayjs(payload.startDate) : null}
                        format="DD/MM/YYYY"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số buổi</label>
                    <Input value={payload?.numberOfClasses} onChange={(e) => handleSetForm('numberOfClasses', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học</label>
                    <Input value={payload?.room} onChange={(e) => handleSetForm('room', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhập kỳ học</label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={(payload?.semester_id)}
                        onChange={(e) => handleSetForm('semester_id', e)}
                        options={listSemesters?.map((e: any) => ({
                            value: e._id,
                            label: e.name
                        }))}
                    />
                </div>
                <Table
                    rowKey="GUID"
                    columns={columns}
                    dataSource={payload.weeklySchedule}
                    pagination={false}
                />

            </div>

        </Modal>
    )
}

export default DialogTechngassment