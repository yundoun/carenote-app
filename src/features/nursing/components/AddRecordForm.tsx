import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RecordType } from '../../types/nursing.types';

interface AddRecordFormProps {
  onSave: () => void;
}

export function AddRecordForm({ onSave }: AddRecordFormProps) {
  const [recordType, setRecordType] = useState<RecordType | ''>('');
  const [formData, setFormData] = useState<any>({});

  const handleValueChange = (value: string) => {
    setRecordType(value as RecordType | '');
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
            <SelectItem value="medication">복약 기록</SelectItem>
            <SelectItem value="position">체위 변경</SelectItem>
            <SelectItem value="appointment">일정</SelectItem>
            <SelectItem value="note">간호 기록</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {recordType && (
        <>
          <div>
            <Label htmlFor="senior">어르신 선택</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="어르신을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">홍길동 (301호)</SelectItem>
                <SelectItem value="2">김영희 (302호)</SelectItem>
                <SelectItem value="3">이철수 (303호)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">내용</Label>
            <Textarea placeholder="기록 내용을 입력하세요" />
          </div>

          <Button onClick={onSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            저장하기
          </Button>
        </>
      )}
    </div>
  );
}
