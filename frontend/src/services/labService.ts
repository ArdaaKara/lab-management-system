import axiosInstance from './axiosInstance';
import { LabResponse, CreateLabRequest, UpdateLabRequest, AssignUserRequest } from '../types/lab.types';
import { ApiResponse } from '@/types/api.types';

export async function getAllLabs(): Promise<LabResponse[]> {
  const res = await axiosInstance.get<ApiResponse<LabResponse[]>>('/labs');
  return res.data.data;
}

export async function getLabById(id: string): Promise<LabResponse> {
  const res = await axiosInstance.get<ApiResponse<LabResponse>>(`/labs/${id}`);
  return res.data.data;
}

export async function createLab(data: CreateLabRequest): Promise<LabResponse> {
  const res = await axiosInstance.post<ApiResponse<LabResponse>>('/labs', data);
  return res.data.data;
}

export async function updateLab(labId: string, data: UpdateLabRequest): Promise<LabResponse> {
  const res = await axiosInstance.put<ApiResponse<LabResponse>>(`/labs/${labId}`, data);
  return res.data.data;
}

export async function assignUser(labId: string, req: AssignUserRequest): Promise<void> {
  await axiosInstance.post(`/labs/${labId}/assign`, req);
}

export async function removeUser(labId: string, userId: string): Promise<void> {
  await axiosInstance.delete(`/labs/${labId}/users/${userId}`);
}
