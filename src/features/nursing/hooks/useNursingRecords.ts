import { useState, useEffect } from 'react';
import {
  MedicationRecord,
  PositionChangeRecord,
  AppointmentRecord,
  NursingNote,
} from '../types/nursing.types';

export function useNursingRecords() {
  const [medicationRecords, setMedicationRecords] = useState<
    MedicationRecord[]
  >([]);
  const [positionChangeRecords, setPositionChangeRecords] = useState<
    PositionChangeRecord[]
  >([]);
  const [appointmentRecords, setAppointmentRecords] = useState<
    AppointmentRecord[]
  >([]);
  const [nursingNotes, setNursingNotes] = useState<NursingNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data 로딩
    const loadMockData = () => {
      setMedicationRecords([
        {
          id: '1',
          seniorId: '1',
          seniorName: '홍길동',
          medication: '혈압약 (암로디핀)',
          dosage: '5mg',
          time: '08:00',
          administered: true,
          administeredBy: '김간호',
          date: new Date(),
        },
        {
          id: '2',
          seniorId: '2',
          seniorName: '김영희',
          medication: '당뇨약 (메트포르민)',
          dosage: '500mg',
          time: '08:00',
          administered: false,
          date: new Date(),
        },
      ]);

      setPositionChangeRecords([
        {
          id: '1',
          seniorId: '1',
          seniorName: '홍길동',
          fromPosition: '앙와위',
          toPosition: '좌측위',
          time: '10:00',
          performedBy: '김간호',
          date: new Date(),
        },
        {
          id: '2',
          seniorId: '3',
          seniorName: '이철수',
          fromPosition: '좌측위',
          toPosition: '앙와위',
          time: '12:00',
          performedBy: '김간호',
          notes: '환자가 불편함 호소하여 체위 변경',
          date: new Date(),
        },
      ]);

      setAppointmentRecords([
        {
          id: '1',
          seniorId: '2',
          seniorName: '김영희',
          type: 'hospital',
          description: '정형외과 진료',
          scheduledTime: '14:00',
          status: 'scheduled',
          date: new Date(),
        },
        {
          id: '2',
          seniorId: '1',
          seniorName: '홍길동',
          type: 'visit',
          description: '가족 면회',
          scheduledTime: '15:30',
          status: 'completed',
          notes: '아들 방문, 30분간 면회',
          date: new Date(),
        },
      ]);

      setNursingNotes([
        {
          id: '1',
          seniorId: '1',
          seniorName: '홍길동',
          category: 'health',
          content: '혈압 수치 안정적. 식욕 양호하며 수면 패턴 개선됨.',
          recordedBy: '김간호',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: '2',
          seniorId: '3',
          seniorName: '이철수',
          category: 'behavior',
          content:
            '오늘 물리치료에 적극적으로 참여. 손떨림 증상 약간 감소한 것으로 관찰됨.',
          recordedBy: '김간호',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ]);

      setIsLoading(false);
    };

    // 실제 구현에서는 API 호출로 대체
    setTimeout(loadMockData, 1000);
  }, []);

  return {
    medicationRecords,
    positionChangeRecords,
    appointmentRecords,
    nursingNotes,
    isLoading,
  };
}
