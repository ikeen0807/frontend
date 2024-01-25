export interface CreateExamDTO {
  name: string;
  date: Date;
  max_points: number;
  description: string;
  exam_type_id: number;
}
