# Switchwon

과제 제출용 환전 웹 애플리케이션입니다.

---

## 1. 프로젝트 소개

이메일 로그인 후 지갑 잔액·환율을 조회하고, USD/JPY ↔ KRW 환전 및 내역 조회를 할 수 있는 SPA입니다.
프론트엔드 전반의 상태 흐름과 사용자 경험을 환전 도메인에 맞춰 구현 한 과제입니다.

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| 런타임/빌드 | React 19, TypeScript, Vite 7 |
| 라우팅 | React Router 7 |
| 상태/서버 데이터 | Zustand, TanStack Query (React Query) |
| HTTP | Axios |
| 스타일 | Tailwind CSS 4 |
| 기타 | Framer Motion, Lucide React, clsx |

- React + TypeScript: 컴포넌트 기반 구조와 타입 안정성을 확보하기 위해 사용했습니다.
- TanStack Query: 서버 상태(환율, 지갑, 내역)의 캐싱·동기화·무효화를 일관되게 관리하기 위해 선택했습니다.
- Zustand: 전역 상태(JWT, 사용자 세션)를 간단하게 관리하기 위해 사용했습니다.
- Tailwind CSS: 빠른 UI 구현과 일관된 스타일링을 위해 사용했습니다.

---

## 3. 실행 방법

**필수:** Node.js, pnpm

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (기본: http://localhost:5173)
pnpm dev

# 빌드
pnpm run build

# 빌드 결과물 미리보기
pnpm preview
```

API는 별도 백엔드 서버가 필요합니다.

`.env` 파일에 백엔드 서버 주소를 `VITE_API_URL`로 설정해주세요.
`vite.config.ts`에서는 이 환경 변수를 사용해 개발 서버 프록시를 구성합니다.

---

## 4. 페이지 구성

| 경로 | 페이지 | 접근 |
|------|--------|------|
| `/` | 로그인 | 비로그인만 (로그인 시 `/exchange`로 리다이렉트) |
| `/exchange` | 환전 (메인) | 로그인 필요 |
| `/history` | 환전 내역 | 로그인 필요 |

라우트 보호는 `PublicRoute`(로그인 시 리다이렉트), `ProtectedRoute`(미로그인 시 `/`로 리다이렉트)로 처리합니다.

---

## 5. 주요 기능

- **로그인**: 이메일 입력 → POST `/auth/login` → JWT를 localStorage에 저장, 이후 요청에 `Authorization: Bearer {token}` 포함
- **로그아웃**: 토큰 삭제 후 `/`로 이동
- **지갑/환율**: 메인(`/exchange`)에서 지갑 잔액(GET `/wallets`), 환율(GET `/exchange-rates/latest`) 표시. 환율은 1분마다 재조회
- **환전 견적**: 통화·금액 입력 시 GET `/orders/quote`로 원화 금액 조회 후 표시
- **환전 실행**: "환전하기" 클릭 시 POST `/orders` 호출. 성공 시 지갑·환전 내역 쿼리 무효화로 자동 최신화, 입력값 초기화
- **환전 내역**: GET `/orders`로 목록 조회 후 테이블로 표시

---

## 6. 에러 처리

- **Axios 인터셉터**: 4xx/5xx 응답 시 공통으로 토스트 표시
- **메시지 우선순위**: `response.data.data` 내 필드 메시지(예: `forexAmount`) → `ERROR_MESSAGE_MAP[code]` → `response.data.message` → 기본 문구
- **UNAUTHORIZED**: 토큰 삭제 후 로그인 페이지(`/`)로 리다이렉트
- **에러 메시지 매핑**: `src/lib/errorMessageMap.ts`에 API 코드별 사용자 문구 정의 (EXCHANGE_RATE_MISMATCH, WALLET_INSUFFICIENT_BALANCE 등)

- API 에러는 Axios 인터셉터에서 공통 처리하여 사용자에게 일관된 피드백을 제공합니다.
- 전역 Error Boundary는 과제 범위를 벗어난다고 판단해 적용하지 않았습니다.

---

## 7. 기타

- **패키지 매니저**: pnpm 사용
- **코드 품질**: ESLint (`pnpm run lint`)
