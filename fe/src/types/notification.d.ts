export interface Notification {
    _id?: string;
    title: string;
    content: string;
    sender_role?: "admin" | "teacher";
    target_type?: "all" | "student" | "teacher" | "class" | "subject";
    class_id?: string;
    createdAt?: string;
}