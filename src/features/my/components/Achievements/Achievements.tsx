import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '../../types/my.types';

interface AchievementsProps {
  achievements: Achievement[];
  showAll: boolean;
  onToggleShowAll: () => void;
}

export function Achievements({
  achievements,
  showAll,
  onToggleShowAll,
}: AchievementsProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">최근 성취</h2>
        <Button variant="ghost" size="sm" onClick={onToggleShowAll}>
          {showAll ? '접기' : '전체보기'}
        </Button>
      </div>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="space-y-3">
            {achievements
              .slice(0, showAll ? achievements.length : 2)
              .map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-500">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {achievement.earnedDate}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    달성
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
