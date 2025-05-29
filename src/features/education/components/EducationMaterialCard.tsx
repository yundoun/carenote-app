import { Play, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EducationMaterial } from '../../types/education.types';

interface EducationMaterialCardProps {
  material: EducationMaterial;
  showProgress?: boolean;
  onClick?: (material: EducationMaterial) => void;
}

export function EducationMaterialCard({
  material,
  showProgress = false,
  onClick,
}: EducationMaterialCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return '기본';
    }
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick?.(material)}>
      <div className="flex">
        <div className="relative w-1/3">
          <img
            src={material.thumbnail || '/placeholder.svg'}
            alt={material.title}
            className="h-full w-full object-cover"
          />
          {material.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="h-10 w-10 text-white" fill="white" />
            </div>
          )}
        </div>
        <CardContent className="p-4 w-2/3">
          <div className="flex justify-between items-start mb-2">
            <Badge className="mb-2">{material.category}</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{material.rating}</span>
            </div>
          </div>
          <h3 className="font-bold mb-1 text-sm">{material.title}</h3>
          <p className="text-xs text-gray-600 mb-2">{material.description}</p>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{material.duration}</span>
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${getDifficultyColor(material.difficulty)}`}>
              {getDifficultyLabel(material.difficulty)}
            </Badge>
          </div>

          {showProgress && material.progress !== undefined && (
            <div className="flex items-center gap-2">
              <Progress value={material.progress} className="h-2 flex-1" />
              <span className="text-xs font-medium">{material.progress}%</span>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
