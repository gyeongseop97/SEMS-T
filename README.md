# SEMS-T

Sustainability & ESG Management System - SR Data Collection Hub Prototype

SEMS-T는 `세원정공_SR_정량데이터_수집툴.xlsx`의 21개 수집 시트 구조를 기준으로, 지속가능경영보고서 작성과 ESG 공급망 실사 대응에 필요한 정량 데이터를 수집·검토·승인·보고서 매핑하기 위한 테스트 서버입니다.

## Current direction

1. 온실가스는 SEMS 전체 화면을 이식하지 않습니다.
2. 온실가스 메뉴에는 SEMS의 `온실가스 내역 입력` 방식만 반영합니다.
3. 온실가스 입력은 연도, 월, 회사, 사업장, 등록부서, Scope, 배출원, 세부구분, 상세내용, 사용량, 단위, 배출량, 비고가 한 줄 입력 테이블로 구성됩니다.
4. 배출계수는 기존 SEMS의 `sems_emission_factors` 구조를 우선 사용합니다.
5. SR 정량데이터는 업로드된 엑셀 파일의 21개 시트 구조를 그대로 주제화합니다.
6. 각 주제는 담당부서, ESG 영역, 원본 시트명, 데이터 포인트, 단위, 증빙 예시를 갖습니다.
7. 데이터는 주제별로 작성중, 제출, 승인, 반려 상태를 관리합니다.

## Source workbook topic structure

| No | Topic | Owner | ESG |
|---|---|---|---|
| 01 | 기후변화 대응 | 총무/공기 | E |
| 02 | 원부자재 관리 | 자재 | E |
| 03 | 폐기물 관리 | 총무/공기 | E |
| 04 | 수자원 관리 | 총무 | E |
| 05 | 대기오염물질 관리 | 해당없음 | E |
| 06 | 이해관계자 참여 | 재경 | S |
| 07 | 인적자원 관리 | 총무 | S |
| 08 | 신규채용 및 이직 | 총무 | S |
| 09 | 임직원 역량 개발 | 총무 | S |
| 10 | 성과평가와 임금 | 총무 | S |
| 11 | 임직원 복리후생제도 | 총무 | S |
| 12 | 조직문화 활성화 | 총무 | S |
| 13 | 안전보건 | 총무 | S |
| 14 | 협력사 관리 | 구매 | S |
| 15 | 인권 | 총무 | S |
| 16 | 고객가치 제고 | 품질 | S |
| 17 | 사회공헌 | 총무/재경 | S |
| 18 | 지배구조 | 재경 | G |
| 19 | 기업윤리·컴플라이언스 | 총무 | G |
| 20 | 정보보호 | 시스템개발 | G |
| 21 | 가입단체 및 인증 성과 | 공통 | G |

## UX structure

- Dashboard: 전체 진행률, 미작성 항목, 승인 현황, 온실가스 총 배출량
- GHG Inventory: SEMS식 온실가스 내역 입력 테이블
- Data Collection: SR 수집툴 21개 주제별 정량데이터 입력
- Metric Library: 원본 시트 기반 지표 라이브러리
- Evidence: 제출값과 연결된 증빙자료 관리
- Reports: E/S/G 및 지속가능경영보고서 항목 매핑
- Settings: 운영형 DB 구조 안내

## Files

- `index.html`: SEMS-T 통합 허브 화면
- `assets/esg_sheet_app.js`: SR 수집툴 기반 21개 주제, SEMS식 온실가스 내역 입력, 데이터 수집/증빙/보고서 매핑 로직
- `assets/esg_area_input_app.js`: 이전 분야별 카드형 프로토타입, 현재는 사용하지 않음
- `database/sems_supabase_schema.sql`: 기존 SEMS Supabase table and policy setup SQL
- `database/sems_monthly_completion_simple.sql`: 기존 월별 제출 완료 관리 SQL
- `docs/SEMS_supabase_deployment_guide.md`: 기존 SEMS deployment guide
- `docs/user_friendly_esg_hub_blueprint.md`: ESG 데이터 허브 설계 문서

## Prototype status

현재 화면은 빠른 테스트를 위한 정적 프로토타입입니다.

- 온실가스는 SEMS-T 자체 `GHG Inventory` 메뉴에서 입력합니다.
- 온실가스 입력 방식은 기존 SEMS의 활동자료 내역 입력 구조를 따릅니다.
- 배출계수는 Supabase의 `sems_emission_factors` 테이블을 우선 조회하고, 조회가 어려운 경우 기본 예비 배출계수를 사용합니다.
- SR 정량데이터는 브라우저 localStorage에 저장됩니다.
- JSON 내보내기/불러오기를 지원합니다.
- 실제 운영형 사용자 인증, 파일 저장소, 검토권한은 다음 단계에서 적용해야 합니다.

## Next build step

1. 기존 SEMS의 `sems_entries`, `sems_emission_factors` 구조를 GHG Inventory 모듈에 정식 연결합니다.
2. `sr_collection_topics` 테이블을 만들어 21개 수집 주제를 관리합니다.
3. `sr_collection_metrics` 테이블을 만들어 주제별 데이터 포인트, 단위, 증빙 예시를 관리합니다.
4. `sr_metric_values` 테이블을 만들어 연도/월/회사/사업장별 제출값을 관리합니다.
5. `sr_evidence_files` 테이블을 만들어 증빙자료를 연결합니다.
6. 검토상태: 작성중, 제출, 승인, 반려를 적용합니다.
7. 보고서 데이터맵 및 Excel/PDF 출력 기능을 추가합니다.
