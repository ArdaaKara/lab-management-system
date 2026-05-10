export interface LabResponse {
  id: string;
  name: string;
  capacity: number;
  maxRows: number;
  maxCols: number;
  createdAt: string;
}

export interface CreateLabRequest {
  name: string;
  capacity: number;
  maxRows: number;
  maxCols: number;
}

export interface AssignUserRequest {
  userId: string;
  role: import('./auth.types').Role;
}
