import { Request } from "express";

export const numberToDayOfWeek = (day: number): string => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[day];
};

export const getDayOfWeekFromDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 - 6
    return numberToDayOfWeek(day);
};

export interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
        teacherId: string
    };
}
