# SEMS-T

Sustainability & ESG Management System - Reporting Sheet Test Prototype

SEMS-T는 기존 온실가스 배출량 관리 프로그램을 유지하면서, 지속가능경영보고서 작성과 ESG 공급망 실사 대응에 필요한 비온실가스 데이터를 추가로 관리하기 위한 테스트 서버입니다.

## Current direction

중요한 방향은 다음과 같습니다.

1. 온실가스는 새 양식으로 만들지 않고 기존 SEMS 입력방식과 배출계수 구조를 그대로 사용합니다.
2. 온실가스 외 데이터는 공통 입력창이 아니라 분야별 입력대장 방식으로 작성합니다.
3. 환경, 인사, 안전보건, 공급망·윤리 등 각 분야별로 작성 항목과 작성 방식이 다르게 구성됩니다.
4. 지속가능경영보고서 작성 시에는 분야별 입력대장을 보고서 항목별로 다시 매핑합니다.

## Managed data

- 온실가스: 기존 SEMS 화면 사용, 기존 배출계수 세트 연결
- 환경 일반: 용수, 폐수, 폐기물, 대기오염물질
- 인사·교육: 임직원 수, 성별 구성, 고용형태, 채용, 퇴사, 교육시간
- 안전보건: 산업재해 발생 건수, 근로손실일수, 위험성평가, 개선조치
- 공급망·윤리: 협력사 ESG 평가, 공급망 실사, 윤리교육, 고충·제보 접수 건수
- 보고서 데이터맵: 입력 데이터를 지속가능경영보고서 항목, GRI, CDP, 공급망 실사 문항에 연결

## User experience principle

현업 담당자가 가장 쉽게 사용할 수 있도록 다음 원칙으로 설계합니다.

1. 온실가스는 기존 SEMS 방식 그대로 사용합니다.
2. 배출계수도 기존 SEMS의 배출계수 구조를 사용합니다.
3. 비온실가스 ESG 데이터는 분야별 입력대장 형태로 작성합니다.
4. 각 분야는 탭으로 구분하고, 표 형태로 여러 행을 한 번에 입력합니다.
5. 담당자는 엑셀처럼 필요한 칸을 채운 뒤 `이 대장 저장`을 누릅니다.
6. 입력대장은 지속가능경영보고서 항목과 연결됩니다.

## Files

- `index.html`: SEMS-T 통합 허브 화면
- `ghg.html`: 기존 SEMS 온실가스 입력 화면을 불러오는 전용 페이지
- `assets/esg_sheet_app.js`: 환경/인사/안전보건/공급망 데이터를 입력대장 방식으로 작성하는 로직
- `assets/esg_area_input_app.js`: 이전 분야별 카드형 프로토타입, 현재는 사용하지 않음
- `database/sems_supabase_schema.sql`: 기존 SEMS Supabase table and policy setup SQL
- `database/sems_monthly_completion_simple.sql`: 기존 월별 제출 완료 관리 SQL
- `docs/SEMS_supabase_deployment_guide.md`: 기존 SEMS deployment guide
- `docs/user_friendly_esg_hub_blueprint.md`: ESG 데이터 허브 설계 문서

## Prototype status

현재 화면은 빠른 테스트를 위한 정적 프로토타입입니다.

- 온실가스는 `ghg.html`에서 기존 SEMS 화면을 불러옵니다.
- 환경/인사/안전보건/공급망 데이터는 브라우저 localStorage에 저장됩니다.
- JSON 내보내기/불러오기를 지원합니다.
- 실제 Supabase 연동, 사용자 인증, 파일 저장소 연동은 다음 단계에서 적용해야 합니다.

## Next build step

운영형 서비스로 전환하려면 다음 순서로 개발합니다.

1. 온실가스는 기존 SEMS 테이블과 배출계수 테이블을 유지합니다.
2. 비온실가스 데이터용 `esg_reporting_templates` 테이블을 만듭니다.
3. 분야별 입력대장 값 저장용 `esg_reporting_entries` 테이블을 만듭니다.
4. 증빙자료 테이블 및 파일 저장소를 연결합니다.
5. 회사/사업장/부서/담당자 권한 구조를 적용합니다.
6. 검토상태: 작성중, 제출완료, 검토완료, 반려를 적용합니다.
7. 보고서 데이터맵 및 Excel/PDF 출력 기능을 추가합니다.
