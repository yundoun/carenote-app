# 케어노트 (CareNote) - 요양보호사 업무 관리 앱

> AI 바이브코딩으로 5일 만에 구축한 풀스택 요양보호사 업무 관리 애플리케이션

![image](https://github.com/user-attachments/assets/7add2ba3-899c-48a1-99ad-c72e510b97dc)


## 🎯 프로젝트 개요

케어노트는 요양보호사의 업무 효율성을 높이기 위한 종합 관리 애플리케이션입니다. 이 프로젝트는 **AI 바이브코딩**이라는 새로운 개발 방법론을 통해 5일 만에 17개 테이블을 가진 완전한 CRUD 시스템을 구축했습니다.

### 배포 주소
https://carenote-app.vercel.app/

### 자세한 내용
https://ehdnsdlek.tistory.com/63

### 📊 프로젝트 성과
- **개발 기간**: 5일 (약 25시간)
- **데이터베이스**: 17개 테이블 기반 CRUD 시스템
- **AI 도구 활용**: Claude Code, V0.dev, Cursor, Supabase MCP
- **생산성 향상**: 기존 개발 방식 대비 3-4배 향상

## 🛠 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 정적 타입 체크
- **Vite** - 빌드 도구 및 개발 서버
- **Redux Toolkit** - 상태 관리
- **React Router** - 클라이언트 사이드 라우팅
- **Tailwind CSS** - 스타일링
- **Radix UI** - 접근성을 고려한 UI 컴포넌트
- **Lucide React** - 아이콘

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - 관계형 데이터베이스
- **Row Level Security (RLS)** - 데이터 보안
- **Real-time subscriptions** - 실시간 데이터 동기화

### AI Development Tools
- **Claude Code** - CLI 환경 개발, 패키지 관리, 백엔드 개발
- **V0.dev** - UI 디자인 및 초기 컴포넌트 생성
- **Cursor** - 실시간 코딩, 백엔드 개발
- **Supabase MCP** - 자연어 데이터베이스 조작

## 🎨 주요 기능

### 👥 사용자 관리
- 요양보호사 회원가입 및 로그인
- 프로필 관리 및 설정
- 권한별 접근 제어

### 📅 업무 관리
- **근무표 관리** - 일정 등록, 수정, 조회
- **서비스 관리** - 제공 서비스 기록 및 관리
- **환자 관리** - 담당 환자 정보 및 케어 히스토리
- **업무 일지** - 일일 업무 기록 및 특이사항 관리

### 📊 데이터 관리
- **실시간 데이터 동기화** - Supabase Realtime 활용
- **17개 테이블 CRUD** - 완전한 데이터 관리 시스템
- **관계형 데이터 구조** - 정규화된 데이터베이스 설계
- **데이터 무결성** - 외래키 제약조건 및 RLS 정책

### 📱 사용자 경험
- **반응형 디자인** - 모바일 우선 설계
- **직관적인 UI/UX** - 간단하고 명확한 인터페이스
- **접근성 고려** - Radix UI 기반 접근성 준수

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # UI 기본 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── features/       # 기능별 컴포넌트
├── pages/              # 페이지 컴포넌트
├── store/              # Redux 스토어 설정
│   ├── slices/         # RTK 슬라이스
│   └── api/            # RTK Query API
├── hooks/              # 커스텀 React 훅
├── lib/                # 유틸리티 함수
│   ├── supabase.ts     # Supabase 클라이언트
│   └── utils.ts        # 공통 유틸리티
├── types/              # TypeScript 타입 정의
├── styles/             # 스타일 파일
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx            # 앱 엔트리 포인트
```

## 🤖 AI 바이브코딩 방법론

이 프로젝트는 새로운 개발 방법론인 **AI 바이브코딩**을 통해 구축되었습니다.

### AI 도구별 역할 분담

| 도구 | 역할 | 활용도 |
|------|------|--------|
| **V0.dev** | UI 디자인 및 초기 컴포넌트 생성 | ⭐⭐⭐⭐⭐ |
| **Claude.ai** | 아키텍처 설계, 문서 작성, 코드 변환 | ⭐⭐⭐⭐⭐ |
| **Claude Code** | CLI 환경 개발, 전체 코드베이스 분석 | ⭐⭐⭐⭐⭐ |
| **Cursor** | 실시간 코딩, Supabase MCP 연동 | ⭐⭐⭐⭐ |

### 개발 워크플로우

1. **요구사항 분석** - 비즈니스 로직 정의
2. **구현 가이드 생성** - AI를 위한 개발 표준 문서 작성
3. **UI 구현** - V0.dev로 컴포넌트 생성 후 Vite로 변환
4. **상태 관리 구조 설계** - Redux Toolkit 기반 아키텍처
5. **데이터베이스 설계** - Supabase MCP로 자연어 스키마 생성
6. **API 연결** - RTK Query를 통한 API 통합
7. **테스트 및 기능 점검** - 통합 테스트 및 사용성 검증


## 📈 데이터베이스 설계

### 주요 테이블 (17개)
- **users** - 사용자 정보
- **caregivers** - 요양보호사 정보
- **patients** - 환자 정보
- **schedules** - 근무 일정
- **services** - 제공 서비스
- **work_logs** - 업무 일지
- **notifications** - 알림
- 기타 관계 테이블 및 설정 테이블

### 특징
- **완전한 관계형 설계** - 외래키 제약조건
- **Row Level Security** - 사용자별 데이터 접근 제어
- **실시간 동기화** - Supabase Realtime 구독
- **타입 안전성** - TypeScript 타입 자동 생성

### 핵심 성과

케어노트 앱 개발을 통해 확인된 바이브 코딩의 핵심 성과는 다음과 같습니다:

1. **역할 기반 AI 전략** - PM과 개발자 관계로 소통
2. **개발 생산성 3-4배 향상** 달성
3. **구조화된 접근법**을 통한 코드 품질 일관성 확보
4. **UI-First 개발 방법론**으로 사용자 경험 중심 개발 실현
5. **MCP 활용**으로 백엔드 개발 진입 장벽 대폭 해소
