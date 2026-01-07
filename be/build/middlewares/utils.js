"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayOfWeekFromDate = exports.numberToDayOfWeek = void 0;
const numberToDayOfWeek = (day) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[day];
};
exports.numberToDayOfWeek = numberToDayOfWeek;
const getDayOfWeekFromDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 - 6
    return (0, exports.numberToDayOfWeek)(day);
};
exports.getDayOfWeekFromDate = getDayOfWeekFromDate;
