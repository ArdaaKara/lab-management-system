import axiosInstance from './axiosInstance';
import { CreateIssueRequest, IssueFilter, IssueResponse, RejectIssueRequest } from '../types/issue.types';
import { ApiResponse } from '@/types/api.types';

export async function createIssue(computerId: string, req: CreateIssueRequest): Promise<IssueResponse> {
  const res = await axiosInstance.post<ApiResponse<IssueResponse>>(
    `/computers/${computerId}/issues`,
    req
  );
  return res.data.data;
}

export async function getIssuesByLab(labId: string, filter?: IssueFilter): Promise<IssueResponse[]> {
  const res = await axiosInstance.get<ApiResponse<IssueResponse[]>>('/issues', {
    params: filter,
  });
  return res.data.data;
}

export async function getPendingApprovals(labId: string): Promise<IssueResponse[]> {
  const res = await axiosInstance.get<ApiResponse<IssueResponse[]>>('/issues', {
    params: { status: 'SUBMITTED' },
  });
  return res.data.data;
}

export async function assignTechnician(issueId: string, techId: string): Promise<void> {
  await axiosInstance.post(`/issues/${issueId}/assign`, null, { params: { technicianId: techId } });
}

export async function resolve(issueId: string): Promise<void> {
  await axiosInstance.post(`/issues/${issueId}/resolve`);
}

export async function approve(issueId: string): Promise<void> {
  await axiosInstance.post(`/issues/${issueId}/resolve`);
}

export async function reject(issueId: string, req: RejectIssueRequest): Promise<void> {
  await axiosInstance.post(`/issues/${issueId}/reject`, req);
}

export async function claimIssue(issueId: string): Promise<void> {
  await axiosInstance.post(`/issues/${issueId}/claim`);
}

export async function resolveIssue(issueId: string, resolution: string): Promise<void> {
  await axiosInstance.post(`/issues/${issueId}/resolve`, { resolution });
}

export async function approveIssue(issueId: string): Promise<void> {
  await axiosInstance.post(`/issues/${issueId}/resolve`);
}

export async function rejectIssue(issueId: string, reason: string): Promise<void> {
  await axiosInstance.post(`/issues/${issueId}/reject`, { rejectionReason: reason });
}
