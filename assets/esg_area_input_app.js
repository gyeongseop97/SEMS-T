const $ = (id) => document.getElementById(id);
const storageKey = 'semsT.areaInput.records.v1';
const now = new Date();
const companies = ['세원정공','세원물산','세원테크','세원이엔아이'];
const sites = ['본사','대구공장','영천공장','해외법인'];
let records = JSON.parse(localStorage.getItem(storageKey) || '[]');
let currentPage = 'dashboard';
let currentScope = 'SCOPE1';

const pages = [
  ['dashboard','대시보드','현황'],
  ['ghg','온실가스','S1·S2·S3'],
  ['environment','환경 일반','용수·폐기물·대기'],
  ['people','인사·교육','임직원'],
  ['safety','안전보건','재해'],
  ['supply','공급망·윤리','실사'],
  ['map','보고서 맵','GRI·CDP'],
  ['settings','지표 설정','관리']
];

const ghgMasters = {
  SCOPE1: {
    title:'Scope 1 직접배출',
    desc:'회사 소유 또는 통제 설비·차량·냉매 등에서 직접 발생하는 배출량입니다. 활동자료와 배출계수를 함께 관리합니다.',
    groups:[
      {id:'stationary', name:'고정연소', guide:'보일러, 건조로, 열처리로 등 사업장 내 연료 사용', sources:['LNG','LPG','경유','휘발유','등유','B-C유'], unit:'사용량', defaultUnit:'Nm³/L/kg', factorUnit:'kgCO₂eq/단위'},
      {id:'mobile', name:'이동연소', guide:'회사 차량, 지게차, 업무용 차량 연료 사용', sources:['휘발유 차량','경유 차량','LPG 차량','지게차'], unit:'연료 사용량', defaultUnit:'L', factorUnit:'kgCO₂eq/L'},
      {id:'fugitive', name:'냉매·공정 누출', guide:'에어컨, 냉동기, 칠러 등 냉매 충전·보충·폐기량', sources:['R-134a','R-410A','R-32','R-22','기타 냉매'], unit:'누출 또는 보충량', defaultUnit:'kg', factorUnit:'kgCO₂eq/kg'}
    ]
  },
  SCOPE2: {
    title:'Scope 2 간접배출',
    desc:'구매 전력, 스팀, 열 사용으로 인해 외부에서 발생하는 간접배출량입니다. 전력은 location-based와 market-based 구분이 필요할 수 있습니다.',
    groups:[
      {id:'electricity_location', name:'전력 - Location-based', guide:'전력 사용량 × 국가/지역 전력 배출계수', sources:['한국전력','공장 수전량','사업장 계량기'], unit:'전력 사용량', defaultUnit:'MWh', factorUnit:'tCO₂eq/MWh'},
      {id:'electricity_market', name:'전력 - Market-based', guide:'재생에너지 구매, PPA, REC, 녹색프리미엄 등을 반영한 산정', sources:['일반 전력','녹색프리미엄','REC','PPA'], unit:'전력 사용량', defaultUnit:'MWh', factorUnit:'tCO₂eq/MWh'},
      {id:'steam_heat', name:'스팀·열', guide:'외부에서 구매한 스팀, 열, 냉방 에너지 사용량', sources:['구매 스팀','구매 열','지역 냉난방'], unit:'에너지 사용량', defaultUnit:'GJ/ton', factorUnit:'tCO₂eq/단위'}
    ]
  },
  SCOPE3: {
    title:'Scope 3 기타 간접배출',
    desc:'가치사슬에서 발생하는 배출량입니다. 카테고리별 활동자료, 산정방법, 배출계수가 다르므로 별도 구분이 필요합니다.',
    groups:[
      {id:'cat1', name:'Cat.1 구매한 제품·서비스', guide:'원재료, 부자재, 외주가공 등 구매량 또는 구매금액 기반', sources:['철강','알루미늄','부자재','외주가공','소모품'], unit:'구매량 또는 금액', defaultUnit:'ton/백만원', factorUnit:'tCO₂eq/단위'},
      {id:'cat2', name:'Cat.2 자본재', guide:'설비, 금형, 건물 등 자본재 구매금액 기반', sources:['설비','금형','건축물','차량'], unit:'구매금액', defaultUnit:'백만원', factorUnit:'tCO₂eq/백만원'},
      {id:'cat3', name:'Cat.3 연료·에너지 관련', guide:'Scope 1·2에 포함되지 않은 연료·전력의 상류 배출', sources:['전력 상류','LNG 상류','경유 상류'], unit:'에너지 사용량', defaultUnit:'MWh/Nm³/L', factorUnit:'tCO₂eq/단위'},
      {id:'cat4', name:'Cat.4 상류 운송·물류', guide:'원부자재 운송 거리, 중량, 운송수단 기반', sources:['트럭','해상','항공','철도'], unit:'ton-km 또는 운송비', defaultUnit:'ton-km/백만원', factorUnit:'tCO₂eq/단위'},
      {id:'cat5', name:'Cat.5 사업장 폐기물', guide:'폐기물 종류와 처리방법별 배출계수 적용', sources:['매립','소각','재활용','위탁처리'], unit:'폐기물량', defaultUnit:'ton', factorUnit:'tCO₂eq/ton'},
      {id:'cat6', name:'Cat.6 출장', guide:'항공, 철도, 차량 출장 거리 또는 비용 기반', sources:['항공','철도','버스','렌터카'], unit:'거리 또는 비용', defaultUnit:'km/백만원', factorUnit:'tCO₂eq/단위'},
      {id:'cat7', name:'Cat.7 임직원 통근', guide:'통근수단, 인원, 거리, 근무일수 기반', sources:['자가용','버스','지하철','도보/자전거'], unit:'인원·거리·일수', defaultUnit:'person-km', factorUnit:'tCO₂eq/person-km'},
      {id:'cat9', name:'Cat.9 하류 운송·물류', guide:'제품 출하 이후 고객사까지의 운송 활동자료', sources:['트럭','해상','항공','철도'], unit:'ton-km 또는 운송비', defaultUnit:'ton-km/백만원', factorUnit:'tCO₂eq/단위'}
    ]
  }
};

