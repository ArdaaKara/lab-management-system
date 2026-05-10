import axiosInstance from '../../../api/axiosInstance';
import { IssueResponse } from '../../../types/issue.types';
import { ApiResponse } from '../../../types/common';

export const getIssuesByLab = async (labId: string): Promise<IssueResponse[]> => {
  const response = await axiosInstance.get<ApiResponse<IssueResponse[]>>(`/labs/${labId}/issues`);
  return response.data.data;
};

export const getPendingApprovals = async (labId: string): Promise<IssueResponse[]> => {
  const response = await axiosInstance.get<ApiResponse<IssueResponse[]>>(`/labs/${labId}/issues/pending-approvals`);
  return response.data.data;
};

export const assignTechnician = async (issueId: string, technicianId: string): Promise<void> => {
  await axiosInstance.post(`/issues/${issueId}/assign/${technicianId}`);
};
