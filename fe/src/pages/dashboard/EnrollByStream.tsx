import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { StaticServices } from '../../services/static.services';

const Chart = () => {

    const [data, setData] = useState<any[]>()

    const getData = async () => {
        let res = await StaticServices.GetEnrolmentBySemester();
        if (res) {
            setData(res.data)
        }
    }
    useEffect(() => {
        getData()
    }, [])

    const option = {
        title: {
            text: 'Số lượng theo học kỳ',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: data?.map(item => item.semester),
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: data?.map(item => item.count),
                type: 'bar',
                barWidth: '50%',
                itemStyle: {
                    color: '#5470C6'
                },
            }
        ]
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default Chart;
