import { CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EducationMaterialCard } from '../EducationMaterialCard/EducationMaterialCard';
import { EducationMaterial } from '../../types/education.types';

interface EducationTabsProps {
  recommendedMaterials: EducationMaterial[];
  recentMaterials: EducationMaterial[];
  onMaterialClick: (material: EducationMaterial) => void;
}

export function EducationTabs({
  recommendedMaterials,
  recentMaterials,
  onMaterialClick,
}: EducationTabsProps) {
  return (
    <Tabs defaultValue="recommended" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="recommended">추천 교육자료</TabsTrigger>
        <TabsTrigger value="recent">최근 학습</TabsTrigger>
        <TabsTrigger value="required">필수 교육</TabsTrigger>
      </TabsList>

      <TabsContent value="recommended" className="mt-0 space-y-4">
        {recommendedMaterials.map((material) => (
          <EducationMaterialCard
            key={material.id}
            material={material}
            onClick={onMaterialClick}
          />
        ))}
      </TabsContent>

      <TabsContent value="recent" className="mt-0 space-y-4">
        {recentMaterials.map((material) => (
          <EducationMaterialCard
            key={material.id}
            material={material}
            showProgress={true}
            onClick={onMaterialClick}
          />
        ))}
      </TabsContent>

      <TabsContent value="required" className="mt-0">
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">필수 교육 완료!</h3>
          <p className="text-gray-500">
            이번 달 필수 교육을 모두 완료하셨습니다.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            다음 필수 교육은 다음 달에 안내됩니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
