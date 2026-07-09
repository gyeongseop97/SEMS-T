const $ = (id) => document.getElementById(id);
const STORE = 'semsT.reportingSheet.records.v1';
const now = new Date();
const companies = ['세원정공','세원물산','세원테크','세원이엔아이'];
const sites = ['본사','대구공장','영천공장','해외법인'];
let records = JSON.parse(localStorage.getItem(STORE) || '[]');
let page = 'dashboard';
let activeSheet = { environment:'water', people:'headcount', safety:'incident', supply:'supplier' };

const pages = [
  ['dashboard','대시보드','현황'],
  ['ghg','온실가스','기존 SEMS'],
  ['environment','환경자료','용수·폐기물·대기'],
  ['people','인사자료','임직원·교육'],
  ['safety','안전보건','재해·개선'],
  ['supply','공급망·윤리','실사·제보'],
  ['map','보고서 맵','연결표'],
  ['settings','설정','DB 구조']
];

const templates = {
  environment:{
    title:'환경자료 입력대장', desc:'용수·폐수, 폐기물, 대기오염물질은 각각 입력 기준이 다르므로 탭을 나누되, 입력은 엑셀 대장처럼 한 번에 저장합니다.',
    sheets:[
      {id:'water', name:'용수·폐수', guide:'취수원/배출구분별 월간 수량과 증빙을 입력합니다.', rows:['상수 사용량','지하수 사용량','공업용수 사용량','폐수 배출량','재이용수 사용량'], cols:[['item','항목','fixed'],['value','수량','number'],['unit','단위','select','ton|m³'],['evidence','증빙','text'],['note','비고','text']]},
      {id:'waste', name:'폐기물', guide:'폐기물 종류별로 일반/지정, 처리방법, 위탁처리업체를 함께 입력합니다.', rows:['일반폐기물','지정폐기물','폐기계유/폐유','폐수처리오니','재활용 폐기물','기타'], cols:[['item','폐기물 종류','text'],['hazard','구분','select','일반|지정'],['method','처리방법','select','재활용|소각|매립|중화|기타'],['value','배출량','number'],['unit','단위','select','ton|kg'],['vendor','처리업체','text'],['evidence','증빙','text']]},
      {id:'air', name:'대기오염물질', guide:'배출구/시설별 측정값과 측정성적서를 관리합니다.', rows:['NOx','SOx','먼지','VOC','HCl','기타'], cols:[['facility','배출구/시설','text'],['item','오염물질','fixed'],['value','측정값/배출량','number'],['unit','단위','select','kg|ton|ppm|mg/Sm³'],['date','측정일','date'],['evidence','측정성적서','text']]}
    ]
  },
  people:{
    title:'인사자료 입력대장', desc:'개인정보가 아니라 보고서 작성에 필요한 집계값만 관리합니다. 기준일, 구분, 인원, 증빙을 한 화면에서 입력합니다.',
    sheets:[
      {id:'headcount', name:'임직원 현황', guide:'월말 또는 연말 기준 스냅샷입니다.', rows:['총 임직원 수','남성 임직원 수','여성 임직원 수','관리직 인원','생산직 인원','정규직 인원','비정규직 인원','외국인 근로자','장애인 근로자'], cols:[['item','항목','fixed'],['baseDate','기준일','date'],['value','인원','number'],['unit','단위','fixed','명'],['evidence','증빙','text'],['note','비고','text']]},
      {id:'movement', name:'채용·퇴사', guide:'성별·연령대별 채용/퇴사 집계값을 입력합니다.', rows:['신규채용 전체','신규채용 남성','신규채용 여성','퇴사 전체','퇴사 남성','퇴사 여성','30세 미만','30~50세','50세 초과'], cols:[['item','항목','fixed'],['type','구분','select','채용|퇴사|연령대'],['value','인원','number'],['unit','단위','fixed','명'],['evidence','증빙','text'],['note','비고','text']]},
      {id:'training', name:'교육훈련', guide:'교육명별 인원과 총 교육시간을 입력합니다.', rows:['법정의무교육','안전보건교육','직무교육','윤리·준법교육','인권/괴롭힘 예방교육','기타'], cols:[['item','교육구분','fixed'],['trainingName','교육명','text'],['target','대상','select','전체|관리직|생산직|신규입사자|관리자'],['people','교육인원','number'],['hours','총 교육시간','number'],['evidence','결과보고서/서명부','text']]}
    ]
  },
  safety:{
    title:'안전보건 입력대장', desc:'사고 건수만 입력하지 않고 사고유형, 손실일수, 조치상태, 개선조치까지 같이 관리합니다.',
    sheets:[
      {id:'incident', name:'산업재해·사고', guide:'재해 유형별 월간 건수와 손실일수를 입력합니다.', rows:['끼임','넘어짐','떨어짐','부딪힘','화상','베임/찔림','기타'], cols:[['item','사고유형','fixed'],['date','대표 발생일','date'],['count','건수','number'],['lostDays','근로손실일수','number'],['status','조치상태','select','해당없음|조치중|조치완료|재발방지대책 수립'],['evidence','증빙','text']]},
      {id:'risk', name:'위험성평가·개선', guide:'공정별 위험요인과 개선조치 완료여부를 입력합니다.', rows:['프레스','용접','조립','물류','보전','사무','기타'], cols:[['item','공정/부서','fixed'],['risk','위험요인','text'],['level','위험도','select','낮음|보통|높음'],['action','개선조치','text'],['status','상태','select','계획|진행중|완료'],['evidence','증빙','text']]}
    ]
  },
  supply:{
    title:'공급망·윤리 입력대장', desc:'협력사 평가, 실사, 개선요청, 윤리교육, 고충·제보 건수를 대장 형태로 관리합니다.',
    sheets:[
      {id:'supplier', name:'협력사 ESG 평가', guide:'평가대상, 평가완료, 고위험, 개선요청 수를 관리합니다.', rows:['1차 협력사','주요 원자재 협력사','외주가공 협력사','물류 협력사','기타'], cols:[['item','구분','fixed'],['target','평가대상 수','number'],['completed','평가완료 수','number'],['highRisk','고위험 수','number'],['improvement','개선요청 수','number'],['evidence','평가표/결과','text']]},
      {id:'due', name:'공급망 실사', guide:'실사 방식과 결과, 개선계획을 협력사 단위로 입력합니다.', rows:['협력사 1','협력사 2','협력사 3','협력사 4','협력사 5','기타'], cols:[['supplier','협력사명','text'],['method','실사방법','select','현장실사|서면실사|문서검토'],['result','결과','select','양호|개선필요|고위험'],['action','개선계획','text'],['status','상태','select','계획|진행중|완료'],['evidence','실사보고서','text']]},
      {id:'ethics', name:'윤리·제보', guide:'윤리교육, 반부패교육, 고충·제보, 징계 등 건수 또는 시간을 관리합니다.', rows:['윤리교육','반부패교육','고충 접수','제보 접수','징계','기타'], cols:[['item','항목','fixed'],['value','건수/시간','number'],['unit','단위','select','건|시간|명'],['status','처리상태','select','해당없음|접수|조사중|종결'],['evidence','증빙','text'],['note','비고','text']]}
    ]
  }
};

