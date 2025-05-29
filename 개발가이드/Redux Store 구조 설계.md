
### **전체 Store 구조**

```
src/store/
├── index.ts                 # Store 설정 및 exports
├── rootReducer.ts          # 루트 리듀서 통합
├── middleware.ts           # 커스텀 미들웨어 (향후 API 연결용)
└── slices/
    ├── authSlice.ts        # 인증 상태 관리
    ├── userSlice.ts        # 사용자 정보 관리
    ├── scheduleSlice.ts    # 근무표 상태 관리
    ├── residentsSlice.ts   # 입주자 정보 관리
    ├── educationSlice.ts   # 교육 자료 관리
    ├── nursingSlice.ts     # 간호 기록 관리
    ├── vitalsSlice.ts      # 바이탈 모니터링 관리
    ├── announcementsSlice.ts # 공지사항 관리
    └── uiSlice.ts          # UI 상태 관리 (로딩, 모달 등)
```

### **RootState 타입 구조**

typescript

```typescript
interface RootState {
  auth: AuthState;           # 로그인, 토큰 관리
  user: UserState;           # 사용자 프로필, 권한
  schedule: ScheduleState;   # 근무표, 할일 목록
  residents: ResidentsState; # 담당 입주자 정보
  education: EducationState; # 교육 자료, 진도
  nursing: NursingState;     # 간호 기록, 투약 관리
  vitals: VitalsState;       # 바이탈 사인 모니터링
  announcements: AnnouncementsState; # 공지사항, 인사말
  ui: UIState;               # 전역 UI 상태
}
```

### **각 Slice별 주요 상태 구조**

#### 1. **AuthSlice**

typescript

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}
```

#### 2. **ScheduleSlice**

typescript

```typescript
interface ScheduleState {
  todayShift: TodayShift | null;
  weeklySchedule: CalendarDay[];
  todoList: TodoItem[];
  handoverNotes: HandoverNote[];
  isLoading: boolean;
}
```

#### 3. **ResidentsSlice**

typescript

```typescript
interface ResidentsState {
  residents: ResidentDetail[];
  urgentCases: ResidentDetail[];
  selectedResident: ResidentDetail | null;
  searchQuery: string;
  isLoading: boolean;
}
```

#### 4. **VitalsSlice**

typescript

```typescript
interface VitalsState {
  seniors: Senior[];
  urgentAlerts: Senior[];
  selectedSenior: Senior | null;
  isRecording: boolean;
  newVitals: Partial<VitalSigns>;
}
```

### **Mock 데이터 연동 구조**

```
src/store/mockData/
├── authMockData.ts
├── scheduleMockData.ts  
├── residentsMockData.ts
├── vitalsMockData.ts
├── educationMockData.ts
└── announcementsMockData.ts
```

## 🔄 **향후 API 연동 대비 구조**

### **API 슬라이스 준비 위치** (향후 구현)

```
src/store/api/
├── authApi.ts       # RTK Query - 인증 API
├── scheduleApi.ts   # RTK Query - 근무표 API  
├── residentsApi.ts  # RTK Query - 입주자 API
└── vitalsApi.ts     # RTK Query - 바이탈 API
```

## 📋 **구현 우선순위 제안**

### **1단계**: 핵심 Store 구조

- `store/index.ts` - 기본 설정
- `authSlice.ts` - 로그인 상태
- `scheduleSlice.ts` - 메인 기능인 근무표

### **2단계**: 주요 기능 Store

- `residentsSlice.ts` - 입주자 관리
- `vitalsSlice.ts` - 바이탈 모니터링

### **3단계**: 부가 기능 Store

- `educationSlice.ts`, `announcementsSlice.ts` 등