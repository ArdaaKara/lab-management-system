import { IssueCategory } from './issue.types'

export type ReportPeriod = 'THIS_WEEK' | 'THIS_MONTH' | 'LAST_30_DAYS' | 'THIS_SEMESTER' | 'CUSTOM'

export interface ReportRangeRequest {
  period: ReportPeriod
  dateFrom?: string
  dateTo?: string
  labId?: string
}

export interface DashboardSummary {
  totalIssues: number
  openIssues: number
  inProgressIssues: number
  resolvedAwaitingApproval: number
  closedIssues: number
  avgResolutionHours: number | null
  totalComputers: number
  faultyComputers: number
  issuesByDay: Array<{ date: string; count: number }>
  issuesByCategory: Array<{ category: IssueCategory; count: number }>
  issuesBySeverity: Array<{ severity: string; count: number }>
  topFaultyComputers: Array<{
    computerId: string
    hostname: string
    faultCount: number
  }>
}
