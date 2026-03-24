import { useEffect, useState } from 'react';
import { fetchApplications } from '../services/applications';
import type { Application } from '../types';

export function useApplications(userId?: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!userId) {
      setApplications([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    setLoading(true);
    fetchApplications(userId)
      .then((nextApplications) => {
        if (!cancelled) {
          setApplications(nextApplications);
          setError(null);
        }
      })
      .catch((reason) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : '申请记录加载失败。');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshTick, userId]);

  return {
    applications,
    loading,
    error,
    refresh() {
      setRefreshTick((value) => value + 1);
    },
  };
}
