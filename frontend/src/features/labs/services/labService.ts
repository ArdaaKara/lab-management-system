import axiosInstance from '../../../api/axiosInstance';
import { LabResponse } from '../../../types/lab.types';
import { ApiResponse } from '../../../types/common';

export const getAllLabs = async (): Promise<LabResponse[]> => {
  const response = await axiosInstance.get<ApiResponse<LabResponse[]>>('/labs');
  return response.data.data;
};

export const getAssignedLabs = async (): Promise<LabResponse[]> => {
  const response = await axiosInstance.get<ApiResponse<LabResponse[]>>('/labs/assigned');
  return response.data.data;
};