function save(){ localStorage.setItem(STORE, JSON.stringify(records)); }
function filter(){ return {year:+$('year').value, month:+$('month').value, company:$('company').value, site:$('site').value}; }
function matchBase(r){ const f=filter(); return r.year===f.year && r.month===f.month && r.company===f.company && r.site===f.site; }
function recKey(area,sheet,rowId){ const f=filter(); return `${f.year}|${f.month}|${f.company}|${f.site}|${area}|${sheet}|${rowId}`; }
function getRecord(area,sheet,rowId){ const key=recKey(area,sheet,rowId); return records.find(r=>r.key===key); }
function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }
function safeId(v){ return String(v).replace(/[^a-zA-Z0-9_]/g,'_'); }
function esc(v){ return String(v ?? '').replace(/[&<>"]/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[s])); }

function init(){
  $('year').innerHTML = Array.from({length:7},(_,i)=>2024+i).map(y=>`<option ${y===now.getFullYear()?'selected':''}>${y}</option>`).join('');
  $('month').innerHTML = Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===now.getMonth()+1?'selected':''}>${i+1}월</option>`).join('');
  $('company').innerHTML = companies.map((c,i)=>`<option ${i===0?'selected':''}>${c}</option>`).join('');
  $('site').innerHTML = sites.map((s,i)=>`<option ${i===0?'selected':''}>${s}</option>`).join('');
  $('nav').innerHTML = pages.map(([id,name,badge],i)=>`<button class="${i===0?'active':''}" data-page="${id}"><span>${name}</span><small>${badge}</small></button>`).join('');
  document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>openPage(b.dataset.page)));
  ['year','month','company','site'].forEach(id=>$(id).addEventListener('change',render));
  $('exportBtn').addEventListener('click', exportData);
  $('importBtn').addEventListener('click', ()=>$('importFile').click());
  $('importFile').addEventListener('change', importData);
  render();
}

function openPage(id){
  page=id;
  document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
  const meta = pages.find(p=>p[0]===id);
  $('pageTitle').textContent=meta ? meta[1] : 'SEMS-T';
  $('pageSub').textContent={dashboard:'분야별 입력현황과 누락된 보고서 데이터를 확인합니다.',ghg:'온실가스는 기존 SEMS 산정화면과 배출계수 구조를 그대로 사용합니다.',environment:'환경자료는 용수·폐기물·대기 탭별 입력대장으로 작성합니다.',people:'인사자료는 보고서용 집계값을 대장 형태로 작성합니다.',safety:'안전보건은 사고·손실일수·개선조치를 함께 관리합니다.',supply:'공급망·윤리 데이터는 평가, 실사, 제보 항목별 대장으로 관리합니다.',map:'분야별 입력값이 지속가능경영보고서 항목과 어떻게 연결되는지 확인합니다.',settings:'운영형 서비스 전환 시 필요한 DB 구조입니다.'}[id] || '';
  render();
}
window.openPage = openPage;

function render(){
  if(page==='dashboard') return renderDashboard();
  if(page==='ghg') return renderGhgLink();
  if(templates[page]) return renderArea(page);
  if(page==='map') return renderMap();
  if(page==='settings') return renderSettings();
}

function currentCompletion(){
  const rows=[];
  Object.entries(templates).forEach(([area,t])=>t.sheets.forEach(s=>s.rows.forEach((row,idx)=>rows.push({area,sheet:s.id,rowId:`r${idx}`,label:row}))));
  const done = rows.filter(x=>getRecord(x.area,x.sheet,x.rowId));
  const evidence = records.filter(matchBase).filter(r=>Object.values(r.data||{}).some(v=>String(v||'').includes('증빙')===false) && (r.data.evidence || r.data.report || r.data.file || r.data['증빙'])).length;
  return {total:rows.length, done:done.length, missing:rows.length-done.length, evidence};
}

function renderDashboard(){
  const f=filter(); const c=currentCompletion();
  $('content').innerHTML = `
    <div class="panel intro"><h2>${f.year}년 ${f.month}월 지속가능경영 데이터 입력현황</h2><p>온실가스는 기존 SEMS를 그대로 사용하고, 그 외 지속가능경영보고서 데이터는 분야별 입력대장 방식으로 작성합니다. 담당자는 자기 분야 탭에서 엑셀처럼 한 줄씩 채우고 한 번에 저장하면 됩니다.</p></div>
    <div class="kpis"><div class="kpi"><div class="label">입력대상 행</div><div class="value">${c.total}</div><div class="desc">환경·인사·안전·공급망</div></div><div class="kpi"><div class="label">작성완료</div><div class="value">${c.done}</div><div class="desc">선택 회사·사업장 기준</div></div><div class="kpi"><div class="label">미작성</div><div class="value">${c.missing}</div><div class="desc">확인 필요</div></div><div class="kpi"><div class="label">온실가스</div><div class="value">SEMS</div><div class="desc">기존 산정·배출계수 사용</div></div></div>
    <div class="grid2"><div class="panel"><h2>분야별 입력률</h2>${progressRows()}</div><div class="panel"><h2>작업 바로가기</h2>${quickLinks()}</div></div>`;
}

function progressRows(){
  return Object.entries(templates).map(([area,t])=>{ const total=t.sheets.reduce((a,s)=>a+s.rows.length,0); let done=0; t.sheets.forEach(s=>s.rows.forEach((_,idx)=>{ if(getRecord(area,s.id,`r${idx}`)) done++; })); const rate=Math.round(done/total*100); return `<div class="progressRow"><b>${t.title.replace(' 입력대장','')}</b><div class="bar"><span style="width:${rate}%"></span></div><em>${rate}%</em></div>`; }).join('');
}

function quickLinks(){
  return `<div class="task"><div><b>온실가스 배출량 입력</b><span>기존 SEMS 화면과 배출계수 세트를 그대로 사용합니다.</span></div><button class="btn secondary small" onclick="openPage('ghg')">열기</button></div>` + Object.entries(templates).map(([area,t])=>`<div class="task"><div><b>${t.title}</b><span>${t.desc}</span></div><button class="btn secondary small" onclick="openPage('${area}')">작성</button></div>`).join('');
}

function renderGhgLink(){
  $('content').innerHTML = `<div class="panel intro"><h2>온실가스 입력은 기존 SEMS 방식 사용</h2><p>Scope 1·2·3을 새로 만든 단순 양식으로 입력하지 않습니다. 기존 SEMS의 배출량 산정 흐름, 회사별 데이터 구조, 적용 배출계수 세트를 그대로 불러옵니다.</p><div class="tools"><a class="btn green linkBtn" href="ghg.html">기존 SEMS 온실가스 화면 열기</a><a class="btn secondary linkBtn" href="ghg.html" target="_blank">새 창으로 열기</a></div></div><div class="panel framePanel"><iframe src="ghg.html" title="기존 SEMS 온실가스 입력"></iframe></div>`;
}

function renderArea(area){
  const t=templates[area]; const sheet=t.sheets.find(s=>s.id===activeSheet[area]) || t.sheets[0]; activeSheet[area]=sheet.id;
  $('content').innerHTML = `<div class="panel intro"><h2>${t.title}</h2><p>${t.desc}</p><div class="sheetTabs">${t.sheets.map(s=>`<button class="sheetTab ${s.id===sheet.id?'active':''}" onclick="setSheet('${area}','${s.id}')">${s.name}</button>`).join('')}</div></div><div class="panel"><div class="sheetHeader"><div><h2>${sheet.name}</h2><p>${sheet.guide}</p></div><button class="btn green" onclick="saveSheet('${area}','${sheet.id}')">이 대장 저장</button></div>${renderSheet(area,sheet)}</div>`;
}
window.setSheet = function(area,id){ activeSheet[area]=id; renderArea(area); };

function renderSheet(area,sheet){
  return `<div class="tableWrap sheetWrap"><table class="sheetTable"><thead><tr>${sheet.cols.map(c=>`<th>${c[1]}</th>`).join('')}<th>상태</th></tr></thead><tbody>${sheet.rows.map((row,idx)=>renderRow(area,sheet,row,idx)).join('')}</tbody></table></div>`;
}

function renderRow(area,sheet,row,idx){
  const rowId=`r${idx}`; const rec=getRecord(area,sheet.id,rowId); const data=rec ? rec.data : {}; const status=rec ? '<span class="status done">저장됨</span>' : '<span class="status miss">미작성</span>';
  return `<tr>${sheet.cols.map(col=>renderCell(area,sheet.id,rowId,col,row,data[col[0]])).join('')}<td>${status}</td></tr>`;
}

function renderCell(area,sheet,rowId,col,rowLabel,value){
  const [key,label,type,opts]=col; const id=`cell_${safeId(area)}_${safeId(sheet)}_${safeId(rowId)}_${safeId(key)}`;
  if(type==='fixed') return `<td><input id="${id}" data-key="${key}" value="${esc(opts || rowLabel)}" readonly /></td>`;
  if(type==='select') return `<td><select id="${id}" data-key="${key}">${String(opts).split('|').map(o=>`<option ${value===o?'selected':''}>${o}</option>`).join('')}</select></td>`;
  return `<td><input id="${id}" data-key="${key}" type="${type}" value="${esc(value || '')}" placeholder="${esc(label)}" /></td>`;
}

function saveSheet(area,sheetId){
  const t=templates[area]; const sheet=t.sheets.find(s=>s.id===sheetId); const f=filter(); let count=0;
  sheet.rows.forEach((row,idx)=>{
    const rowId=`r${idx}`; const data={}; let has=false;
    sheet.cols.forEach(col=>{ const id=`cell_${safeId(area)}_${safeId(sheetId)}_${safeId(rowId)}_${safeId(col[0])}`; const el=$(id); const val=el ? el.value.trim() : ''; data[col[0]]=val; if(col[2] !== 'fixed' && val) has=true; });
    const key=recKey(area,sheetId,rowId); records=records.filter(r=>r.key!==key);
    if(has){ records.push({...f,key,area,sheet:sheetId,rowId,rowLabel:row,data,updatedAt:new Date().toISOString()}); count++; }
  });
  save(); renderArea(area); toast(`${sheet.name} ${count}건 저장되었습니다.`);
}
window.saveSheet=saveSheet;

function renderMap(){
  const rows = [
    ['온실가스','기존 SEMS','Scope 1·2·3 배출량, 에너지 사용량, 배출계수','GRI 305, CDP, SBTi 기초자료'],
    ['환경자료','용수·폐수','용수 사용량, 폐수 배출량, 재이용수','GRI 303'],
    ['환경자료','폐기물','폐기물 발생량, 지정/일반, 처리방법, 재활용량','GRI 306'],
    ['환경자료','대기오염물질','NOx, SOx, 먼지, VOC 등','환경 법규, 내부 환경성과'],
    ['인사자료','임직원 현황','성별, 직군, 고용형태, 외국인, 장애인','GRI 2-7, 405'],
    ['인사자료','채용·퇴사','신규채용, 퇴사, 성별·연령대별 구성','GRI 401'],
    ['인사자료','교육훈련','교육인원, 총 교육시간, 교육 종류','GRI 404'],
    ['안전보건','산업재해·개선','사고유형, 건수, 근로손실일수, 조치상태','GRI 403'],
    ['공급망·윤리','협력사 평가·실사','평가대상, 평가완료, 고위험, 개선요청','GRI 308, 414, 공급망 실사'],
    ['공급망·윤리','윤리·제보','윤리교육, 고충, 제보, 징계','GRI 205, 2-25, 2-26']
  ];
  $('content').innerHTML = `<div class="panel"><h2>보고서 데이터맵</h2><p>입력대장은 현업 작성 편의 기준으로 나누고, 보고서 작성 시에는 아래 항목으로 다시 집계합니다.</p><div class="tableWrap"><table><thead><tr><th>분야</th><th>입력대장</th><th>보고서 사용 데이터</th><th>연결 기준</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}

function renderSettings(){
  $('content').innerHTML = `<div class="panel"><h2>운영형 전환 구조</h2><p>온실가스는 기존 SEMS 테이블과 배출계수 마스터를 사용하고, 그 외 지속가능경영보고서 데이터는 분야별 입력대장 테이블로 분리하는 구조가 적합합니다.</p><div class="tableWrap"><table><thead><tr><th>구분</th><th>권장 테이블</th><th>역할</th></tr></thead><tbody><tr><td>온실가스</td><td>기존 SEMS entries / emission factors</td><td>Scope 1·2·3 산정 및 배출계수 관리</td></tr><tr><td>환경·인사·안전·공급망</td><td>esg_reporting_entries</td><td>분야별 입력대장 데이터 저장</td></tr><tr><td>입력양식</td><td>esg_reporting_templates</td><td>분야별 행/열 구조 관리</td></tr><tr><td>증빙</td><td>esg_evidence_files</td><td>파일/URL/증빙 설명 연결</td></tr><tr><td>보고서 맵</td><td>esg_report_mapping</td><td>GRI, CDP, EcoVadis, 공급망 실사 문항 연결</td></tr></tbody></table></div></div>`;
}

function exportData(){ const blob = new Blob([JSON.stringify({exportedAt:new Date().toISOString(),records},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='sems_t_reporting_sheet_data.json'; a.click(); URL.revokeObjectURL(a.href); }
async function importData(e){ const file=e.target.files[0]; if(!file)return; try{ const json=JSON.parse(await file.text()); records=Array.isArray(json.records)?json.records:json; save(); render(); toast('데이터를 불러왔습니다.'); }catch(err){ toast('JSON 파일을 확인해 주세요.'); } }

init();