const areaMasters = {
  environment: {
    title:'환경 일반 데이터',
    desc:'용수, 폐수, 폐기물, 대기오염물질은 각각 입력 기준과 증빙자료가 다르므로 별도 입력 그룹으로 관리합니다.',
    groups:[
      {id:'water', name:'용수·폐수', guide:'취수원, 사용량, 배출량, 재이용량을 구분합니다.', fields:[['source','구분','select','상수|지하수|공업용수|빗물|폐수 방류|재이용수'],['amount','수량','number'],['unit','단위','select','ton|m³'],['evidence','증빙','text'],['note','비고','text']]},
      {id:'waste', name:'폐기물', guide:'일반/지정폐기물, 처리방법, 위탁처리업체를 함께 관리합니다.', fields:[['wasteType','폐기물 종류','text'],['hazard','구분','select','일반폐기물|지정폐기물'],['method','처리방법','select','재활용|소각|매립|중화|기타'],['amount','배출량','number'],['unit','단위','select','ton|kg'],['vendor','처리업체','text'],['evidence','증빙','text']]},
      {id:'air', name:'대기오염물질', guide:'측정지점, 오염물질, 농도/배출량, 측정일을 함께 입력합니다.', fields:[['stack','배출구/시설','text'],['pollutant','오염물질','select','NOx|SOx|먼지|VOC|HCl|기타'],['amount','배출량','number'],['unit','단위','select','kg|ton|ppm|mg/Sm³'],['date','측정일','date'],['evidence','측정성적서','text']]}
    ]
  },
  people: {
    title:'인사·교육 데이터',
    desc:'임직원 현황은 기준일과 집계 기준이 중요합니다. 개인정보가 아니라 보고서용 집계값 중심으로 관리합니다.',
    groups:[
      {id:'headcount', name:'임직원 현황', guide:'월말 또는 연말 기준 인원 스냅샷입니다.', fields:[['baseDate','기준일','date'],['category','구분','select','전체|남성|여성|관리직|생산직|정규직|비정규직|외국인|장애인'],['amount','인원','number'],['unit','단위','fixed','명'],['evidence','증빙','text']]},
      {id:'movement', name:'채용·퇴사', guide:'해당 기간의 입사·퇴사 흐름을 성별/연령대 등으로 나눌 수 있습니다.', fields:[['type','구분','select','신규채용|퇴사'],['gender','성별','select','전체|남성|여성'],['age','연령대','select','전체|30세 미만|30~50세|50세 초과'],['amount','인원','number'],['unit','단위','fixed','명'],['evidence','증빙','text']]},
      {id:'training', name:'교육훈련', guide:'교육명, 대상, 인원, 총 교육시간을 구분합니다.', fields:[['trainingName','교육명','text'],['target','대상','select','전체|관리직|생산직|신규입사자|관리자'],['people','교육인원','number'],['hours','총 교육시간','number'],['unit','단위','fixed','시간'],['evidence','결과보고서/서명부','text']]}
    ]
  },
  safety: {
    title:'안전보건 데이터',
    desc:'산업재해, 근로손실일수, 위험성평가, 안전교육은 발생일과 조치상태까지 함께 관리해야 합니다.',
    groups:[
      {id:'accident', name:'산업재해', guide:'사고 유형, 발생일, 손실일수, 조치상태를 관리합니다.', fields:[['date','발생일','date'],['type','사고유형','select','끼임|넘어짐|떨어짐|부딪힘|화상|기타'],['count','건수','number'],['lostDays','근로손실일수','number'],['action','조치상태','select','조치중|조치완료|재발방지대책 수립'],['evidence','증빙','text']]},
      {id:'risk', name:'위험성평가·개선', guide:'평가 실시 여부와 개선조치 완료 여부를 구분합니다.', fields:[['process','공정/부서','text'],['risk','위험요인','text'],['level','위험도','select','낮음|보통|높음'],['action','개선조치','text'],['status','상태','select','계획|진행중|완료'],['evidence','증빙','text']]}
    ]
  },
  supply: {
    title:'공급망·윤리 데이터',
    desc:'협력사 ESG 평가, 실사, 개선조치, 윤리·준법 교육 및 제보 건수를 관리합니다.',
    groups:[
      {id:'supplierEval', name:'협력사 ESG 평가', guide:'평가 대상, 완료 수, 고위험 협력사, 개선요청을 구분합니다.', fields:[['target','평가대상 수','number'],['completed','평가완료 수','number'],['highRisk','고위험 수','number'],['improvement','개선요청 수','number'],['evidence','평가표/결과','text']]},
      {id:'dueDiligence', name:'공급망 실사', guide:'현장실사/서면실사, 완료 여부, 개선계획을 관리합니다.', fields:[['supplier','협력사명','text'],['method','실사방법','select','현장실사|서면실사|문서검토'],['result','결과','select','양호|개선필요|고위험'],['action','개선계획','text'],['evidence','실사보고서','text']]},
      {id:'ethics', name:'윤리·제보', guide:'윤리교육, 반부패 교육, 고충·제보 접수 건수를 관리합니다.', fields:[['type','구분','select','윤리교육|반부패교육|고충접수|제보접수|징계'],['amount','건수/시간','number'],['unit','단위','select','건|시간|명'],['status','처리상태','select','해당없음|접수|조사중|종결'],['evidence','증빙','text']]}
    ]
  }
};

