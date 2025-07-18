import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { StaticServices } from '../../services/static.services';

const Chart = () => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const getData = async () => {
            const res = await StaticServices.GetEnrolmentBySemester();
            if (res?.data) {
                setData(res.data);
            }
        };
        getData();
    }, []);

    const semesters = data.map(item => item.semester);
    const majors = data.map(item => item.major);
    const series = majors.map(major => ({
        name: major,
        type: 'bar',
        stack: 'total',
        emphasis: {
            focus: 'series'
        },
        data: semesters.map(semester => {
            const found = data.find(d => d.semester === semester && d.major === major);
            return found ? found.count : 0;
        })
    }));

    const option = {
        title: {
            text: 'Số lượng sinh viên ghi danh theo học kỳ và ngành',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            top: 30
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: semesters
        },
        yAxis: {
            type: 'value'
        },
        series
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default Chart;
