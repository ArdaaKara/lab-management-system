import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IssueResponse, IssueStatus } from '../../../types/issue.types';
import { getIssuesByLab, getPendingApprovals } from '../services/issueService';

interface IssueState {
  issues: IssueResponse[];
  pendingApprovals: IssueResponse[];
  isLoading: boolean;
  fetchIssues: (labId: string) => Promise<void>;
  fetchPendingApprovals: (labId: string) => Promise<void>;
  updateIssueStatus: (issueId: string, status: IssueStatus) => void;
}

export const useIssueStore = create<IssueState>()(
  devtools(
    (set) => ({
      issues: [],
      pendingApprovals: [],
      isLoading: false,

      fetchIssues: async (labId: string) => {
        set((state) => ({ ...state, isLoading: true }), false, 'issues/fetchIssues/pending');
        try {
          const issues = await getIssuesByLab(labId);
          set((state) => ({ ...state, issues, isLoading: false }), false, 'issues/fetchIssues/fulfilled');
        } catch (error) {
          set((state) => ({ ...state, isLoading: false }), false, 'issues/fetchIssues/rejected');
          throw error;
        }
      },

      fetchPendingApprovals: async (labId: string) => {
        try {
          const pendingApprovals = await getPendingApprovals(labId);
          set((state) => ({ ...state, pendingApprovals }), false, 'issues/fetchPendingApprovals');
        } catch (error) {
          throw error;
        }
      },

      updateIssueStatus: (issueId: string, status: IssueStatus) => {
        set(
          (state) => ({
            ...state,
            issues: state.issues.map((i) => (i.id === issueId ? { ...i, status } : i)),
            pendingApprovals: state.pendingApprovals.map((i) =>
              i.id === issueId ? { ...i, status } : i
            ),
          }),
          false,
          'issues/updateIssueStatus'
        );
      },
    }),
    { name: 'issues' }
  )
);

export default useIssueStore;

