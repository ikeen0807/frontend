import { SchoolStudentData } from "./school-student-data.interface";

export interface ClassListData {
  ID: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
  name: string;
  is_active: true;
  year: string;
  school_id: number;
  teacher_id: number;
  students: Array<SchoolStudentData>
}
