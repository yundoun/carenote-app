import { Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { WorkStats } from '../../types/my.types';

interface EducationProgressProps {
  workStats: WorkStats;
  onContinueEducation?: () => void;
}

export function EducationProgress({
  workStats,
  onContinueEducation,
}: EducationProgressProps) {
  const educationCompletionRate =
    (workStats.completedEducation / workStats.totalEducation) * 100;

  return (
    <>
      <h2 className="text-xl font-semibold mb-3">교육 이수 현황</h2>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <Award className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">필수 교육 이수율</span>
          </div>

          <div className="flex items-center mb-2">
            <Progress
              value={educationCompletionRate}
              className="h-2 flex-1 mr-2"
            />
            <span className="text-sm font-medium">
              {Math.round(educationCompletionRate)}%
            </span>
          </div>

          <p className="text-sm text-gray-500">
            {workStats.completedEducation}/{workStats.totalEducation} 완료
          </p>

          {educationCompletionRate < 100 && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onContinueEducation}>
                <TrendingUp className="h-4 w-4 mr-2" />
                교육 계속하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
