import React, { useEffect, useState } from 'react'
import { ClassServices } from '../../services/class.services'
import { Table, Typography } from 'antd';
import { IClass } from '../../types/class';
import type { ColumnType } from 'antd/es/table';
import { initFilter } from '../../common/helpfunction';

const { Title } = Typography;



const Class = () => {
    const [filter, setFilter] = useState(initFilter);
    const [data, setData] = useState<IClass[]>([]);
    const params = {
        _page: filter.CurrentPage,
        _limit: filter.PageSize,
        _sort: 'createdAt',
        ...(filter.KeyWord && { _keyword: filter.KeyWord })
    }
    const getData = async () => {
            const res = await ClassServices.GetList(params);
            if (res?.data) {
                setData(res.data);
            }
    };

    const columns: ColumnType<IClass>[] = [
        {
            title: 'STT',
            dataIndex: 'STT',
            render: (_value, _record, index) => (filter.CurrentPage - 1) * filter.PageSize + index + 1,
        },
        {
            title: 'Tên lớp học',
            dataIndex: 'ClassName'
        },
        {
            title: 'Năm học',
            dataIndex: 'AcademicYear',
        }
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    return (
        <>
            <Title level={4}>Danh sách lớp học</Title>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
                pagination={{
                    current: filter.CurrentPage,
                    pageSize: filter.PageSize,
                    total: data.length,
                    showSizeChanger: true,
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

export default Class;
