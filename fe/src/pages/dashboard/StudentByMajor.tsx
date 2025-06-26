import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { StaticServices } from '../../services/static.services';

type StudentByMajor = {
    major: string;
    count: number
}
const StudentByMajorChart = () => {

    const [data, setData] = useState<StudentByMajor[]>();

    const getData = async () => {
        let res = await StaticServices.GetStudentByMajor();
        if (res) {
            setData(res.data)
        }
    }
    useEffect(() => {
        getData()
    }, [])
    const option = {
        title: {
            text: 'Tỉ lệ sinh viên theo ngành',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: 'Ngành học',
                type: 'pie',
                radius: '50%',
                data: data?.map((item) => ({
                    value: item.count,
                    name: item.major,
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default StudentByMajorChart;
