export interface IStudents {
    name: string;
    dob: Date;
    gender: 'Nam' | 'Nữ' | 'Khác'; 
    email: string;
    phone: string;
    address: string;
    ClassId: string | ObjectId; 
}
