import { Input, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { SubjectServices } from '../../services/student.services';
import { initFilter } from '../../common/helpfunction';
import { GetDataSubject } from '../../redux/slices/subjectSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { RootState } from '../../redux';

type Props = {
    isModalOpen: boolean,
    handleOk: () => void;
}


const DialogSubject = ({ isModalOpen, handleOk }: Props) => {
    const dispatch = useAppDispatch();
    const { data, loading } = useAppSelector((state: any) => state.subject);
    console.log("data", data)
    useEffect(() => {
        dispatch(GetDataSubject());
    }, []);
    return (
        <Modal title="Đăng ký môn học" open={isModalOpen} onOk={handleOk} onCancel={() => { }}>
            <div>
                <Select placeholder="Chọn môn học" value={''} onChange={() => { }}>
                    {/* {subjects.map((subject) => (
                        <Select.Option key={subject._id} value={subject._id}>
                            {subject.name}
                        </Select.Option>
                    ))} */}
                </Select>

            </div>
        </Modal>
    )
}

export default DialogSubject