# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 현재 상태

Next.js (App Router) + TypeScript + Tailwind 프로젝트 스캐폴딩 완료.
`src/app/page.tsx`에 프로필 영역·링크 카드 목록·다크모드 토글을 갖춘 메인 페이지 구현됨
(링크 데이터는 `src/data/profile.ts`의 정적 목데이터, MongoDB 연동 전 단계).
Git 저장소는 아직 초기화되지 않았습니다 (`git init` 필요).

## 프로젝트 개요

링크나무 — Linktree 형태의 Link in Bio 서비스. 내 모든 링크를 한 페이지에 모아
하나의 URL로 공유합니다. 타겟: SNS에 여러 링크를 공유하려는 개인 창작자·개발자·프리랜서.

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- MongoDB Atlas — 링크별 클릭 수 저장
- Vercel 배포

## 명령어

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

테스트 프레임워크는 아직 선택되지 않았습니다. 도입 시 이 섹션에 단일 테스트 실행법을 추가하세요.

## 아키텍처 (계획)

PRD 기준 구현해야 할 것:

- **프로필 영역**: 이름, 한 줄 소개, 프로필 사진
- **링크 카드 목록**: SNS·블로그 링크를 카드로 나열, 클릭 가능
- **다크모드 토글**: 라이트/다크 전환
- **클릭 수 집계**: 링크 클릭 시 MongoDB에 링크별 카운트 기록.
  App Router의 Route Handler(`src/app/api/`) 또는 Server Action에서 DB 쓰기를 처리하고,
  클라이언트는 실제 목적지로 리다이렉트되도록 설계.

## 코드 규칙

- 컴포넌트는 `src/components/` 아래에 작성
- 모바일 우선 반응형 디자인
- 환경 변수(MongoDB 연결 문자열 등)는 `.env.local`에 저장하고 절대 커밋하지 않음
