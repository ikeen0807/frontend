import { SchoolAddressData } from "./school-address-data.interface";

export interface SchoolUsersData {
ID: number;
CreatedAt: Date;
UpdatedAt: Date;
DeletedAt: Date;
email: string;
username: string;
vorname: string;
nachname: string;
password: string;
is_admin: boolean;
school_id: number;
address: SchoolAddressData;
}
