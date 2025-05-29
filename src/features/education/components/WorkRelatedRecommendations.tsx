import { Star, Play, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EducationMaterial } from '../../types/education.types';

interface WorkRelatedRecommendationsProps {
  materials: EducationMaterial[];
  onStartLearning: (material: EducationMaterial) => void;
}

export function WorkRelatedRecommendations({
  materials,
  onStartLearning,
}: WorkRelatedRecommendationsProps) {
  const workRelatedMaterials = materials.filter(
    (material) => material.relatedToWork
  );

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-blue-800">
            오늘 업무에 도움되는 교육
          </h2>
        </div>
        <div className="grid gap-3">
          {workRelatedMaterials.slice(0, 2).map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {material.type === 'video' ? (
                    <Play className="h-6 w-6 text-blue-600" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{material.title}</p>
                  <p className="text-xs text-gray-500">
                    {material.duration} • {material.category}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStartLearning(material)}>
                학습하기
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
