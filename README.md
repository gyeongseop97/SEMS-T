# SEMS-T

Sustainability & ESG Management System - Area-based Test Prototype

SEMS-T는 기존 온실가스 배출량 관리 프로그램을 확장하여, 지속가능경영보고서 작성과 ESG 공급망 실사 대응에 필요한 데이터를 한 곳에서 관리하기 위한 테스트 서버입니다.

## Current direction

기존 SEMS가 온실가스, 에너지 중심이었다면 SEMS-T는 아래 데이터를 통합 관리하는 구조를 목표로 합니다.

- 온실가스: Scope 1, Scope 2, Scope 3별 활동자료, 배출계수, 계수 출처, 산정값, 증빙
- 환경 일반: 용수, 폐수, 폐기물, 대기오염물질
- 인사·교육: 임직원 수, 성별 구성, 고용형태, 채용, 퇴사, 교육시간
- 안전보건: 산업재해 발생 건수, 근로손실일수, 위험성평가, 개선조치
- 공급망·윤리: 협력사 ESG 평가, 공급망 실사, 윤리교육, 고충·제보 접수 건수
- 보고서 데이터맵: 입력 데이터를 지속가능경영보고서 항목, GRI, CDP, 공급망 실사 문항에 연결
- 증빙자료 관리: 입력값별 증빙 파일명, URL, 비고, 제출상태 관리

## User experience principle

현업 담당자가 가장 쉽게 사용할 수 있도록 다음 원칙으로 설계합니다.

1. 공통 입력창 하나에 모든 데이터를 넣지 않습니다.
2. 환경, 온실가스, 인사, 안전보건, 공급망 등 분야별 입력 공간을 분리합니다.
3. 각 분야의 특성에 맞는 전용 입력 항목을 제공합니다.
4. 온실가스는 Scope 1, Scope 2, Scope 3별로 입력 구조를 나눕니다.
5. 온실가스 입력 시 활동자료, 단위, 배출계수, 배출계수 출처, 증빙을 함께 남깁니다.
6. 용수, 폐기물, 대기오염물질, 임직원 현황, 교육시간, 산업재해 등은 각 항목별 특성에 맞는 필드를 사용합니다.
7. 대시보드에서는 분야별 입력률과 미입력 항목을 확인합니다.
8. 지속가능경영보고서 작성 시 사용할 수 있도록 데이터맵을 함께 관리합니다.

## Files

- `index.html`: 분야별 ESG 데이터 입력 UI
- `assets/esg_area_input_app.js`: 분야별 입력 로직, 온실가스 Scope 1/2/3 산정 입력 구조
- `database/sems_supabase_schema.sql`: 기존 SEMS Supabase table and policy setup SQL
- `database/sems_monthly_completion_simple.sql`: 기존 월별 제출 완료 관리 SQL
- `docs/SEMS_supabase_deployment_guide.md`: 기존 SEMS deployment guide
- `docs/user_friendly_esg_hub_blueprint.md`: ESG 데이터 허브 설계 문서

## Prototype status

현재 화면은 빠른 테스트를 위한 정적 프로토타입입니다.

- 입력 데이터는 브라우저 localStorage에 저장됩니다.
- JSON 내보내기/불러오기를 지원합니다.
- 실제 Supabase 연동, 사용자 인증, 파일 저장소 연동은 다음 단계에서 적용해야 합니다.

## Next build step

운영형 서비스로 전환하려면 다음 순서로 개발합니다.

1. ESG 분야 및 입력그룹 마스터 테이블 생성
2. 온실가스 전용 산정자료 테이블 생성
3. 일반 ESG 데이터 입력 테이블 생성
4. 증빙자료 테이블 및 파일 저장소 연결
5. 회사/사업장/부서/담당자 권한 구조 적용
6. 검토상태: 작성중, 제출완료, 검토완료, 반려 적용
7. 보고서 데이터맵 및 Excel/PDF 출력 기능 추가
