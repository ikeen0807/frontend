import { SchoolFormData } from "./school-form-data.interface";

export interface SchoolListData {
id: number;
CreatedAt: Date;
UpdatedAt: Date;
DeletedAt: Date;
name: string;
school_form_id: number;
school_form: SchoolFormData;
}
