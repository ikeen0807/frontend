import { ClassListData } from "../interfaces/class-list-data.interface";
import { SchoolAddressData } from "../interfaces/school-address-data.interface";
import { SchoolFormData } from "../interfaces/school-form-data.interface";
import { SchoolUsersData } from "../interfaces/school-users-data.interface";

export interface GetSchoolListResponseDTO
{
id: number;
CreatedAt: Date;
UpdatedAt: Date;
DeletedAt: Date;
name: string;
school_form_id: number;
school_form: SchoolFormData;
address: SchoolAddressData;
users: Array<SchoolUsersData>;
classes: Array<ClassListData>;
}
