import axiosInstance from './axiosInstance';
import {
  ComputerGridResponse,
  ComputerResponse,
  CreateComputerRequest,
  UpdateComputerRequest,
} from '../types/computer.types';
import { ApiResponse } from '@/types/api.types';

export async function getComputersByLab(labId: string): Promise<ComputerGridResponse[]> {
  const res = await axiosInstance.get<ApiResponse<ComputerGridResponse[]>>(
    `/computers/lab/${labId}`
  );
  return res.data.data;
}

export async function getComputerListByLab(labId: string): Promise<ComputerResponse[]> {
  const res = await axiosInstance.get<ApiResponse<ComputerResponse[]>>(
    `/computers/lab/${labId}`
  );
  return res.data.data;
}

export async function updateComputer(
  id: string,
  req: UpdateComputerRequest
): Promise<ComputerResponse> {
  const res = await axiosInstance.put<ApiResponse<ComputerResponse>>(
    `/computers/${id}`,
    req
  );
  return res.data.data;
}

export async function createComputer(req: CreateComputerRequest): Promise<ComputerResponse> {
  const res = await axiosInstance.post<ApiResponse<ComputerResponse>>('/computers', req);
  return res.data.data;
}

export async function moveComputer(
  id: string,
  body: { gridRow: number | null; gridCol: number | null }
): Promise<ComputerResponse> {
  const res = await axiosInstance.put<ApiResponse<ComputerResponse>>(
    `/computers/${id}`,
    body
  );
  return res.data.data;
}

export async function decommission(id: string): Promise<void> {
  await axiosInstance.patch(`/computers/${id}/decommission`);
}
