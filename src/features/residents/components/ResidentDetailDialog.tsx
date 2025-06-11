import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ResidentDetailView } from './ResidentDetailView';
import type { ResidentDetail } from '../types/residents.types';

interface ResidentDetailDialogProps {
  resident: ResidentDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResidentDetailDialog({ resident, open, onOpenChange }: ResidentDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {resident?.name} 어르신 상세정보
          </DialogTitle>
          <DialogDescription>
            환자의 기본정보, 바이탈 사인, 일정 및 최근 기록을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        {resident && <ResidentDetailView resident={resident} />}
      </DialogContent>
    </Dialog>
  );
}