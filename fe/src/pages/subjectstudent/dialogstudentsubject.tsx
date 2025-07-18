import { Button, Modal, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { StudentSubjectServices, SubjectServices, TechingAssignmentServices } from '../../services/student.services';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { GetDataSubject } from '../../redux/slices/subjectSlice';
import { GetDataTeacher } from '../../redux/slices/teacherSlice';
import { toast } from 'react-toastify';
import { Modal as AntModal } from "antd"
import React from 'react';
type Props = {
    isModalOpen: boolean,
    setIsOpen: any,
    dataEdit: any,
    setDataEdit: any
}

const DialogSubject = ({ isModalOpen, setIsOpen, dataEdit, setDataEdit }: Props) => {
    const dispatch = useAppDispatch()
    const userId = useAppSelector((state) => state.user.userInfo.student?._id);
    const subject = useAppSelector((state: any) => state.subject);
    const teacher = useAppSelector((state: any) => state.teacher);
    const [data, setData] = useState<any[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const init = {
        subject_id: '',
        student_id: userId,
        teacher_id: '',
    }
    const [payload, setPayload] = useState(init)
    const handleOk = async () => {
        try {
            const res = await StudentSubjectServices.AddSubjectEnroll(payload);
            if (res) {
                toast.success(res.data.message)
            }
            setErrors({});
            setData([])
            setIsOpen(false);
            setPayload(init);
            setDataEdit({})
        } catch (error: any) {
            const result = error.response.data.errors;
            if (result) {
                let obj: { [key: string]: string } = {};
                result.forEach((e: any) => {
                    if (e.field && e.message) {
                        obj[e.field] = e.message;
                    }
                })
                setErrors(obj)
            } else {
                toast.error(error.response.data.message)
                setErrors({})
            }
        }
    };

    const getTechingassignment = async (pay: any) => {
        let res = await StudentSubjectServices.GetTeachingAssignmentsForEnroll(pay);
        setData(res?.data)
    }
    const columns: any = [
        {
            title: 'STT',
            render: (_: any, record: any, index: number) => index + 1
        },
        {
            title: "Môn học",
            dataIndex: ["subject_id", "name"],
            key: "subject",
        },
        {
            title: "Mã môn",
            dataIndex: ["subject_id", "code"],
            key: "subject_code",
        },
        {
            title: "Giảng viên",
            dataIndex: ["teacher_id", "name"],
            key: "teacher",
        },
        {
            title: "Lớp học",
            key: "class",
        },
        {
            title: "Học kỳ",
            dataIndex: "semester",
            key: "semester",
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (text: string) => new Date(text).toLocaleDateString("vi-VN"),
        },
        {
            title: "Số buổi",
            dataIndex: "numberOfClasses",
            key: "numberOfClasses",
        },
        {
            title: "Lịch học hàng tuần",
            key: "weeklySchedule",
            render: (_: any, record: any) =>
                record.weeklySchedule.map(
                    (s: any) => `${s.dayOfWeek} (${s.startTime} - ${s.endTime})`
                ).join(", "),
        },
        {
            title: "Chi tiết",
            key: "action",
            render: (_: any, record: any) => (
                <Button onClick={() => {}}>Xem</Button>
            ),
        },
    ];
    const handleHuy = () => {
        setPayload(init)
        setData([])
        setIsOpen(false)
        setErrors({})
        setDataEdit({})
    }
    const handleXem = () => {
        if (payload.subject_id || payload.teacher_id) {
            let pay = {
                subject_id: payload.subject_id || "",
                teacher_id: payload.teacher_id || "",
            }
            getTechingassignment(pay)
        }
    }
    useEffect(() => {
        dispatch(GetDataSubject())
        dispatch(GetDataTeacher())
    }, []);
    useEffect(() => {
        if (dataEdit && isModalOpen) {
            setPayload((prev) => ({
                ...prev,
                subject_id: dataEdit?.teaching_assignment_id?.subject_id._id,
                teacher_id: dataEdit?.teaching_assignment_id?.teacher_id._id,
            }))
        }
    }, [dataEdit, isModalOpen])
    useEffect(() => {
        if (payload.subject_id && payload.teacher_id && isModalOpen) {
          handleXem();
        }
      }, [payload, isModalOpen]);
      
    return (
        <>
            <AntModal
                title={`${Object.keys(dataEdit).length > 0 ? 'Chi tiết lịch học' : 'Đăng ký môn học'}`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleHuy}
                width={1220}
                getContainer={false}
            >
                <div style={{ width: '100%', marginTop: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.25rem' }}>
                            Chọn môn học
                        </label>
                        <Select
                            disabled={Object.keys(dataEdit).length > 0}
                            placeholder="Chọn môn học"
                            value={payload?.subject_id}
                            onChange={(e) => setPayload((prev) => ({ ...prev, subject_id: e }))}
                            style={{ width: '100%' }}
                        >
                            {subject?.data?.map((subject: any) => (
                                <Select.Option key={subject._id} value={subject._id}>
                                    {subject.name}
                                </Select.Option>
                            ))}
                        </Select>
                        {errors.subject_id && (
                            <p style={{ color: '#F56565', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                {errors.subject_id}
                            </p>
                        )}
                    </div>

                    <div style={{ margin: '20px 0px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.25rem' }}>
                            Chọn giảng viên
                        </label>
                        <Select
                            disabled={Object.keys(dataEdit).length > 0}
                            placeholder="Chọn giảng viên"
                            value={payload?.teacher_id}
                            onChange={(e) => setPayload((prev) => ({ ...prev, teacher_id: e }))}
                            style={{ width: '100%' }}
                        >
                            {teacher?.data?.data?.map((t: any) => (
                                <Select.Option key={t._id} value={t._id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                        {errors.teacher_id && (
                            <p style={{ color: '#F56565', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                {errors.teacher_id}
                            </p>
                        )}
                    </div>
                    {Object.keys(dataEdit).length > 0 ? '' : <Button onClick={handleXem} style={{ marginTop: '0.5rem' }}>
                        Xem chi tiết thông tin lịch học
                    </Button>
                    }
                    <Table columns={columns} dataSource={data} />
                </div>
            </AntModal>

        </>


    )
}

export default DialogSubject