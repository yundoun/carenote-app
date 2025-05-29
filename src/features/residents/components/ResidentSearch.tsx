import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ResidentSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ResidentSearch({
  searchQuery,
  onSearchChange,
}: ResidentSearchProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="어르신 이름 또는 병실 번호 검색"
        className="pl-10 h-12 text-lg"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
