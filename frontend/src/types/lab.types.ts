export interface LabResponse {
  id: string;
  name: string;
  roomNumber: string;
  maxRows: number;
  maxCols: number;
  assignedUserIds: string[];
  createdAt: string;
}

export interface CreateLabRequest {
  name: string;
  roomNumber: string;
  maxRows: number;
  maxCols: number;
}

export interface UpdateLabRequest {
  name?: string;
  roomNumber?: string;
  maxRows?: number;
  maxCols?: number;
}

export interface AssignUserRequest {
  userId: string;
}
