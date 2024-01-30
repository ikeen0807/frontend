export interface TeacherData {
ID: number;
created_at: Date;
updated_at: Date;
deleted_at: Date;
email: string;
username: string;
vorname?: string;
nachname?: string;
is_admin: boolean;
school_id: number;
}