function save(){ localStorage.setItem(storageKey, JSON.stringify(records)); }
function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }
function filter(){ return {year:+$('year').value, month:+$('month').value, company:$('company').value, site:$('site').value}; }
function baseMatch(r){ const f=filter(); return r.year===f.year && r.month===f.month && r.company===f.company && r.site===f.site; }
function statusBadge(r){ if(!r) return '<span class="status miss">미입력</span>'; return r.evidence ? '<span class="status done">증빙완료</span>' : '<span class="status valueOnly">값 입력</span>'; }
function format(v){ return v === undefined || v === null || v === '' ? '-' : Number(v).toLocaleString(); }

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
  currentPage=id;
  document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
  const page=pages.find(p=>p[0]===id);
  $('pageTitle').textContent=page[1];
  const sub={dashboard:'분야별 입력 현황과 미입력 항목을 확인합니다.',ghg:'Scope 1·2·3별 활동자료, 배출계수, 산정식을 구분해 입력합니다.',environment:'용수·폐수·폐기물·대기오염물질을 각각 다른 양식으로 입력합니다.',people:'임직원 현황, 채용·퇴사, 교육시간을 집계 기준에 맞게 입력합니다.',safety:'산업재해, 근로손실일수, 위험성평가 개선조치를 관리합니다.',supply:'협력사 ESG 평가, 공급망 실사, 윤리·제보 데이터를 관리합니다.',map:'입력 항목이 지속가능경영보고서와 어떤 기준에 연결되는지 확인합니다.',settings:'향후 Supabase 지표 마스터로 전환할 기준입니다.'};
  $('pageSub').textContent=sub[id]||'';
  render();
}

