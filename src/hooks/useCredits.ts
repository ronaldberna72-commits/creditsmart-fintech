import { useCallback, useEffect, useState } from 'react';
import { creditsService } from '../services/creditsService';
import { CreditProduct } from '../types/credit';

export function useCredits() {
  const [credits, setCredits] = useState<CreditProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await creditsService.getCreditProducts();
      setCredits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al cargar créditos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return { credits, loading, error, refetch: fetchCredits };
}
