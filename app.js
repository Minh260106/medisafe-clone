// app.js - logic cho ứng dụng quản lý nhắc uống thuốc
// Lưu trữ dữ liệu mẫu vào localStorage nếu chưa có
const STORAGE_KEY = 'meds_db_v1';
const HISTORY_KEY = 'meds_history_v1';

// ---------- Mock data (được sử dụng khi localStorage rỗng) ----------
const mockMeds = [
  {
    id: genId(),
    name: 'Paracetamol',
    dose: '500',
    unit: 'mg',
    timesPerDay: 3,
    times: ['08:00','13:00','20:00'],
    startDate: '',
    endDate: '',
    note: 'Uống sau ăn'
  },
  {
    id: genId(),
    name: 'Vitamin D',
    dose: '1',
    unit: 'viên',
    timesPerDay: 1,
    times: ['09:00'],
    startDate: '',
    endDate: '',
    note: ''
  }
];

// ---------- Helper utilities ----------
function genId(){return 'm_'+Math.random().toString(36).slice(2,9)}
function saveMeds(meds){localStorage.setItem(STORAGE_KEY, JSON.stringify(meds))}
function loadMeds(){const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):null}
function saveHistory(h){localStorage.setItem(HISTORY_KEY, JSON.stringify(h))}
function loadHistory(){const raw=localStorage.getItem(HISTORY_KEY);return raw?JSON.parse(raw):[]}

// Ensure initial data
if(!loadMeds()){saveMeds(mockMeds)}

// ---------- DOM refs ----------
const views = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('.nav-btn');
const scheduleEl = document.getElementById('schedule');
const todayDateEl = document.getElementById('todayDate');
const medListEl = document.getElementById('medList');
const medForm = document.getElementById('medForm');
const medIdInput = document.getElementById('medId');
const cancelBtn = document.getElementById('cancelBtn');
const historyEl = document.getElementById('history');
const nextMedEl = document.getElementById('nextMed');
const totalMedsEl = document.getElementById('totalMeds');
const miniHistoryEl = document.getElementById('miniHistory');

// Charts
let lineChart = null; let pieChart = null;

// ---------- Navigation ----------
navBtns.forEach(btn=>btn.addEventListener('click', ()=>{
  navBtns.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  showView(btn.dataset.view);
}));

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
const mainNav = document.querySelector('.main-nav');
if(mobileMenuBtn){
  mobileMenuBtn.addEventListener('click', ()=>{
    mainNav.classList.toggle('open');
  });
  // close menu when a nav item is clicked
  document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click', ()=>{ if(mainNav.classList.contains('open')) mainNav.classList.remove('open'); }));
}

function showView(name){
  views.forEach(v=>v.classList.add('hidden'));
  const view = document.getElementById(name);
  if(view){
    view.classList.remove('hidden');
  }
  // when showing a view, render its content
  if(name==='dashboard') renderDashboard();
  if(name==='meds') renderMeds();
  if(name==='add') renderForm();
  if(name==='stats') renderStats();
}

// Initialize
document.addEventListener('DOMContentLoaded', ()=>{
  showView('dashboard');
});

// ---------- Dashboard rendering ----------
function renderDashboard(){
  const meds = loadMeds() || [];
  const history = loadHistory();
  // show today's date
  const today = new Date();
  todayDateEl.textContent = today.toLocaleDateString();
  totalMedsEl.textContent = meds.length;

  // build schedule entries for today: flatten by times
  const entries = [];
  meds.forEach(m=>{
    m.times.forEach(t=>{
      entries.push({
        medId: m.id,
        name: m.name,
        dose: m.dose,
        unit: m.unit,
        time: t
      })
    })
  });
  // sort by time
  entries.sort((a,b)=>a.time.localeCompare(b.time));

  const todayKey = (new Date()).toISOString().slice(0,10);

  const nextEntry = entries.find(e=>{
    const record = history.find(h=>h.medId===e.medId && h.time===e.time && h.date===todayKey);
    return !record;
  });
  nextMedEl.textContent = nextEntry
    ? `${nextEntry.time} - ${nextEntry.name} (${nextEntry.dose} ${nextEntry.unit})`
    : 'Hôm nay không còn nhắc nào chưa uống';

  miniHistoryEl.innerHTML = '';
  history.slice(0,5).forEach(h=>{
    const med = meds.find(m=>m.id===h.medId);
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `<div>${med ? med.name : '(đã xóa)'} <span class="muted">${h.time}</span></div><div>${h.status==='taken' ? '<span style="color:var(--accent)">Đã uống</span>' : '<span style="color:var(--danger)">Bỏ lỡ</span>'}</div>`;
    miniHistoryEl.appendChild(li);
  });

  scheduleEl.innerHTML = '';
  if(entries.length===0){ scheduleEl.innerHTML = '<div class="muted">Không có lịch hôm nay.</div>'; return }

  entries.forEach(e=>{
    const takenRecord = history.find(h=>h.medId===e.medId && h.time===e.time && h.date===todayKey);
    const status = takenRecord? takenRecord.status : 'pending'; // pending, taken, missed

    const slot = document.createElement('div'); slot.className='slot';
    const left = document.createElement('div'); left.className='slot-left';
    const timeBadge = document.createElement('div'); timeBadge.className='time-badge'; timeBadge.textContent = e.time;
    const medInfo = document.createElement('div'); medInfo.className='med-info';
    const name = document.createElement('div'); name.className='med-name'; name.textContent = e.name;
    const meta = document.createElement('div'); meta.className='med-meta'; meta.textContent = `${e.dose} ${e.unit}`;
    medInfo.appendChild(name); medInfo.appendChild(meta);
    left.appendChild(timeBadge); left.appendChild(medInfo);

    const actions = document.createElement('div'); actions.className='slot-actions';
    const btn = document.createElement('button'); btn.className='btn primary'; btn.textContent='Đã uống';
    btn.setAttribute('aria-label', `Đã uống ${e.name} lúc ${e.time}`);
    btn.addEventListener('click', ()=>{markTaken(e.medId, e.time);renderDashboard();});

    const statusBadge = document.createElement('div'); statusBadge.className='med-meta';
    if(status==='taken'){ statusBadge.textContent='Đã uống'; statusBadge.style.color='var(--accent)'; }
    else if(status==='missed'){ statusBadge.textContent='Bỏ lỡ'; statusBadge.style.color='var(--danger)'; }
    else { statusBadge.textContent='Chưa đến giờ'; }

    actions.appendChild(statusBadge);
    actions.appendChild(btn);

    slot.appendChild(left); slot.appendChild(actions);
    scheduleEl.appendChild(slot);
  });
}

