export interface UserResponse {
  ID: number;
  CreatedAt: Date | null;
  DeletedAt: Date | null;
  UpdatedAt: Date | null;
  email: string;
  is_admin: boolean;
  vorname: string;
  nachname: string;
  password: string;
  school_id: number;
  username: string;
}
