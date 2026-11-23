import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { creditsService } from '../services/creditsService';
import {
  ApplicationStatus,
  CreateLoanApplicationDTO,
  LoanApplication,
} from '../types/credit';

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await creditsService.getApplications(user.uid, user.role);
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar solicitudes.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const submitApplication = async (dto: CreateLoanApplicationDTO) => {
    const created = await creditsService.createApplication(dto);
    setApplications((prev) => [created, ...prev]);
    return created;
  };

  const changeStatus = async (
    applicationId: string,
    status: ApplicationStatus,
    reviewerNotes?: string
  ) => {
    await creditsService.updateApplicationStatus(applicationId, status, reviewerNotes);
    setApplications((prev) =>
      prev.map((item) =>
        item.id === applicationId
          ? {
              ...item,
              status,
              reviewerNotes: reviewerNotes ?? item.reviewerNotes,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const removeApplication = async (applicationId: string) => {
    await creditsService.deleteApplication(applicationId);
    setApplications((prev) => prev.filter((item) => item.id !== applicationId));
  };

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    submitApplication,
    changeStatus,
    removeApplication,
  };
}
