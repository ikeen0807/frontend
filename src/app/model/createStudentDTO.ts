import { SchoolAddressData } from "../interfaces/school-address-data.interface";

export interface CreateStudentDTO {
  vorname: string;
  nachname: string;
  address: SchoolAddressData;
  date_of_birth: string;
  class_id: number;
}
