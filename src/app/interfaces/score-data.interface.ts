export interface ScoreData {
  ID: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  points: number;
  comment: string;
  grade_id: number;
  exam_id: number;
  student_id: number;
}
