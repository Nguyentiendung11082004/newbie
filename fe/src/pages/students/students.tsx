/// <reference types="vite/client" />
import { Button, Table, Typography } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { StudentServices } from '../../services/student.services';
import { IStudents } from '../../types/student';
import { formatDateStringGMT } from '../../common/helpfunction';
import React from 'react';
import { toast } from 'react-toastify';

const { Title } = Typography;

const initFilter = {
  CurrentPage: 1,
  PageSize: 5,
  KeyWord: "",
  TotalItem: 0,
};

const Student = () => {
  const [filter, setFilter] = useState(initFilter);
  const [data, setData] = useState<IStudents[]>([]);
  const params = {
    _page: filter.CurrentPage,
    _limit: filter.PageSize,
    _sort: 'createdAt',
    ...(filter.KeyWord && { _keyword: filter.KeyWord })
  }
  const getData = async () => {
    const res = await StudentServices.GetList(params);
    if (res?.data) {
      setData(res.data.map((e, index) => ({
        ...e,
        STT: (res?.pagination.page - 1) * res.pagination.limit + index + 1
      })));
      setFilter((prev) => ({ ...prev, TotalItem: res.pagination.totalDocs }))
    }
  };
  const handleExport = async () => {
    let res = await StudentServices.Export();
    if (res) {
      toast.success(res.data.message)
    }
    // window.open(import.meta.env.VITE_API_URL + res.data.Url)
  }
  const columns: ColumnType<IStudents>[] = [
    {
      title: 'STT',
      dataIndex: 'STT',
      // render: (_value, _record, index) => (filter.CurrentPage - 1) * filter.PageSize + index + 1,
    },
    {
      title: 'Tên học sinh',
      dataIndex: 'name'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      render: (value, record, index) => {
        return formatDateStringGMT(record.dob, "dd/mm/yyyy")
      }
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address'
    },

    {
      title: 'Giới tính',
      dataIndex: 'gender'
    },
    {
      title: 'Thời gian nhập học',
      dataIndex: 'createdAt',
      render: (value, record, index) => {
        return formatDateStringGMT(record.createdAt, "dd/mm/yyyy")
      }
    },
  ];


  useEffect(() => {
    getData();
  }, [filter.CurrentPage]);

  return (
    <>
      <Title level={4}>Danh sách sinh viên</Title>
      <Button onClick={handleExport}>Xuất Excel</Button>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        pagination={{
          current: filter.CurrentPage,
          pageSize: filter.PageSize,
          total: filter.TotalItem,
          // showSizeChanger: true,
          onChange: (page, pageSize) => {
            setFilter({
              ...filter,
              CurrentPage: page,
              PageSize: pageSize,
            });
          }
        }}
      />
    </>
  );
};

export default Student;
