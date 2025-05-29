# CareNote App

순수 React + TypeScript + Vite로 구축된 간병 관리 애플리케이션입니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 정적 타입 체크
- **Vite** - 빌드 도구 및 개발 서버
- **React Router** - 클라이언트 사이드 라우팅
- **Tailwind CSS** - 스타일링
- **Radix UI** - 접근성을 고려한 UI 컴포넌트
- **Lucide React** - 아이콘

## 프로젝트 구조

```
src/
  ├── components/     # 재사용 가능한 컴포넌트
  │   ├── ui/        # UI 컴포넌트
  │   └── layout/    # 레이아웃 컴포넌트
  ├── pages/         # 페이지 컴포넌트
  ├── hooks/         # 커스텀 React 훅
  ├── lib/           # 유틸리티 함수
  ├── styles/        # 스타일 파일
  ├── App.tsx        # 메인 앱 컴포넌트
  └── main.tsx       # 앱 엔트리 포인트
```

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 http://localhost:5173에서 실행됩니다.

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 주요 기능

- 📅 **근무표 관리** - 간병사 근무 일정 확인
- 👥 **담당자 관리** - 담당 환자 정보 관리
- 📚 **교육자료** - 간병 관련 교육 자료 제공
- 👤 **마이페이지** - 개인 정보 및 설정 관리
