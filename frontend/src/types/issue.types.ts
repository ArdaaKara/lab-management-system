export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'RESOLVED' | 'REJECTED';
export type IssueCategory = 'HARDWARE' | 'SOFTWARE' | 'NETWORK' | 'OTHER';

export interface IssueResponse {
  id: string;
  computerId: string;
  computerName: string;
  category: IssueCategory;
  status: IssueStatus;
  description?: string;
  reporterStudentNo: string;
  reporterIp: string;
  assignedTechnicianId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface CreateIssueRequest {
  category: IssueCategory;
  studentNo: string;
  description?: string;
}

export interface RejectIssueRequest {
  reason: string;
}

export interface IssueHistoryResponse {
  id: string;
  issueId: string;
  changedBy: string;
  fromStatus: IssueStatus;
  toStatus: IssueStatus;
  note?: string;
  changedAt: string;
}