function render(){
  if(currentPage==='dashboard') renderDashboard();
  if(currentPage==='ghg') renderGhg();
  if(['environment','people','safety','supply'].includes(currentPage)) renderArea(currentPage);
  if(currentPage==='map') renderMap();
  if(currentPage==='settings') renderSettings();
}

function renderDashboard(){
  const f=filter();
  const scopeRequired = Object.values(ghgMasters).flatMap(s=>s.groups).length;
  const areaRequired = Object.values(areaMasters).flatMap(a=>a.groups).length;
  const req = scopeRequired + areaRequired;
  const cur = records.filter(baseMatch);
  const doneKeys = new Set(cur.map(r=>`${r.area}:${r.group}`));
  const evidence = cur.filter(r=>r.evidence).length;
  $('content').innerHTML = `
    <div class="panel intro"><h2>${f.year}년 ${f.month}월 ESG 데이터 수집 현황</h2><p>이제 입력공간은 분야별로 분리됩니다. 온실가스는 Scope 1·2·3 산정 구조에 맞게, 환경·인사·안전·공급망은 각 분야 특성에 맞는 전용 양식으로 입력합니다.</p></div>
    <div class="kpis">
      <div class="kpi"><div class="label">분야별 입력그룹</div><div class="value">${req}</div><div class="desc">Scope 및 업무영역 기준</div></div>
      <div class="kpi"><div class="label">입력완료</div><div class="value">${doneKeys.size}</div><div class="desc">선택 회사·사업장 기준</div></div>
      <div class="kpi"><div class="label">미입력</div><div class="value">${Math.max(req-doneKeys.size,0)}</div><div class="desc">이번 달 확인 필요</div></div>
      <div class="kpi"><div class="label">증빙등록</div><div class="value">${evidence}</div><div class="desc">파일명 또는 URL 등록</div></div>
    </div>
    <div class="grid2"><div class="panel"><h2>분야별 입력률</h2>${progressRows()}</div><div class="panel"><h2>우선 입력할 항목</h2>${todoList()}</div></div>`;
}

