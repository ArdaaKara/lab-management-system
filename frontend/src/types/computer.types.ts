export type ComputerStatus =
  | 'ACTIVE'
  | 'FAULTY'
  | 'UNDER_REPAIR'
  | 'DECOMMISSIONED';

export interface HardwareSpecs {
  cpu: string | null;
  ram_gb: number;
  disk_gb: number;
  os: string | null;
}

export interface ComputerResponse {
  id: string;
  assetTag: string;
  hostname: string | null;
  macAddress: string;
  ipAddress: string | null;
  gridRow: number | null;
  gridCol: number | null;
  status: ComputerStatus;
  hardwareSpecs: HardwareSpecs | null;
  isActive: boolean;
  labId: string;
  createdAt: string;
}

export interface ComputerGridResponse {
  id: string;
  assetTag: string;
  labId: string;
  gridRow: number;
  gridCol: number;
  status: ComputerStatus;
  hardwareSpecs: HardwareSpecs | null;
  activeIssueCount?: number;
}

export interface UpdateComputerRequest {
  gridRow?: number;
  gridCol?: number;
  status?: ComputerStatus;
  hardwareSpecs?: Partial<HardwareSpecs>;
}

export interface CreateComputerRequest {
  labId: string;
  assetTag: string;
  macAddress: string;
  hostname?: string;
  ipAddress?: string;
  gridRow?: number;
  gridCol?: number;
  hardwareSpecs?: Partial<HardwareSpecs>;
}
