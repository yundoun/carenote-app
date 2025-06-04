import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gmadjpdpvggfeqpiawdr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtYWRqcGRwdmdnZmVxcGlhd2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTk2NTcsImV4cCI6MjA2NDA3NTY1N30.aPkLUx3CfuLbLn7bQygwjIQLvpmCAEr3wwBYheEdXYY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  try {
    console.log('🔍 Supabase 연결 테스트 중...');

    // 1. 연결 테스트
    const { data: healthCheck, error: healthError } = await supabase
      .from('residents')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ 연결 실패:', healthError.message);
      return;
    }

    console.log('✅ Supabase 연결 성공!');

    // 2. residents 테이블 조회
    console.log('\n📊 residents 테이블 조회 중...');
    const { data: residents, error: residentsError, count } = await supabase
      .from('residents')
      .select('id, name, age, gender, room_number, care_level, main_diagnosis, status', { count: 'exact' })
      .limit(10);

    if (residentsError) {
      console.error('❌ residents 테이블 조회 실패:', residentsError.message);
    } else {
      console.log(`✅ 총 거주자 수: ${count}명`);
      console.log('📋 조회된 거주자 목록:');
      residents.forEach((resident, index) => {
        console.log(`  ${index + 1}. ${resident.name} (${resident.age}세, ${resident.room_number}호, ${resident.status})`);
      });
    }

    // 3. ACTIVE 상태만 조회
    console.log('\n🟢 ACTIVE 상태 거주자만 조회...');
    const { data: activeResidents, error: activeError } = await supabase
      .from('residents')
      .select('id, name, age, room_number, status')
      .eq('status', 'ACTIVE')
      .limit(5);

    if (activeError) {
      console.error('❌ ACTIVE 거주자 조회 실패:', activeError.message);
    } else {
      console.log(`✅ ACTIVE 거주자 수: ${activeResidents.length}명`);
      activeResidents.forEach((resident, index) => {
        console.log(`  ${index + 1}. ${resident.name} (${resident.room_number}호)`);
      });
    }

  } catch (err) {
    console.error('❌ 예외 발생:', err.message);
  }
}

testDatabase(); 