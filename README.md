# SEMS-T

Sustainability & ESG Management System - Test Prototype

SEMS-T는 기존 온실가스 배출량 관리 프로그램을 확장하여, 지속가능경영보고서 작성과 ESG 공급망 실사 대응에 필요한 데이터를 한 곳에서 관리하기 위한 테스트 서버입니다.

## Current direction

기존 SEMS가 온실가스, 에너지 중심이었다면 SEMS-T는 아래 데이터를 통합 관리하는 구조를 목표로 합니다.

- 환경 데이터: 온실가스, 에너지, 용수, 폐수, 폐기물, 대기오염물질
- 인적자원 데이터: 임직원 수, 성별 구성, 고용형태, 채용, 퇴사, 교육시간
- 안전보건 데이터: 산업재해 발생 건수, 근로손실일수 등
- 공급망 데이터: 협력사 ESG 평가, 공급망 실사 완료 현황
- 윤리·준법 데이터: 윤리교육, 고충·제보 접수 건수
- 보고서 데이터맵: 입력 데이터를 지속가능경영보고서 항목, GRI, CDP, 공급망 실사 문항에 연결
- 증빙자료 관리: 입력값별 증빙 파일명, URL, 비고, 제출상태 관리

## User experience principle

현업 담당자가 가장 쉽게 사용할 수 있도록 다음 원칙으로 설계합니다.

1. 기준서 중심이 아니라 `오늘 할 일` 중심으로 보여줍니다.
2. 입력 화면은 `지표 선택 → 값 입력 → 증빙 첨부 → 저장` 순서로 단순화합니다.
3. 단위, 담당부서, 보고서 항목, 외부 기준 매핑은 시스템이 자동으로 표시합니다.
4. 대시보드에서 입력률, 증빙 첨부율, 미입력 항목을 바로 확인합니다.
5. 지속가능경영보고서 작성 시 사용할 수 있도록 데이터맵을 함께 관리합니다.

## Files

- `index.html`: 사용자 친화형 ESG 데이터 통합관리 프로토타입 화면
- `database/sems_supabase_schema.sql`: 기존 SEMS Supabase table and policy setup SQL
- `database/sems_monthly_completion_simple.sql`: 기존 월별 제출 완료 관리 SQL
- `docs/SEMS_supabase_deployment_guide.md`: 기존 SEMS deployment guide

## Prototype status

현재 `index.html`은 빠른 테스트를 위한 정적 프로토타입입니다.

- 입력 데이터는 브라우저 localStorage에 저장됩니다.
- JSON 내보내기/불러오기를 지원합니다.
- 실제 Supabase 연동, 사용자 인증, 파일 저장소 연동은 다음 단계에서 적용해야 합니다.

## Next build step

운영형 서비스로 전환하려면 다음 순서로 개발합니다.

1. ESG 지표 마스터 테이블 생성
2. ESG 데이터 입력 테이블 생성
3. 증빙자료 테이블 및 파일 저장소 연결
4. 회사/사업장/부서/담당자 권한 구조 적용
5. 보고서 데이터맵 및 Excel/PDF 출력 기능 추가
