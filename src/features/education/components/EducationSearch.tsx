import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EducationSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function EducationSearch({
  searchQuery,
  onSearchChange,
}: EducationSearchProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="교육자료 검색 (예: 낙상, 치매, 혈압)"
        className="pl-10 h-12 text-lg"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
