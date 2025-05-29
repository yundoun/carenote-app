import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Greeting } from '../types/announcements.types';

interface GreetingsSectionProps {
  greetings: Greeting[];
}

export function GreetingsSection({ greetings }: GreetingsSectionProps) {
  const getGreetingIcon = (type: string) => {
    switch (type) {
      case 'welcome':
        return '👋';
      case 'appreciation':
        return '🎉';
      case 'motivation':
        return '💪';
      default:
        return '😊';
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Users className="h-5 w-5" />
          오늘의 인사말
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {greetings.slice(0, 2).map((greeting) => (
            <div key={greeting.id} className="bg-white p-3 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {getGreetingIcon(greeting.type)}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{greeting.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      - {greeting.author}
                    </span>
                    <span className="text-xs text-gray-400">
                      {greeting.publishedAt.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
