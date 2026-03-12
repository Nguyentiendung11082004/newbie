"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// URI DB
const MONGO_URI = "mongodb://127.0.0.1:27017/students_management";
// ===== IMPORT MODELS =====
const semester_1 = __importDefault(require("../src/model/semester"));
const class_1 = __importDefault(require("../src/model/class"));
const subject_1 = __importDefault(require("../src/model/subject"));
const auth_1 = __importDefault(require("../src/model/auth"));
const teacher_1 = __importDefault(require("../src/model/teacher"));
const student_1 = __importDefault(require("../src/model/student"));
const notification_1 = __importDefault(require("../src/model/notification"));
const major_1 = __importDefault(require("../src/model/major"));
async function seed() {
    await mongoose_1.default.connect(MONGO_URI);
    console.log("Connected DB");
    // ===== CLEAR DATA =====
    await Promise.all([
        major_1.default.deleteMany({}),
        semester_1.default.deleteMany({}),
        class_1.default.deleteMany({}),
        subject_1.default.deleteMany({}),
        auth_1.default.deleteMany({}),
        teacher_1.default.deleteMany({}),
        student_1.default.deleteMany({}),
        notification_1.default.deleteMany({})
    ]);
    // ===== MAJOR =====
    const majors = await major_1.default.insertMany([
        { name: "Công nghệ thông tin", code: "CNTT", description: "Ngành Công nghệ thông tin" },
        { name: "Thiết kế đồ họa", code: "TKDH", description: "Ngành Thiết kế đồ họa" }
    ]);
    // ===== SEMESTER =====
    const semesters = await semester_1.default.insertMany([
        {
            name: "Học kỳ 1 - 2026",
            code: "HK1-2026",
            startDate: new Date("2026-01-01"),
            endDate: new Date("2026-05-01")
        }
    ]);
    // ===== CLASS =====
    const classes = await class_1.default.insertMany([
        { ClassName: "Web2025A", AcademicYear: 2025, MajorId: majors[0]._id },
        { ClassName: "Web2025B", AcademicYear: 2025, MajorId: majors[0]._id }
    ]);
    // ===== SUBJECT =====
    const subjects = await subject_1.default.insertMany([
        { name: "Lập trình NodeJS", code: "NODEJS", credits: 3, tuitionFee: 1500000, majorId: majors[0]._id },
        { name: "Lập trình ReactJS", code: "REACTJS", credits: 3, tuitionFee: 1500000, majorId: majors[0]._id }
    ]);
    // ===== AUTH =====
    const auths = await auth_1.default.insertMany([
        { email: "admin@fpt.edu.vn", password: "123456", role: "admin" },
        { email: "thay.long@fpt.edu.vn", password: "123456", role: "teacher" },
        { email: "sv.nguyenan@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.tranbinh@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.lehoang@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.phamminh@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.vuthao@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.dangduc@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.doanhkhoa@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.nguyenlinh@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.tranphuong@fpt.edu.vn", password: "123456", role: "student" },
        { email: "sv.lethao@fpt.edu.vn", password: "123456", role: "student" }
    ]);
    // ===== TEACHER =====
    const teacher = await teacher_1.default.create({
        authId: auths[1]._id,
        name: "Nguyễn Văn Long",
        email: "thay.long@fpt.edu.vn",
        dob: new Date("1982-03-15"),
        gender: "Nam",
        phone: "0903456789",
        address: "Cầu Giấy, Hà Nội"
    });
    // ===== STUDENT =====
    const studentNames = [
        "Nguyễn Văn An",
        "Trần Văn Bình",
        "Lê Hoàng Nam",
        "Phạm Minh Đức",
        "Vũ Thị Thảo",
        "Đặng Quốc Dũng",
        "Đỗ Anh Khoa",
        "Nguyễn Thu Linh",
        "Trần Phương Anh",
        "Lê Thị Thảo"
    ];
    const students = await student_1.default.insertMany(auths.slice(2).map((a, i) => ({
        authId: a._id,
        name: studentNames[i],
        StudentCode: `SV${(i + 1).toString().padStart(3, "0")}`,
        email: a.email,
        dob: new Date(2004, i, i + 5),
        gender: i % 2 === 0 ? "Nam" : "Nữ",
        phone: `09876543${(i + 1).toString().padStart(2, "0")}`,
        address: "Nam Từ Liêm, Hà Nội",
        classId: [i < 5 ? classes[0]._id : classes[1]._id],
        major_id: majors[0]._id
    })));
    // ===== NOTIFICATION =====
    await notification_1.default.insertMany([
        {
            title: "Thông báo chung",
            content: "Chào mừng sinh viên đến với học kỳ mới!",
            sender_id: auths[0]._id,
            sender_role: "admin",
            target_type: "all"
        },
        {
            title: "Thông báo lớp Web2025A",
            content: "Tuần sau lớp bắt đầu học môn NodeJS tại phòng A101.",
            sender_id: teacher.authId,
            sender_role: "teacher",
            target_type: "class",
            class_id: classes[0]._id
        }
    ]);
    console.log("Seed data DONE");
    process.exit();
}
seed().catch(err => {
    console.error(err);
    process.exit(1);
});
