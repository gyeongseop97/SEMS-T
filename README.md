# SEMS-T

Sustainability & ESG Management System - ESG Data Collection Hub Prototype

SEMS-T는 지속가능경영보고서 작성과 ESG 공급망 실사 대응에 필요한 데이터를 상용 ESG 관리 시스템 방식으로 수집·검토·승인·보고서 매핑하기 위한 테스트 서버입니다.

## Current direction

중요한 방향은 다음과 같습니다.

1. 온실가스는 기존 SEMS와 같은 활동자료 입력 및 배출계수 산정 흐름을 사용합니다.
2. 기존 SEMS 화면을 iframe으로 이식하지 않습니다.
3. SEMS-T 자체 Carbon Accounting 화면에서 Scope, 배출원, 세부구분, 사용량, 단위, 배출계수, 산정 배출량을 관리합니다.
4. 배출계수는 기존 SEMS의 `sems_emission_factors` 구조를 우선 사용합니다.
5. 비온실가스 ESG 데이터는 입력대장 중심이 아니라 상용 ESG 플랫폼처럼 데이터 요청, 담당자 제출, 검토·승인, 증빙 추적 방식으로 관리합니다.
6. 지속가능경영보고서 작성 시에는 입력 데이터를 GRI, CDP, EcoVadis, 공급망 실사 문항에 매핑합니다.

## UX reference direction

상용 ESG/KPI 관리 시스템에서 공통적으로 보이는 구조를 반영합니다.

- Dashboard: 전체 진행률, 상태별 건수, 우선 처리 요청, 분야별 진행률
- Data Collection: 담당자별 데이터 요청 목록, 지표 상세 입력, 증빙 첨부, 제출 상태
- Carbon Accounting: 활동자료, 배출원, 배출계수, 산정 배출량
- Metric Library: 지표명, 단위, 담당부서, 주기, 기준, 증빙 예시
- Evidence Center: 제출 데이터와 증빙자료 연결
- Reports: 보고서 항목별 데이터 매핑

## Managed data

- 온실가스: Scope 1, Scope 2, Scope 3 활동자료 및 배출계수 기반 산정
- 환경 일반: 용수, 폐수, 폐기물, 대기오염물질
- 인사·교육: 임직원 수, 성별 구성, 고용형태, 채용, 퇴사, 교육시간
- 안전보건: 산업재해 발생 건수, 근로손실일수, 개선조치
- 공급망·윤리: 협력사 ESG 평가, 공급망 실사, 윤리교육, 고충·제보 접수 건수
- 보고서 데이터맵: 입력 데이터를 지속가능경영보고서 항목, GRI, CDP, 공급망 실사 문항에 연결

## Files

- `index.html`: SEMS-T 통합 허브 화면
- `assets/esg_sheet_app.js`: 상용 ESG 데이터 수집 UX, Carbon Accounting 입력 로직, Metric Library, Evidence Center, Reports 화면
- `assets/esg_area_input_app.js`: 이전 분야별 카드형 프로토타입, 현재는 사용하지 않음
- `database/sems_supabase_schema.sql`: 기존 SEMS Supabase table and policy setup SQL
- `database/sems_monthly_completion_simple.sql`: 기존 월별 제출 완료 관리 SQL
- `docs/SEMS_supabase_deployment_guide.md`: 기존 SEMS deployment guide
- `docs/user_friendly_esg_hub_blueprint.md`: ESG 데이터 허브 설계 문서

## Prototype status

현재 화면은 빠른 테스트를 위한 정적 프로토타입입니다.

- 온실가스는 SEMS-T 자체 `Carbon Accounting` 메뉴에서 입력합니다.
- 온실가스 입력 방식은 기존 SEMS의 활동자료·배출원·배출계수 구조를 따릅니다.
- 배출계수는 Supabase의 `sems_emission_factors` 테이블을 우선 조회하고, 조회가 어려운 경우 기본 예비 배출계수를 사용합니다.
- 비온실가스 ESG 데이터는 브라우저 localStorage에 저장됩니다.
- JSON 내보내기/불러오기를 지원합니다.
- 실제 운영형 사용자 인증, 파일 저장소, 검토권한은 다음 단계에서 적용해야 합니다.

## Next build step

운영형 서비스로 전환하려면 다음 순서로 개발합니다.

1. 기존 SEMS의 `sems_entries`, `sems_emission_factors` 구조를 Carbon Accounting 모듈에 정식 연결합니다.
2. ESG 데이터 요청용 `esg_data_requests` 테이블을 만듭니다.
3. ESG 제출값 저장용 `esg_metric_values` 테이블을 만듭니다.
4. 증빙자료 테이블 및 파일 저장소를 연결합니다.
5. 회사/사업장/부서/담당자 권한 구조를 적용합니다.
6. 검토상태: 요청, 작성중, 제출, 승인, 반려를 적용합니다.
7. 보고서 데이터맵 및 Excel/PDF 출력 기능을 추가합니다.
