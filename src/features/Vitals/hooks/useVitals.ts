import { useState, useMemo } from 'react';
import type { Senior, VitalSigns, VitalStatus } from '../types/vitals.types';

export const useVitals = () => {
  // Mock data for seniors with vital signs
  const [seniors] = useState<Senior[]>([
    {
      id: '1',
      name: '홍길동',
      room: '301',
      age: 85,
      conditions: ['고혈압', '치매'],
      lastVitals: {
        bloodPressure: { systolic: 140, diastolic: 90 },
        heartRate: 78,
        temperature: 36.5,
        bloodSugar: 120,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
        recordedBy: '김간호',
        notes: '혈압 약간 높음, 모니터링 필요',
      },
      vitalHistory: [],
      alertThresholds: {
        bloodPressure: { min: 90, max: 140 },
        heartRate: { min: 60, max: 100 },
        temperature: { min: 36.0, max: 37.5 },
      },
    },
    {
      id: '2',
      name: '김영희',
      room: '302',
      age: 78,
      conditions: ['당뇨', '관절염'],
      lastVitals: {
        bloodPressure: { systolic: 125, diastolic: 80 },
        heartRate: 72,
        temperature: 36.3,
        bloodSugar: 95,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1시간 전
        recordedBy: '김간호',
      },
      vitalHistory: [],
      alertThresholds: {
        bloodPressure: { min: 90, max: 140 },
        heartRate: { min: 60, max: 100 },
        temperature: { min: 36.0, max: 37.5 },
      },
    },
    {
      id: '3',
      name: '이철수',
      room: '303',
      age: 82,
      conditions: ['파킨슨병'],
      lastVitals: {
        bloodPressure: { systolic: 160, diastolic: 95 },
        heartRate: 85,
        temperature: 37.2,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
        recordedBy: '김간호',
        notes: '혈압 높음, 체온 상승 - 의사 상담 필요',
      },
      vitalHistory: [],
      alertThresholds: {
        bloodPressure: { min: 90, max: 140 },
        heartRate: { min: 60, max: 100 },
        temperature: { min: 36.0, max: 37.5 },
      },
    },
  ]);

  const urgentCases = useMemo(() => {
    return seniors.filter((senior) => {
      if (!senior.lastVitals) return false;
      const { bloodPressure, heartRate, temperature } = senior.lastVitals;
      const { alertThresholds } = senior;

      return (
        bloodPressure.systolic > alertThresholds.bloodPressure.max ||
        bloodPressure.diastolic > alertThresholds.bloodPressure.max ||
        heartRate > alertThresholds.heartRate.max ||
        heartRate < alertThresholds.heartRate.min ||
        temperature > alertThresholds.temperature.max ||
        temperature < alertThresholds.temperature.min
      );
    });
  }, [seniors]);

  return {
    seniors,
    urgentCases,
  };
};
