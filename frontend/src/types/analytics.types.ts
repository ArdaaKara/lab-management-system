export interface TopFaultyComputer {
  computerId: string
  hostname: string
  assetTag: string
  issueCount: number
}

export interface LabSummaryResponse {
  totalComputers: number
  activeCount: number
  faultyCount: number
  underRepairCount: number
  avgResolutionMinutes: number
  topFaultyComputers: TopFaultyComputer[]
}
