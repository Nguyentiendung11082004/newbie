import { Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { StudentSubjectServices, SubjectServices } from '../../services/student.services';
import { useAppSelector } from '../../redux/hook';

type Props = {
    isModalOpen: boolean,
    setIsOpen: any;
}
const DialogSubject = ({ isModalOpen, setIsOpen }: Props) => {
    const [data, setData] = useState([]);
    const userId = useAppSelector((state) => state.user.userInfo.student._id);
    const [payload, setPayload] = useState({
        subject_id: '',
        student_id: userId,
    })
    const getData = async () => {
        let res = await SubjectServices.GetAll();
        setData(res.data)
    }
    const handleOk = async () => {
        let res = await StudentSubjectServices.AddSubjectEnroll(payload)
        setIsOpen(false)
        setPayload({
            subject_id: '',
            student_id: '',
        })
    }
    const handleHuy = () => {
        setPayload({
            subject_id: '',
            student_id: '',
        })
        setIsOpen(false)
    }
    console.log("payload", payload)
    useEffect(() => {
        getData()
    }, []);
    return (
        <Modal title="Đăng ký môn học" open={isModalOpen} onOk={handleOk} onCancel={() => handleHuy()}>
            <div className='w-full'>
                <Select placeholder="Chọn môn học" value={payload.subject_id} onChange={(e) => setPayload((prev) => ({ ...prev, subject_id: e }))} style={{ width: '100%' }}>
                    {data?.map((subject: any) => (
                        <Select.Option key={subject._id} value={subject._id}>
                            {subject.name}
                        </Select.Option>
                    ))}
                </Select>

            </div>
        </Modal>
    )
}

export default DialogSubject