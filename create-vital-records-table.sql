-- vital_records 테이블 생성 SQL
-- Supabase SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS public.vital_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  measured_at TIMESTAMPTZ NOT NULL,
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  heart_rate INTEGER,
  temperature DECIMAL(4,2),
  respiratory_rate INTEGER,
  blood_oxygen INTEGER,
  blood_sugar INTEGER,
  weight DECIMAL(5,2),
  notes TEXT,
  measured_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.vital_records ENABLE ROW LEVEL SECURITY;

-- 인덱스 생성 (성능 향상을 위해)
CREATE INDEX IF NOT EXISTS idx_vital_records_resident_id ON public.vital_records(resident_id);
CREATE INDEX IF NOT EXISTS idx_vital_records_measured_at ON public.vital_records(measured_at);
CREATE INDEX IF NOT EXISTS idx_vital_records_created_at ON public.vital_records(created_at);

-- RLS 정책 생성 (모든 사용자가 읽기/쓰기 가능)
CREATE POLICY "Enable read access for all users" ON public.vital_records
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.vital_records
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.vital_records
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.vital_records
  FOR DELETE USING (true);

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_vital_records_updated_at 
  BEFORE UPDATE ON public.vital_records 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 완료 메시지
SELECT 'vital_records 테이블이 성공적으로 생성되었습니다!' as result;