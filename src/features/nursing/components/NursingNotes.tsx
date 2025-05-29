import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NursingNote } from '../types/nursing.types';

interface NursingNotesProps {
  notes: NursingNote[];
}

export function NursingNotes({ notes }: NursingNotesProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health':
        return 'bg-green-100 text-green-800';
      case 'medication':
        return 'bg-blue-100 text-blue-800';
      case 'behavior':
        return 'bg-purple-100 text-purple-800';
      case 'family':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'health':
        return '건강';
      case 'medication':
        return '투약';
      case 'behavior':
        return '행동';
      case 'family':
        return '가족';
      default:
        return '일반';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          간호 기록
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{note.seniorName}</span>
                  <Badge
                    variant="outline"
                    className={getCategoryColor(note.category)}>
                    {getCategoryLabel(note.category)}
                  </Badge>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{note.recordedBy}</p>
                  <p>
                    {note.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{note.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