// Mark a med as taken now and record in history
function markTaken(medId,time){
  const hist = loadHistory();
  const todayKey = (new Date()).toISOString().slice(0,10);
  // add record
  hist.unshift({id: 'h_'+Math.random().toString(36).slice(2,9), medId, time, date: todayKey, status:'taken', ts: Date.now()});
  // cap history length
  if(hist.length>500) hist.length=500;
  saveHistory(hist);
  // provide small visual feedback (toast could be added)
}

// ---------- Meds list ----------
function renderMeds(){
  const meds = loadMeds()||[];
  medListEl.innerHTML='';
  if(meds.length===0){ medListEl.innerHTML='<div class="muted">Chưa có thuốc nào. Hãy thêm thuốc mới.</div>'; return }
  meds.forEach(m=>{
    const card = document.createElement('div'); card.className='med-card';
    const row = document.createElement('div'); row.className='card-row';
    const left = document.createElement('div');
    const title = document.createElement('div'); title.className='med-name'; title.textContent = m.name;
    const meta = document.createElement('div'); meta.className='med-meta'; meta.textContent = `${m.dose} ${m.unit} — ${m.timesPerDay} lần/ngày`;
    left.appendChild(title); left.appendChild(meta);

    const actions = document.createElement('div');
    const edit = document.createElement('button'); edit.className='btn secondary'; edit.textContent='Sửa'; edit.addEventListener('click', ()=>{openEdit(m.id)});
    const del = document.createElement('button'); del.className='btn danger'; del.textContent='Xóa'; del.addEventListener('click', ()=>{deleteMed(m.id)});
    actions.appendChild(edit); actions.appendChild(del);

    row.appendChild(left); row.appendChild(actions);
    card.appendChild(row);
    if(m.note){ const note = document.createElement('div'); note.className='med-meta mt'; note.textContent = 'Ghi chú: '+m.note; card.appendChild(note) }
    medListEl.appendChild(card);
  })
}

function openEdit(id){
  const meds = loadMeds()||[]; const med = meds.find(x=>x.id===id); if(!med) return;
  medIdInput.value = med.id; document.getElementById('name').value = med.name; document.getElementById('dose').value = med.dose;
  document.getElementById('unit').value = med.unit; document.getElementById('timesPerDay').value = med.timesPerDay;
  document.getElementById('times').value = med.times.join(','); document.getElementById('startDate').value = med.startDate;
  document.getElementById('endDate').value = med.endDate; document.getElementById('note').value = med.note;
  // switch view
  navBtns.forEach(b=>b.classList.remove('active')); document.querySelector('[data-view="add"]').classList.add('active');
  showView('add');
}

function deleteMed(id){
  if(!confirm('Bạn có chắc muốn xóa thuốc này?')) return;
  let meds = loadMeds()||[]; meds = meds.filter(m=>m.id!==id); saveMeds(meds); renderMeds();
}

