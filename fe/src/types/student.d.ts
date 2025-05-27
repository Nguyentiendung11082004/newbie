import { ObjectId } from "mongoose";

export interface IStudents {
    name: string;
    dob: Date;
    gender: 'Nam' | 'Nữ' | 'Khác'; 
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    ClassId: string | ObjectId; 
}
