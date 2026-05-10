import axiosInstance from '../../../api/axiosInstance';
import { ComputerGridResponse, UpdateComputerRequest } from '../../../types/computer.types';
import { ApiResponse } from '../../../types/common';

export const getComputersByLab = async (labId: string): Promise<ComputerGridResponse[]> => {
  const response = await axiosInstance.get<ApiResponse<ComputerGridResponse[]>>(`/labs/${labId}/computers`);
  return response.data.data;
};

export const updateComputer = async (id: string, req: UpdateComputerRequest): Promise<ComputerGridResponse> => {
  const response = await axiosInstance.patch<ApiResponse<ComputerGridResponse>>(`/computers/${id}`, req);
  return response.data.data;
};