// ---------- Form handling (Add / Edit) ----------
medForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const id = medIdInput.value;
  const name = document.getElementById('name').value.trim();
  const dose = document.getElementById('dose').value.trim();
  const unit = document.getElementById('unit').value.trim();
  const timesPerDay = Number(document.getElementById('timesPerDay').value);
  const times = document.getElementById('times').value.split(',').map(s=>s.trim()).filter(Boolean);
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const note = document.getElementById('note').value.trim();

  // basic validation
  if(!name || !dose || times.length===0){
    alert('Vui lòng điền tên, liều và giờ uống ít nhất một lần.');
    return;
  }

  let meds = loadMeds()||[];
  if(id){
    // edit
    const idx = meds.findIndex(m=>m.id===id);
    if(idx>-1){
      meds[idx] = { ...meds[idx], name, dose, unit, timesPerDay, times, startDate, endDate, note };
    }
  } else {
    // add
    meds.push({id: genId(), name, dose, unit, timesPerDay, times, startDate, endDate, note});
  }
  saveMeds(meds);
  // reset and go to list
  medForm.reset(); medIdInput.value='';
  navBtns.forEach(b=>b.classList.remove('active')); document.querySelector('[data-view="meds"]').classList.add('active');
  showView('meds');
});

cancelBtn.addEventListener('click', ()=>{ medForm.reset(); medIdInput.value=''; navBtns.forEach(b=>b.classList.remove('active')); document.querySelector('[data-view="dashboard"]').classList.add('active'); showView('dashboard'); })

function renderForm(){
  // prepare form for adding new med
  medForm.reset(); medIdInput.value='';
}

// ---------- Stats ----------
function renderStats(){
  const history = loadHistory();
  const meds = loadMeds()||[];

  // compute counts for pie chart (recent period)
  const recent = history.slice(0,60); // recent records
  const taken = recent.filter(r=>r.status==='taken').length;
  const missed = recent.filter(r=>r.status==='missed').length;
  const pending = Math.max(0, 0 + (recent.length - taken - missed));

  const pieCtx = document.getElementById('pieChart').getContext('2d');
  if(pieChart) pieChart.destroy();
  pieChart = new Chart(pieCtx, {
    type: 'doughnut',
    data:{labels:['Đã uống','Bỏ lỡ','Chưa đến giờ'],datasets:[{data:[taken,missed,pending],backgroundColor:['#3fb871','#e65a4a','#2b9ed6']}]} ,
    options:{plugins:{legend:{position:'bottom'}}}
  });

  // line chart: weekly % compliance (last 8 weeks)
  const weeks = getWeeklyCompliance();
  const labels = weeks.map(w=>w.label);
  const data = weeks.map(w=>w.rate);
  const lineCtx = document.getElementById('lineChart').getContext('2d');
  if(lineChart) lineChart.destroy();
  lineChart = new Chart(lineCtx, {
    type:'line',
    data:{labels, datasets:[{label:'% Tuân thủ',data,fill:true,backgroundColor:'rgba(43,158,214,0.12)',borderColor:'rgba(43,158,214,0.95)',tension:0.3}]},
    options:{scales:{y:{min:0,max:100}}}
  });

  // render recent history list
  historyEl.innerHTML='';
  history.slice(0,30).forEach(h=>{
    const med = meds.find(m=>m.id===h.medId);
    const li = document.createElement('li'); li.className='history-item';
    li.innerHTML = `<div>${med?med.name:'(đã xóa)'} <span class="muted">${h.time}</span></div><div>${h.status==='taken'?'<span style="color:var(--accent)">Đã uống</span>':'<span style="color:var(--danger)">Bỏ lỡ</span>'}</div>`;
    historyEl.appendChild(li);
  })
}

// Compute weekly compliance for last 8 weeks
function getWeeklyCompliance(){
  const history = loadHistory();
  const weeks=[];
  const now = new Date();
  for(let i=7;i>=0;i--){
    const start = new Date(); start.setDate(now.getDate()-7*i-6); start.setHours(0,0,0,0);
    const end = new Date(); end.setDate(now.getDate()-7*i); end.setHours(23,59,59,999);
    const slice = history.filter(h=>{ const d = new Date(h.date); return d>=start && d<=end });
    const total = slice.length || 0;
    const taken = slice.filter(s=>s.status==='taken').length;
    const rate = total? Math.round((taken/total)*100) : 0;
    weeks.push({label:formatWeekLabel(start,end), rate});
  }
  return weeks;
}
function formatWeekLabel(s,e){
  const opts={month:'short',day:'numeric'};
  return `${s.toLocaleDateString(undefined,opts)} - ${e.toLocaleDateString(undefined,opts)}`;
}

// ---------- Extra: simple auto-mark missed (optional) ----------
// Not implemented: background scheduler. In a real app, would check times and mark missed after window.

// ---------- Accessibility: keyboard nav for nav buttons ----------
document.addEventListener('keyup', (e)=>{
  if(e.key==='1') document.querySelector('[data-view="dashboard"]').click();
  if(e.key==='2') document.querySelector('[data-view="meds"]').click();
  if(e.key==='3') document.querySelector('[data-view="add"]').click();
  if(e.key==='4') document.querySelector('[data-view="stats"]').click();
});

// End of file
