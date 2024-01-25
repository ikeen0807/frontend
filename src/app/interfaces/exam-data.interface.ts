export interface ExamData{
  ID: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  name: string;
  date: Date;
  max_points: number;
  description: string;
  exam_type_id: number;
}
