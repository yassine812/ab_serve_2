import { api } from './client';
import { Mission, MissionMeta, PaginatedResponse } from '../types/mission';

export type MissionFilters = {
  mine?: string;
  search?: string;
  reference?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
};

export async function fetchMissions(accessToken: string, filters: MissionFilters) {
  const { data } = await api.get<PaginatedResponse<Mission>>('/api/v1/missions/', {
    params: filters,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

export async function fetchMissionMeta(accessToken: string, filters: MissionFilters) {
  const { data } = await api.get<MissionMeta>('/api/v1/missions/meta/', {
    params: filters,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}