function progressRows(){
  const items = [
    ['온실가스', Object.values(ghgMasters).flatMap(s=>s.groups).map(g=>'ghg:'+g.id)],
    ['환경 일반', areaMasters.environment.groups.map(g=>'environment:'+g.id)],
    ['인사·교육', areaMasters.people.groups.map(g=>'people:'+g.id)],
    ['안전보건', areaMasters.safety.groups.map(g=>'safety:'+g.id)],
    ['공급망·윤리', areaMasters.supply.groups.map(g=>'supply:'+g.id)]
  ];
  const cur = records.filter(baseMatch);
  const done = new Set(cur.map(r=>`${r.area}:${r.group}`));
  return items.map(([name,keys])=>{const rate=Math.round(keys.filter(k=>done.has(k)).length/keys.length*100);return `<div class="progressRow"><b>${name}</b><div class="bar"><span style="width:${rate}%"></span></div><em>${rate}%</em></div>`}).join('');
}

function todoList(){
  const all = [];
  Object.entries(ghgMasters).forEach(([scope,v])=>v.groups.forEach(g=>all.push({page:'ghg', area:'ghg', group:g.id, title:`${v.title} - ${g.name}`, guide:g.guide})));
  Object.entries(areaMasters).forEach(([area,v])=>v.groups.forEach(g=>all.push({page:area, area, group:g.id, title:`${v.title} - ${g.name}`, guide:g.guide})));
  const done = new Set(records.filter(baseMatch).map(r=>`${r.area}:${r.group}`));
  const list = all.filter(x=>!done.has(`${x.area}:${x.group}`)).slice(0,8);
  return list.length ? list.map(x=>`<div class="task"><div><b>${x.title}</b><span>${x.guide}</span></div><button class="btn secondary small" onclick="openPage('${x.page}')">입력</button></div>`).join('') : '<div class="empty">이번 달 필수 입력그룹이 모두 입력되었습니다.</div>';
}

function renderGhg(){
  const tabs = Object.keys(ghgMasters).map(k=>`<button class="scopeTab ${currentScope===k?'active':''}" onclick="setScope('${k}')">${ghgMasters[k].title}</button>`).join('');
  const s = ghgMasters[currentScope];
  $('content').innerHTML = `<div class="panel intro"><h2>온실가스 산정 입력</h2><p>온실가스는 일반 수치 입력이 아니라 <b>Scope → 배출원 분류 → 활동자료 → 배출계수 → 계수 출처 → 산정값</b> 순서로 관리합니다.</p><div class="scopeTabs">${tabs}</div></div><div class="panel"><div class="domainGuide"><div class="guideBox"><b>${s.title}</b><span>${s.desc}</span></div><div class="guideBox"><b>입력 기준</b><span>활동자료 단위와 배출계수 단위를 반드시 같이 남겨야 추후 검증과 보고서 재산정이 가능합니다.</span></div></div>${s.groups.map(g=>renderGhgGroup(currentScope,g)).join('')}</div>`;
}
window.setScope = (s) => { currentScope=s; renderGhg(); };

function renderGhgGroup(scope, g){
  const key = `ghg:${g.id}`;
  const rows = records.filter(r=>baseMatch(r)&&r.area==='ghg'&&r.group===g.id);
  return `<div class="groupBlock"><div class="groupHead"><div><h3>${g.name}</h3><span>${g.guide}</span></div><div>${rows.length?'<span class="status done">입력 '+rows.length+'건</span>':'<span class="status miss">미입력</span>'}</div></div>
    <div class="entryGrid"><div class="entryCard">
      <div class="entryTop"><div><h4>산정자료 입력</h4><p>${g.unit}, 배출계수, 계수 출처를 함께 입력합니다.</p></div><div class="chips"><span class="chip">${scope}</span><span class="chip">${g.factorUnit}</span></div></div>
      <div class="entryFields ghgFields">
        ${selectField(`${g.id}_source`,'배출원/카테고리',g.sources)}
        ${inputField(`${g.id}_amount`,'활동자료','number',g.defaultUnit)}
        ${inputField(`${g.id}_factor`,'배출계수','number',g.factorUnit)}
        ${inputField(`${g.id}_factorSource`,'계수 출처','text','예: 국가 배출계수, EPA, supplier data')}
        ${inputField(`${g.id}_evidence`,'증빙','text','고지서, 산정파일, ERP 자료')}
        <div class="field"><label>비고</label><input id="${g.id}_note" placeholder="산정 특이사항" /></div>
        <div class="saveWrap"><button class="btn green" onclick="saveGhg('${scope}','${g.id}')">저장</button></div>
      </div></div>${renderGhgTable(rows)}</div></div>`;
}

