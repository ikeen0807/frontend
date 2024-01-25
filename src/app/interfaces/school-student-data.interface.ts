import { SchoolAddressData } from "./school-address-data.interface";

export interface SchoolStudentData {
ID: number;
CreatedAt: Date;
UpdatedAt: Date;
DeletedAt: Date;
vorname: string;
nachname: string;
date_of_birth: string;
class_id: number;
address: SchoolAddressData;
className?: string;
}
