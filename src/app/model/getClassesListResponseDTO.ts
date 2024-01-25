import { ClassListData } from "../interfaces/class-list-data.interface";

export interface GetClassListResponseDTO
{
  classes: Array<ClassListData> | any[];
}
