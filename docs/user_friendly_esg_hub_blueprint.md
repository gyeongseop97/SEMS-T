# User-Friendly ESG Data Hub Blueprint

## 1. Product direction

SEMS-T should become a practical ESG data hub for sustainability reporting, supply-chain due diligence, CDP, EcoVadis, and internal management reporting.

The service should not start from the reporting framework. It should start from the employee who has to enter data.

Core principle:

> Show users what they need to do, make the input process simple, and let the system handle units, evidence, report mapping, and status tracking.

## 2. Target users

| User | Main need | Recommended UX |
|---|---|---|
| Field department user | Enter assigned data quickly | Today’s tasks, quick input, evidence upload |
| Planning/ESG manager | Check progress and missing data | Dashboard, company/site filters, completion rate |
| Reviewer | Validate values and evidence | Review status, comments, revision request |
| Report writer | Use data in sustainability report | Report data map, export by disclosure item |
| Admin | Manage indicators and permissions | Indicator master, department owner, role control |

## 3. User-friendly workflow

### Step 1. User opens dashboard

The first screen should answer these questions.

- What do I need to submit this month?
- Which items are missing?
- Which items already have evidence?
- What is the overall report readiness?

### Step 2. User clicks one task

The task should open the quick input screen with the relevant indicator already selected.

The user should not have to know whether the data belongs to GRI 303, GRI 305, CDP, or internal report sections.

### Step 3. User enters value and evidence

The input screen should only ask for essential information.

- Value
- Evidence file or URL
- Note, if needed

The system should automatically show:

- Unit
- Owner department
- Evidence example
- Reporting item
- External standard mapping

### Step 4. Manager checks status

The manager should be able to filter by:

- Year/month
- Company
- Site
- ESG area
- Missing items
- Items without evidence
- Items pending review

### Step 5. Report writer exports data

Data should be exportable by report item, not only by raw indicator.

Example:

| Report section | Connected indicators |
|---|---|
| Greenhouse gas emissions | Scope 1, Scope 2, energy use |
| Water management | Water withdrawal, wastewater discharge |
| Waste management | Waste generation, recycling amount |
| Employee status | Total employees, gender, employment type |
| Training | Total training hours, average training hours |
| Occupational safety | Accident count, lost work days |

## 4. Recommended data structure

### 4.1 Indicator master

| Field | Description |
|---|---|
| code | Unique indicator code |
| domain | Environment, Social, Safety, Supply Chain, Governance |
| group_name | Detailed group such as water, waste, education |
| indicator_name | User-facing indicator name |
| unit | tCO₂eq, MWh, ton, kg, persons, hours, count |
| cycle | Monthly, quarterly, yearly, on change |
| owner_department | Responsible department |
| report_item | Sustainability report section |
| external_standard | GRI, CDP, EcoVadis, supply-chain due diligence item |
| evidence_example | Recommended evidence type |
| input_guide | Plain-language guide for field users |
| is_active | Whether the indicator is currently used |

### 4.2 ESG data entries

| Field | Description |
|---|---|
| year | Reporting year |
| month | Reporting month |
| company | Company name |
| site | Site name |
| indicator_code | Linked indicator code |
| value | Numeric value |
| unit | Unit copied from indicator master |
| evidence_id | Linked evidence file or URL |
| note | Data explanation or reason for change |
| status | Draft, submitted, reviewed, rejected |
| created_by | Input user |
| reviewed_by | Reviewer |
| updated_at | Last update time |

### 4.3 Evidence table

| Field | Description |
|---|---|
| evidence_id | Unique evidence ID |
| file_name | Uploaded file name |
| file_url | Storage URL |
| evidence_type | File, URL, system capture |
| related_indicator | Linked indicator code |
| year_month | Related period |
| uploaded_by | Uploader |
| note | Evidence description |

## 5. Current prototype scope

The current `index.html` prototype includes:

- Dashboard
- Today’s tasks
- Quick input screen
- Environment data cards
- People data cards
- Safety data cards
- Supply chain and governance data cards
- Report data map
- Evidence list
- Indicator master table
- JSON export/import
- Browser localStorage storage

## 6. Next development sequence

1. Convert the static indicator list into a Supabase `esg_indicator_master` table.
2. Add `esg_data_entries` table for monthly/quarterly/yearly values.
3. Add `esg_evidence_files` table and connect file storage.
4. Add role-based access by company, site, department, and admin role.
5. Add review workflow: draft, submitted, reviewed, rejected.
6. Add Excel export for sustainability report tables.
7. Add report item mapping by GRI, CDP, EcoVadis, and supply-chain due diligence.
