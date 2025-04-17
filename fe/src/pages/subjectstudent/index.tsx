import { Typography } from 'antd';
import React, { useEffect } from 'react'
import { useAppSelector } from '../../redux/hook';
import { StudentSubjectServices } from '../../services/student.services';

type Props = {}
const { Title } = Typography;
const SubjectStudent = (props: Props) => {
  const user = useAppSelector((state) => state.user.userInfo);
  const getData = async () => {
    let pay = {
      student_id: user._id
    }
    let res = await StudentSubjectServices.GetSubjectEnroll(pay);
    console.log("res", res)
  }

  useEffect(() => {
    getData()
  }, [])
  return (
    <Title level={4}>Danh sách môn học của tôi</Title>

  )
}

export default SubjectStudent