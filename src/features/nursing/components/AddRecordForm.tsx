import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { ResidentDetail as Resident } from '@/features/residents/types/residents.types';
import type {
  MedicationRecord as MedicationRecordType,
  PositionChangeRecord as PositionChangeRecordType,
  NursingNote as NursingNoteType,
} from '@/store/slices/nursingSlice';

type RecordType = 'medication' | 'position' | 'note';

interface AddRecordFormProps {
  onSave: () => void;
  addNursingNote: (
    record: Omit<
      NursingNoteType,
      | 'id'
      | 'recordedAt'
      | 'residentName'
      | 'recordedBy'
      | 'tags'
      | 'attachments'
    > & { residentId: string }
  ) => Promise<any>;
  addMedicationRecord: (
    record: Omit<
      MedicationRecordType,
      'id' | 'recordedAt' | 'residentName' | 'recordedBy'
    > & { residentId: string }
  ) => Promise<any>;
  addPositionChangeRecord: (
    record: Omit<
      PositionChangeRecordType,
      'id' | 'recordedAt' | 'residentName' | 'recordedBy'
    > & { residentId: string }
  ) => Promise<any>;
  isLoading: boolean;
  residents: Resident[];
}

export function AddRecordForm({
  onSave,
  addNursingNote,
  addMedicationRecord,
  addPositionChangeRecord,
  isLoading,
  residents,
}: AddRecordFormProps) {
  const [recordType, setRecordType] = useState<RecordType | ''>('');
  const [residentId, setResidentId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<
    | 'DAILY_OBSERVATION'
    | 'INCIDENT'
    | 'BEHAVIOR'
    | 'MEDICAL'
    | 'FAMILY_COMMUNICATION'
  >('DAILY_OBSERVATION');
  const [priority, setPriority] = useState<
    'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  >('MEDIUM');
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [fromPosition, setFromPosition] = useState('');
  const [toPosition, setToPosition] = useState('');
  const [skinCondition, setSkinCondition] = useState<
    'NORMAL' | 'REDNESS' | 'WOUND' | 'PRESSURE_SORE'
  >('NORMAL');
  const [medicationStatus, setMedicationStatus] = useState<
    'SCHEDULED' | 'COMPLETED' | 'MISSED' | 'REFUSED' | 'PARTIAL'
  >('SCHEDULED');

  const handleValueChange = (value: string) => {
    setRecordType(value as RecordType | '');
    setResidentId('');
    setTitle('');
    setContent('');
    setMedicationName('');
    setDosage('');
    setScheduledTime('');
    setFromPosition('');
    setToPosition('');
    setMedicationStatus('SCHEDULED');
  };

  const handleSubmit = async () => {
    if (!residentId) {
      toast.error('어르신을 선택해주세요.');
      return;
    }

    try {
      switch (recordType) {
        case 'note':
          if (!title || !content) {
            toast.error('제목과 내용을 입력해주세요.');
            return;
          }
          await addNursingNote({
            residentId,
            noteType,
            title,
            content,
            priority,
          });
          toast.success('간호 기록이 저장되었습니다.');
          break;

        case 'medication':
          if (!medicationName) {
            toast.error('약물명을 입력해주세요.');
            return;
          }
          await addMedicationRecord({
            residentId,
            medicationName,
            dosage: dosage || '',
            scheduledTime:
              scheduledTime || new Date().toTimeString().slice(0, 5),
            status: medicationStatus,
            notes: content,
          });
          toast.success('투약 기록이 저장되었습니다.');
          break;

        case 'position':
          if (!toPosition) {
            toast.error('변경 후 체위를 선택해주세요.');
            return;
          }
          await addPositionChangeRecord({
            residentId,
            changeTime: new Date().toISOString(),
            fromPosition: (fromPosition as any) || 'SUPINE',
            toPosition: (toPosition as any) || 'SUPINE',
            skinCondition,
            notes: content,
          });
          toast.success('체위변경 기록이 저장되었습니다.');
          break;
      }
      onSave();
    } catch (error) {
      console.error('기록 저장 오류:', error);
      toast.error('기록 저장에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="recordType">기록 유형</Label>
        <Select value={recordType} onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="기록 유형을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">간호 기록</SelectItem>
            <SelectItem value="medication">복약 기록</SelectItem>
            <SelectItem value="position">체위 변경</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {recordType && (
        <>
          <div>
            <Label htmlFor="resident">어르신 선택</Label>
            <Select value={residentId} onValueChange={setResidentId}>
              <SelectTrigger>
                <SelectValue placeholder="어르신을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {residents.map((resident) => (
                  <SelectItem key={resident.id} value={resident.id}>
                    {resident.name} ({resident.room || '미정'}호)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {recordType === 'note' && (
            <>
              <div>
                <Label htmlFor="noteType">기록 유형</Label>
                <Select
                  value={noteType}
                  onValueChange={(value) => setNoteType(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY_OBSERVATION">일상 관찰</SelectItem>
                    <SelectItem value="INCIDENT">사건/사고</SelectItem>
                    <SelectItem value="BEHAVIOR">행동 변화</SelectItem>
                    <SelectItem value="MEDICAL">의료 관련</SelectItem>
                    <SelectItem value="FAMILY_COMMUNICATION">
                      가족 소통
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">우선순위</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">낮음</SelectItem>
                    <SelectItem value="MEDIUM">보통</SelectItem>
                    <SelectItem value="HIGH">높음</SelectItem>
                    <SelectItem value="URGENT">긴급</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="기록 제목을 입력하세요"
                />
              </div>
            </>
          )}

          {recordType === 'medication' && (
            <>
              <div>
                <Label htmlFor="medicationName">약물명</Label>
                <Input
                  id="medicationName"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="약물명을 입력하세요"
                />
              </div>

              <div>
                <Label htmlFor="dosage">용량</Label>
                <Input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="예: 1정, 5ml"
                />
              </div>

              <div>
                <Label htmlFor="scheduledTime">예정 시간</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="medicationStatus">투약 상태</Label>
                <Select
                  value={medicationStatus}
                  onValueChange={(value) => setMedicationStatus(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHEDULED">예정</SelectItem>
                    <SelectItem value="COMPLETED">완료</SelectItem>
                    <SelectItem value="MISSED">누락</SelectItem>
                    <SelectItem value="REFUSED">거부</SelectItem>
                    <SelectItem value="PARTIAL">부분</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {recordType === 'position' && (
            <>
              <div>
                <Label htmlFor="fromPosition">변경 전 체위</Label>
                <Select
                  value={fromPosition}
                  onValueChange={(value) => setFromPosition(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPINE">앙와위</SelectItem>
                    <SelectItem value="LEFT_LATERAL">좌측위</SelectItem>
                    <SelectItem value="RIGHT_LATERAL">우측위</SelectItem>
                    <SelectItem value="PRONE">복와위</SelectItem>
                    <SelectItem value="SITTING">좌위</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="toPosition">변경 후 체위</Label>
                <Select
                  value={toPosition}
                  onValueChange={(value) => setToPosition(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPINE">앙와위</SelectItem>
                    <SelectItem value="LEFT_LATERAL">좌측위</SelectItem>
                    <SelectItem value="RIGHT_LATERAL">우측위</SelectItem>
                    <SelectItem value="PRONE">복와위</SelectItem>
                    <SelectItem value="SITTING">좌위</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="skinCondition">피부 상태</Label>
                <Select
                  value={skinCondition}
                  onValueChange={(value) => setSkinCondition(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">정상</SelectItem>
                    <SelectItem value="REDNESS">발적</SelectItem>
                    <SelectItem value="WOUND">상처</SelectItem>
                    <SelectItem value="PRESSURE_SORE">욕창</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="content">
              {recordType === 'note' ? '내용' : '비고'}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                recordType === 'note'
                  ? '간호 기록 내용을 입력하세요'
                  : '추가 사항이 있으면 입력하세요'
              }
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? '저장 중...' : '저장하기'}
          </Button>
        </>
      )}
    </div>
  );
}
