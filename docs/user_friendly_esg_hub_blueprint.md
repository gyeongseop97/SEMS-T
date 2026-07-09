# User-Friendly ESG Data Hub Blueprint

## 1. Product direction

SEMS-T should become a practical ESG data hub for sustainability reporting, supply-chain due diligence, CDP, EcoVadis, and internal management reporting.

The system should not use one generic input screen for all ESG data. ESG data differs by field. Therefore, the input space must be separated by business area, and each area must have its own field structure.

Core principle:

> Separate the input space by ESG area, then customize the input fields according to the calculation and evidence logic of each area.

## 2. Target users

| User | Main need | Recommended UX |
|---|---|---|
| Environmental user | Enter GHG, water, waste, air data | Area-specific forms and evidence guide |
| HR user | Enter workforce and training data | Aggregated headcount, hiring, turnover, training forms |
| Safety user | Enter accidents and risk improvements | Incident and corrective action forms |
| Purchasing/quality user | Enter supplier evaluation and due diligence data | Supplier assessment forms |
| Planning/ESG manager | Check progress and missing data | Dashboard, company/site filters, completion rate |
| Reviewer | Validate values and evidence | Review status, comments, revision request |
| Report writer | Use data in sustainability report | Report data map, export by disclosure item |
| Admin | Manage indicators and permissions | Indicator master, department owner, role control |

## 3. User-friendly workflow

### Step 1. User opens dashboard

The first screen should answer these questions.

- What area is incomplete?
- Which input groups are missing?
- Which items already have evidence?
- What is the overall report readiness?

### Step 2. User enters the relevant area

The user should not be forced into a single universal input form.

Recommended area split:

- Greenhouse Gas
- General Environment
- People and Training
- Occupational Health and Safety
- Supply Chain and Ethics
- Report Data Map

### Step 3. Each area uses its own input structure

Examples:

| Area | Required input logic |
|---|---|
| Greenhouse Gas | Scope, emission source, activity data, activity unit, emission factor, factor source, calculated emissions, evidence |
| Water/Wastewater | water source, withdrawal, discharge, reused water, evidence |
| Waste | waste type, hazardous/non-hazardous, treatment method, vendor, amount, evidence |
| Air pollutants | stack/facility, pollutant, concentration or amount, measurement date, test report |
| Workforce | base date, category, gender, employment type, headcount |
| Hiring/Turnover | type, gender, age group, count |
| Training | training name, target group, number of trainees, total training hours, evidence |
| Safety | incident date, accident type, count, lost work days, corrective action |
| Supply chain | supplier count, evaluated suppliers, high-risk suppliers, improvement request |

## 4. Greenhouse gas input structure

Greenhouse gas must be handled separately from general ESG data.

### Scope 1

| Group | Examples | Key fields |
|---|---|---|
| Stationary combustion | LNG, LPG, diesel, gasoline, kerosene | activity amount, unit, emission factor, factor source |
| Mobile combustion | company vehicles, forklifts | fuel amount, vehicle/fuel type, factor |
| Fugitive emissions | refrigerants such as R-134a, R-410A | recharge/leak amount, GWP factor |

### Scope 2

| Group | Examples | Key fields |
|---|---|---|
| Electricity - location-based | utility electricity | MWh, grid factor |
| Electricity - market-based | REC, PPA, green premium | MWh, contract/evidence, market-based factor |
| Steam/heat | purchased steam or heat | amount, unit, factor |

### Scope 3

| Category | Examples | Key fields |
|---|---|---|
| Cat.1 Purchased goods and services | steel, aluminum, parts, outsourced processing | purchase amount or quantity, factor source |
| Cat.2 Capital goods | equipment, molds, buildings | purchase amount, factor |
| Cat.3 Fuel and energy-related activities | upstream fuel and electricity emissions | energy amount, upstream factor |
| Cat.4 Upstream transport | inbound logistics | ton-km or logistics cost, transport mode |
| Cat.5 Waste generated in operations | waste treatment | waste type, treatment method, factor |
| Cat.6 Business travel | air, rail, car | distance or cost, travel mode |
| Cat.7 Employee commuting | car, bus, subway | people, distance, work days |
| Cat.9 Downstream transport | product delivery | ton-km, transport mode |

## 5. Recommended data structure

### 5.1 ESG input group master

| Field | Description |
|---|---|
| area | GHG, environment, people, safety, supply, governance |
| group_code | Input group code |
| group_name | User-facing group name |
| owner_department | Responsible department |
| input_cycle | Monthly, quarterly, yearly, on change |
| evidence_guide | Recommended evidence |
| report_item | Sustainability report section |
| external_standard | GRI, CDP, EcoVadis, supply-chain due diligence item |

### 5.2 GHG activity entries

| Field | Description |
|---|---|
| year | Reporting year |
| month | Reporting month |
| company | Company name |
| site | Site name |
| scope | Scope 1, Scope 2, Scope 3 |
| category | Emission source or Scope 3 category |
| activity_amount | Activity data amount |
| activity_unit | Unit of activity data |
| emission_factor | Emission factor |
| factor_unit | Unit of emission factor |
| factor_source | Source of emission factor |
| calculated_emissions | Calculated emissions |
| evidence_id | Evidence link |
| note | Calculation note |

### 5.3 ESG area entries

| Field | Description |
|---|---|
| year | Reporting year |
| month | Reporting month |
| company | Company name |
| site | Site name |
| area | Environment, people, safety, supply, governance |
| group_code | Area-specific group |
| field_values | JSON field values for each area form |
| evidence_id | Evidence file or URL |
| status | Draft, submitted, reviewed, rejected |
| created_by | Input user |
| reviewed_by | Reviewer |
| updated_at | Last update time |

## 6. Current prototype scope

The current prototype includes:

- Area-based dashboard
- Greenhouse gas input by Scope 1, Scope 2, Scope 3
- Activity data and emission factor fields for GHG
- General environment forms for water, waste, and air pollutants
- People forms for headcount, hiring/turnover, and training
- Safety forms for incidents and risk improvements
- Supply chain and ethics forms
- Report data map
- JSON export/import
- Browser localStorage storage

## 7. Next development sequence

1. Convert GHG master data into Supabase tables.
2. Create `ghg_activity_entries` for Scope 1, Scope 2, Scope 3 calculation records.
3. Create `esg_area_entries` for non-GHG ESG data.
4. Add evidence file storage and link evidence to each record.
5. Add role-based access by company, site, area, department, and admin role.
6. Add review workflow: draft, submitted, reviewed, rejected.
7. Add Excel export by sustainability report item.
8. Add report mapping by GRI, CDP, EcoVadis, and supply-chain due diligence.
