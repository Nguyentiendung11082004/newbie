import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Popconfirm } from "antd";
import { StudentWalletServices } from "../../../services/student.services";
import dayjs from "dayjs";
import { formatTimeStr } from "antd/es/statistic/utils";
import { formatVND } from "../../../common/helpfunction";
import { toast } from "react-toastify";

const StudentDebt = () => {
  const [data, setData] = useState<any[]>([]);

  const getData = async () => {
    let res = await StudentWalletServices.GetDebtWallter();
    setData(res?.data || []);
  };

  const columns = [
    {
      title: "Môn học",
      dataIndex: ["teaching_assignment_id", "subject_id", "name"],
      key: "subject",
    },
    {
      title: "Lớp",
      dataIndex: "",
      key: "class",
      render: (_, record) =>
        record.teaching_assignment_id?.class_id?.ClassName
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color =
          status === "Pending"
            ? "volcano"
            : status === "Approved"
              ? "green"
              : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Ngày ghi danh",
      dataIndex: "enrolled_at",
      key: "enrolled_at",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "—"),
    },

    {
      title: "Số tiền cần đóng",
      dataIndex: "amount",
      key: "amount",
      render: (_, record: any) =>
        formatVND(record.teaching_assignment_id.subject_id.tuitionFee ?? 0)
    },
    {
      title: "Hạn thanh toán",
      key: "dueDate",
      render: (_: any, record: any) => {
        return record.enrolled_at
          ? dayjs(record.enrolled_at).add(7, "day").format("DD/MM/YYYY")
          : "—";
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn thanh toán học phí môn học này không?"
            onConfirm={() => handleThanhToan(record)}
          >
            <Button type="primary" size="small">
              Thanh toán
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleThanhToan = async (data) => {
    let res = await StudentWalletServices.MakePayment({
      amount: data.teaching_assignment_id.subject_id.tuitionFee,
      enrollmentId: data._id
    })
    console.log("res", res)
    if (res.StatusCodes === 200) {
      toast.success(res.message);
      getData()
    } else {
      toast.error(res.message)
    }
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Công nợ của tôi</h2>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
      {data.length === 0 && (
        <p style={{ fontStyle: "italic", color: "#888", marginTop: 12 }}>
          Bạn không có khoản công nợ nào cần thanh toán 🎉
        </p>
      )}
    </div>

  );
};

export default StudentDebt;
