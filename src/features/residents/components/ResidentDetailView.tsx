import { Phone, Heart, Activity } from 'lucide-react';
import { ResidentDetail } from '../types/residents.types';

interface ResidentDetailViewProps {
  resident: ResidentDetail;
}

export function ResidentDetailView({ resident }: ResidentDetailViewProps) {
  return (
    <div className="space-y-4">
      {/* 기본 정보 */}
      <div>
        <h4 className="font-medium mb-2">기본 정보</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>병실: {resident.room}호</p>
          <p>요양등급: {resident.careLevel}</p>
          <p>나이: {resident.age}세</p>
          <p>성별: {resident.gender === 'male' ? '남성' : '여성'}</p>
        </div>
      </div>

      {/* 응급연락처 */}
      <div>
        <h4 className="font-medium mb-2">응급연락처</h4>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span className="text-sm">{resident.emergencyContact}</span>
        </div>
      </div>

      {/* 바이탈 사인 */}
      {resident.vitalSigns && (
        <div>
          <h4 className="font-medium mb-2">바이탈 사인</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-xs text-gray-500">혈압</p>
                <p className="text-sm font-medium">
                  {resident.vitalSigns.bloodPressure}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">맥박</p>
                <p className="text-sm font-medium">
                  {resident.vitalSigns.heartRate}bpm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-xs text-gray-500">체온</p>
                <p className="text-sm font-medium">
                  {resident.vitalSigns.temperature}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">마지막 측정</p>
              <p className="text-sm font-medium">
                {resident.vitalSigns.lastChecked}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 오늘 일정 */}
      <div>
        <h4 className="font-medium mb-2">오늘 일정</h4>
        <ul className="space-y-1">
          {resident.todaySchedule.map((schedule, index) => (
            <li key={index} className="text-sm bg-gray-50 p-2 rounded">
              • {schedule}
            </li>
          ))}
        </ul>
      </div>

      {/* 최근 기록 */}
      <div>
        <h4 className="font-medium mb-2">최근 기록</h4>
        <ul className="space-y-1">
          {resident.recentNotes.map((note, index) => (
            <li key={index} className="text-sm text-gray-600">
              • {note}
            </li>
          ))}
        </ul>
      </div>

      {/* 질환 및 주의사항 */}
      <div>
        <h4 className="font-medium mb-2">질환 및 주의사항</h4>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">주요 질환</p>
            <p className="text-sm">{resident.conditions.join(', ')}</p>
          </div>
          {resident.warnings && (
            <div>
              <p className="text-xs text-gray-500">주의사항</p>
              <p className="text-sm text-amber-700">
                {resident.warnings.join(', ')}
              </p>
            </div>
          )}
          {resident.medications && (
            <div>
              <p className="text-xs text-gray-500">복용약물</p>
              <p className="text-sm">{resident.medications.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
