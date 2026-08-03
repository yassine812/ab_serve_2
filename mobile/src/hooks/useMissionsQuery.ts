import { useQuery } from '@tanstack/react-query';

import { fetchMissionMeta, fetchMissions, MissionFilters } from '../api/missions';
import { useAuthSession } from './useAuthSession';

export function useMissionsQuery(filters: MissionFilters) {
  const { session } = useAuthSession();

  return useQuery({
    queryKey: ['missions', filters],
    queryFn: () => fetchMissions(session!.access, filters),
    enabled: Boolean(session?.access),
    staleTime: 60000,
  });
}

export function useMissionMetaQuery(filters: MissionFilters) {
  const { session } = useAuthSession();

  return useQuery({
    queryKey: ['missions-meta', filters],
    queryFn: () => fetchMissionMeta(session!.access, filters),
    enabled: Boolean(session?.access),
    staleTime: 300000,
  });
}
