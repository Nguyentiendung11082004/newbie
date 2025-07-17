import { Button, Table } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import { LeaveServices } from '../../../services/student.services'
import { Ileave } from '../../../types/leave'
import { ColumnType } from 'antd/es/table'
import { formatDateStringGMT } from '../../../common/helpfunction'

type Props = {}

const leave = (props: Props) => {
    const [filter, setFilter] = useState({
        page: 1
    })
    const [data, setData] = useState<Ileave[]>()
    const columns: ColumnType<any>[] = [
        {
            title: "STT",
            dataIndex: "STT",
            render: (row: Ileave, record: any, index: number) => index + 1
        },
        {
            title: 'Lý do',
            dataIndex: 'reason'
        },
        {
            title: 'Nghỉ từ ngày',
            dataIndex: 'fromDate',
            render: (row: Ileave, record: Ileave, index: number) => (<span>{formatDateStringGMT(record.fromDate, "dd/mm/yyyy")}</span>)
        },
        {
            title: 'Đến ngày',
            dataIndex: 'toDate',
            render: (row: Ileave, record: Ileave, index: number) => <span>{formatDateStringGMT(record.toDate, "dd/mm/yyyy")}</span>
        },
        {
            title: "Môn học",
            dataIndex: "subject_id",
            render: (row: Ileave, record: Ileave, index: number) => {
                return <>{record.teaching_assignment_id?.subject_id.name}</>
            }
        },
        {
            title: "Lớp học",
            dataIndex: "class_id",
            render: (row: Ileave, record: Ileave, index: number) => {
                return <>{record.teaching_assignment_id?.class_id.ClassName}</>
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: Ileave['status']) => {
              let color = "";
              let text = "";
              switch (status) {
                case "pending":
                  color = "orange";
                  text = "Chờ duyệt";
                  break;
                case "approved":
                  color = "green";
                  text = "Đã duyệt";
                  break;
                case "rejected":
                  color = "red";
                  text = "Từ chối";
                  break;
                default:
                  text = "Không rõ";
              }
              return <span style={{
                padding: "4px 8px",
                borderRadius: "8px",
                backgroundColor: `${color}20`,
                color: color,
                fontWeight: 500
              }}>{text}</span>;
            }
          }
          
    ];
    const handle = () => { }
    const getData = async (pay) => {
        let res = await LeaveServices.GetAllLeave(pay);
        if (res) {
            setData(res.data)
        }
    }

    useEffect(() => {
        getData(filter)
    }, [filter])
    return (
        <>
            <div className='flex justify-between items-center'>
                <Title level={4}>Danh sách phiếu xin nghỉ học</Title>
                <Button type='primary' onClick={handle}>Đăng ký nghỉ học</Button>
            </div>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
            />
        </>
    )
}

export default leave