function saveGhg(scope, group){
  const g = ghgMasters[scope].groups.find(x=>x.id===group);
  const amount = +$(`${group}_amount`).value;
  const factor = +$(`${group}_factor`).value;
  if(!amount || !factor){ toast('활동자료와 배출계수를 입력해 주세요.'); return; }
  const rec = {...filter(), area:'ghg', scope, group, groupName:g.name, source:$(`${group}_source`).value, amount, activityUnit:g.defaultUnit, factor, factorUnit:g.factorUnit, emissions: +(amount*factor).toFixed(4), evidence:$(`${group}_evidence`).value.trim(), factorSource:$(`${group}_factorSource`).value.trim(), note:$(`${group}_note`).value.trim(), updatedAt:new Date().toISOString()};
  records.unshift(rec); save(); render(); toast('온실가스 산정자료가 저장되었습니다.');
}
window.saveGhg = saveGhg;

function renderGhgTable(rows){
  if(!rows.length) return '<div class="empty">입력된 산정자료가 없습니다.</div>';
  return `<div class="tableWrap"><table><thead><tr><th>배출원</th><th>활동자료</th><th>배출계수</th><th>산정 배출량</th><th>계수 출처</th><th>증빙</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.source}</td><td>${format(r.amount)} ${r.activityUnit}</td><td>${r.factor} ${r.factorUnit}</td><td><b>${format(r.emissions)}</b> kg/tCO₂eq</td><td>${r.factorSource||'-'}</td><td>${r.evidence||'-'}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderArea(area){
  const m = areaMasters[area];
  $('content').innerHTML = `<div class="panel intro"><h2>${m.title}</h2><p>${m.desc}</p></div><div class="panel">${m.groups.map(g=>renderAreaGroup(area,g)).join('')}</div>`;
}

function renderAreaGroup(area,g){
  const rows = records.filter(r=>baseMatch(r)&&r.area===area&&r.group===g.id);
  return `<div class="groupBlock"><div class="groupHead"><div><h3>${g.name}</h3><span>${g.guide}</span></div><div>${rows.length?'<span class="status done">입력 '+rows.length+'건</span>':'<span class="status miss">미입력</span>'}</div></div><div class="entryGrid"><div class="entryCard"><div class="entryFields">${g.fields.map(f=>fieldHtml(area,g.id,f)).join('')}<div class="saveWrap"><button class="btn green" onclick="saveArea('${area}','${g.id}')">저장</button></div></div></div>${renderAreaTable(area,g,rows)}</div></div>`;
}

function fieldHtml(area, group, f){
  const id = `${area}_${group}_${f[0]}`;
  if(f[2]==='select') return selectField(id,f[1],f[3].split('|'));
  if(f[2]==='fixed') return `<div class="field"><label>${f[1]}</label><div class="unitBox" id="${id}">${f[3]}</div></div>`;
  return inputField(id,f[1],f[2],f[1]);
}
function inputField(id,label,type,placeholder=''){ return `<div class="field"><label>${label}</label><input id="${id}" type="${type}" placeholder="${placeholder}" /></div>`; }
function selectField(id,label,options){ return `<div class="field"><label>${label}</label><select id="${id}">${options.map(o=>`<option>${o}</option>`).join('')}</select></div>`; }

function saveArea(area, groupId){
  const m=areaMasters[area]; const g=m.groups.find(x=>x.id===groupId);
  const data={}; let evidence='';
  for(const f of g.fields){ const id=`${area}_${groupId}_${f[0]}`; const el=$(id); const val=f[2]==='fixed'?f[3]:(el?el.value:''); data[f[0]]=val; if(f[0]==='evidence') evidence=val; }
  const hasValue = Object.entries(data).some(([k,v])=>!['evidence','note','unit'].includes(k) && v!=='' && v!==undefined);
  if(!hasValue){ toast('입력값을 확인해 주세요.'); return; }
  records.unshift({...filter(), area, group:groupId, groupName:g.name, data, evidence, updatedAt:new Date().toISOString()}); save(); render(); toast('저장되었습니다.');
}
window.saveArea = saveArea;

function renderAreaTable(area,g,rows){
  if(!rows.length) return '<div class="empty">입력된 데이터가 없습니다.</div>';
  const headers = g.fields.map(f=>f[1]);
  return `<div class="tableWrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}<th>상태</th></tr></thead><tbody>${rows.map(r=>`<tr>${g.fields.map(f=>`<td>${r.data[f[0]]||'-'}</td>`).join('')}<td>${statusBadge(r)}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderMap(){
  const ghgRows = Object.entries(ghgMasters).flatMap(([scope,s])=>s.groups.map(g=>['환경',s.title,g.name,'온실가스 배출량','GRI 305, CDP, SBTi 산정 기초']))
  const areaRows = Object.entries(areaMasters).flatMap(([area,a])=>a.groups.map(g=>[a.title,g.name,g.guide, reportItem(area,g.id), standard(area)]));
  const rows = [...ghgRows, ...areaRows];
  $('content').innerHTML = `<div class="panel"><h2>보고서 데이터맵</h2><p>입력 화면은 분야별로 나누되, 보고서 작성 시에는 항목별로 다시 집계되도록 연결합니다.</p><div class="tableWrap"><table><thead><tr><th>분야</th><th>구분</th><th>입력그룹</th><th>보고서 항목</th><th>외부 기준</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}
function reportItem(area,group){ const m={environment:'환경성과',people:'임직원 및 교육',safety:'안전보건',supply:'공급망 및 윤리'}; return m[area]||'지속가능경영'; }
function standard(area){ return {environment:'GRI 302/303/305/306, 환경 법규',people:'GRI 2-7, 401, 404, 405',safety:'GRI 403',supply:'GRI 204, 308, 414, 205'}[area]||'-'; }

function renderSettings(){
  $('content').innerHTML = `<div class="panel"><h2>운영형 전환 시 DB 구조</h2><p>현재 화면 구조는 향후 Supabase에서 아래처럼 분리하는 것이 좋습니다.</p><div class="tableWrap"><table><thead><tr><th>테이블</th><th>용도</th><th>주요 필드</th></tr></thead><tbody><tr><td>esg_indicator_groups</td><td>분야별 입력그룹</td><td>area, group, input_cycle, owner_department</td></tr><tr><td>ghg_activity_entries</td><td>온실가스 산정자료</td><td>scope, source, activity_amount, emission_factor, factor_source, emissions</td></tr><tr><td>esg_area_entries</td><td>일반 ESG 데이터</td><td>area, group, field_values, evidence, status</td></tr><tr><td>esg_evidence_files</td><td>증빙자료</td><td>file_name, file_url, related_entry, uploaded_by</td></tr><tr><td>esg_report_mapping</td><td>보고서 기준 매핑</td><td>report_item, gri_code, cdp_section, ecovadis_question</td></tr></tbody></table></div></div>`;
}

function exportData(){ const blob = new Blob([JSON.stringify({exportedAt:new Date().toISOString(),records},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='sems_t_area_based_esg_data.json'; a.click(); URL.revokeObjectURL(a.href); }
async function importData(e){ const file=e.target.files[0]; if(!file)return; try{ const json=JSON.parse(await file.text()); records=Array.isArray(json.records)?json.records:json; save(); render(); toast('데이터를 불러왔습니다.'); }catch(err){ toast('JSON 파일을 확인해 주세요.'); } }

init();
