import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HandoverNote } from '../../types/schedule.types';

interface HandoverNotesProps {
  notes: HandoverNote[];
}

export const HandoverNotes = ({ notes }: HandoverNotesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          인수인계 사항
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg border ${
                note.priority === 'urgent'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm">{note.from}</span>
                <div className="flex items-center gap-2">
                  {note.priority === 'urgent' && (
                    <Badge variant="destructive" className="text-xs">
                      긴급
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {note.timestamp}
                  </span>
                </div>
              </div>
              <p className="text-sm">{note.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
