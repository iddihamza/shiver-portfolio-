import { useQuery } from '@tanstack/react-query';

export interface CaseFile {
  id: string;
  title: string;
  classification?: string;
  status?: string;
  date?: string;
  description?: string;
  evidence?: string[];
  outcome?: string;
  created_at: string;
  updated_at: string;
}

// Mock cases data since the table doesn't exist yet
const mockCases: CaseFile[] = [];

export const useCases = () => {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      // Return empty array since cases table doesn't exist
      return mockCases;
    },
  });
};

export const useCase = (caseId: string) => {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: async () => {
      // Return null since cases table doesn't exist
      return null;
    },
  });
};