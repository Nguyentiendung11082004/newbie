import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Card, Badge, Spin, Typography } from "antd";
import { NotificationServices } from "../../services/student.services";

interface Notification {
    _id: string;
    title: string;
    content: string;
    sender_role?: "admin" | "teacher";
    sender_id?: { email: string };
    target_type?: "all" | "student" | "teacher" | "class" | "subject";
    class_id?: string;
    createdAt?: string;
    updatedAt?: string;
}
const { Title, Text } = Typography;
const targetColor: Record<string, string> = {
    all: "#52c41a",       // xanh lá
    student: "#722ed1",   // tím
    teacher: "#1890ff",   // xanh dương
    class: "#13c2c2",     // xanh nhạt
    subject: "#fa8c16",   // cam
};

const NotificationFeed: React.FC = () => {
    const [data, setData] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        setLoading(true);
        try {
            const res = await NotificationServices.GetList('view');
            setData(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // if (loading) return <Spin tip="Đang tải thông báo..." />;

    if (!data.length) return <p>Chưa có thông báo nào.</p>;


    return (
        <div>
            <div style={{ marginBottom: 12 }}>
                <Title level={2} style={{ marginBottom: 4 }}>
                    Thông báo & Tin tức
                </Title>
                <Text type="secondary">
                    Các thông báo mới nhất từ nhà trường và giảng viên
                </Text>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {data.map((noti) => (
                    <Card
                        key={noti._id}
                        style={{ boxShadow: "0 3px 12px rgba(0,0,0,0.1)", borderRadius: 8 }}
                        hoverable
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>{noti.title}</h3>
                            {noti.target_type && (
                                <Badge
                                    color={targetColor[noti.target_type]}
                                    text={noti.target_type.toUpperCase()}
                                />
                            )}
                        </div>
                        <p style={{ margin: "8px 0", lineHeight: 1.6 }}>{noti.content}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555" }}>
                            <div>
                                Người đăng: <strong>{noti.sender_id?.email}</strong>
                            </div>
                            <div>
                                Thời gian: {dayjs(noti.createdAt).format("HH:mm:ss - DD/MM/YYYY")}
                                {noti.updatedAt && (
                                    <span style={{ marginLeft: 12, fontStyle: "italic", color: "#888" }}>
                                        Cập nhật lần cuối: {dayjs(noti.updatedAt).format("HH:mm:ss - DD/MM/YYYY")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NotificationFeed;
