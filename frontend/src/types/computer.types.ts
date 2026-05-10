export type ComputerStatus = 'ACTIVE' | 'FAULTY' | 'UNDER_REPAIR' | 'DECOMMISSIONED';

export interface HardwareSpecs {
  cpu: string;
  ramGb: number;
  diskGb: number;
  os: string;
}

export interface ComputerGridResponse {
  id: string;
  name: string;
  labId: string;
  gridRow: number;
  gridCol: number;
  status: ComputerStatus;
  hardwareSpecs: HardwareSpecs;
  activeIssueCount: number;
}

export interface UpdateComputerRequest {
  gridRow?: number;
  gridCol?: number;
  status?: ComputerStatus;
  hardwareSpecs?: Partial<HardwareSpecs>;
}
