import { useState, useEffect } from 'react';
import {
  ResidentsService,
  type ResidentListItem,
  type ResidentDetailResponse,
} from '@/services/residents.service';
import type { ApiResponse, PagedResponse } from '@/services/api.types';

export interface UseResidentsReturn {
  residents: ResidentListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  fetchResidents: (params?: {
    caregiverId?: string;
    page?: number;
    size?: number;
  }) => Promise<void>;
}

export function useResidents(initialParams?: {
  caregiverId?: string;
  page?: number;
  size?: number;
}): UseResidentsReturn {
  const [residents, setResidents] = useState<ResidentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchResidents = async (params?: {
    caregiverId?: string;
    page?: number;
    size?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ResidentsService.getResidentList(params);

      setResidents(response.data.content);
      setTotal(response.data.page.totalElements);
      setPage(response.data.page.number);
      setTotalPages(response.data.page.totalPages);
    } catch (err: any) {
      console.error('Error fetching residents:', err);
      setError(err.message || '거주자 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents(initialParams);
  }, []);

  return {
    residents,
    loading,
    error,
    total,
    page,
    totalPages,
    fetchResidents,
  };
}

export interface UseResidentDetailReturn {
  resident: ResidentDetailResponse | null;
  loading: boolean;
  error: string | null;
  fetchResident: (residentId: string) => Promise<void>;
}

export function useResidentDetail(
  residentId?: string
): UseResidentDetailReturn {
  const [resident, setResident] = useState<ResidentDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResident = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ResidentsService.getResidentDetail(id);
      setResident(response.data);
    } catch (err: any) {
      console.error('Error fetching resident detail:', err);
      setError(err.message || '거주자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (residentId) {
      fetchResident(residentId);
    }
  }, [residentId]);

  return {
    resident,
    loading,
    error,
    fetchResident,
  };
}
