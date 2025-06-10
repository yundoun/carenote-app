import { Card, CardContent } from '@/components/ui/card';
import { EducationCategory } from '../../types/education.types';

interface EducationCategoriesProps {
  categories: EducationCategory[];
  selectedCategoryId?: string | null;
  onCategoryClick: (category: EducationCategory) => void;
}

export function EducationCategories({
  categories,
  selectedCategoryId,
  onCategoryClick,
}: EducationCategoriesProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">카테고리</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-md' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onCategoryClick(category)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    isSelected 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-primary/10'
                  }`}>
                    {category.icon}
                  </div>
                  <div>
                    <span className={`font-medium ${
                      isSelected ? 'text-primary' : ''
                    }`}>
                      {category.label}
                    </span>
                    <p className="text-sm text-gray-500">
                      {category.count}개 자료
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
