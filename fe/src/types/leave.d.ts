export interface Ileave {
    student_id: string;
    reason: string;
    fromDate: Date;
    toDate: Date;
    status: 'pending' | 'approved' | 'rejected';
    teacher_id: string;
    teaching_assignment_id: any;
    rejectionReason: string;
    reviewedAt: Date;
}