/* ===== DigitalTogether – Reverse Mentoring App Logic ===== */
/* Alle Daten werden lokal im Browser (localStorage) gespeichert. */

const KEY = 'digitaltogether_v1';

const TOPICS = [
  'Videokonferenzen', 'Team-Chat & Messenger', 'E-Mail & Kalender',
  'Cloud & Dateien teilen', 'Digitale Signaturen', 'Social Media',
  'KI-Tools', 'Smartphone-Apps', 'Online-Sicherheit', 'Office / Tabellen'
];
const STRENGTHS = [
  'Branchenwissen', 'Strukturierte Arbeitsweise', 'Verlässlichkeit',
  'Problemlösung', 'Kundenkontakt', 'Mentoring-Erfahrung',
  'Digitale Affinität', 'Kreativität', 'Geduld', 'Netzwerk'
];

/* Demo-Mentor:innen-Pool für das Matching */
const MENTOR_POOL = [
  { id:'m1', name:'Jonas Becker',  position:'Werkstudent IT', dept:'IT',
    teaches:['Videokonferenzen','Team-Chat & Messenger','KI-Tools','Online-Sicherheit'],
    strengths:['Digitale Affinität','Geduld'], format:'Video-Call', availability:'Nachmittags' },
  { id:'m2', name:'Lena Vogt', position:'Junior Marketing', dept:'Marketing',
    teaches:['Social Media','Smartphone-Apps','Cloud & Dateien teilen','KI-Tools'],
    strengths:['Kreativität','Digitale Affinität'], format:'Persönlich vor Ort', availability:'Vormittags' },
  { id:'m3', name:'Ali Demir', position:'Auszubildender', dept:'Vertrieb',
    teaches:['E-Mail & Kalender','Office / Tabellen','Digitale Signaturen','Cloud & Dateien teilen'],
    strengths:['Geduld','Strukturierte Arbeitsweise'], format:'Flexibel', availability:'Flexibel' },
  { id:'m4', name:'Sophie Klein', position:'Trainee', dept:'HR',
    teaches:['Online-Sicherheit','E-Mail & Kalender','Smartphone-Apps','Videokonferenzen'],
    strengths:['Geduld','Mentoring-Erfahrung'], format:'Video-Call', availability:'Vormittags' }
];

/* ---------- State ---------- */
const blank = { profile:null, mentorId:null, meetings:[], topics:[], feedback:[], results:[] };
let state = load();

function load() {
  try { return Object.assign({}, blank, JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch { return Object.assign({}, blank); }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); renderAll(); }

/* ---------- Helpers ---------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 9);
const esc = s => String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtDate = iso => new Date(iso).toLocaleDateString('de-DE', { day:'2-digit', month:'short', year:'numeric' });
const dayNum = iso => new Date(iso).toLocaleDateString('de-DE', { day:'2-digit' });
const monShort = iso => new Date(iso).toLocaleDateString('de-DE', { month:'short' });
const initials = n => (n||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Tabs ---------- */
$('#tabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab'); if (!btn) return;
  switchTab(btn.dataset.tab);
});
function switchTab(name) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Chips (topics & strengths) ---------- */
function buildChips(containerId, items, selected) {
  const c = $('#' + containerId); c.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'chip' + (selected.includes(item) ? ' on' : '');
    el.textContent = item;
    el.onclick = () => el.classList.toggle('on');
    c.appendChild(el);
  });
}
const chipValues = id => $$('#' + id + ' .chip.on').map(c => c.textContent);

/* ---------- Profile ---------- */
$('#profileForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const topics = chipValues('topicChips');
  if (!topics.length) { toast('Bitte mindestens einen Lernwunsch wählen.'); return; }
  state.profile = {
    name: f.name.value.trim(), department: f.department.value.trim(),
    position: f.position.value.trim(), email: f.email.value.trim(),
    role: f.role.value, topics, strengths: chipValues('strengthChips'),
    format: f.format.value, availability: f.availability.value, goal: f.goal.value.trim()
  };
  if (!state.mentorId) computeMatch(true);
  save();
  toast('Profil gespeichert ✓');
  switchTab('matching');
});

function renderProfileForm() {
  const p = state.profile;
  buildChips('topicChips', TOPICS, p ? p.topics : []);
  buildChips('strengthChips', STRENGTHS, p ? p.strengths : []);
  if (!p) return;
  const f = $('#profileForm');
  f.name.value = p.name || ''; f.department.value = p.department || '';
  f.position.value = p.position || ''; f.email.value = p.email || '';
  f.role.value = p.role || 'mentee'; f.format.value = p.format || 'Flexibel';
  f.availability.value = p.availability || 'Flexibel'; f.goal.value = p.goal || '';
}

function renderProfileSummary() {
  const box = $('#profileSummary'); const p = state.profile;
  if (!p) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  box.innerHTML = `
    <div class="row-between">
      <div style="display:flex;gap:14px;align-items:center">
        <div class="avatar g">${initials(p.name)}</div>
        <div><b style="font-size:1.1rem">${esc(p.name)}</b>
        <div class="sub" style="margin:0">${esc(p.position||'–')} · ${esc(p.department||'–')}</div></div>
      </div>
      <span class="pill ${p.role==='mentor'?'planned':'done'}">${p.role==='mentor'?'Mentor:in':'Mentee'}</span>
    </div>
    <div class="divider"></div>
    <div class="t-date" style="margin-bottom:6px;font-weight:600;color:var(--ink)">Lernwünsche</div>
    <div class="tag-row">${p.topics.map(t=>`<span class="mini-tag">${esc(t)}</span>`).join('')}</div>
    ${p.goal?`<p style="margin-top:14px;color:var(--muted)"><em>„${esc(p.goal)}"</em></p>`:''}`;
  $('#whoami').textContent = '👋 ' + p.name;
}

/* ---------- Matching ---------- */
function scoreMentor(p, m) {
  let s = 0;
  const overlap = m.teaches.filter(t => p.topics.includes(t)).length;
  s += overlap * 25;
  if (m.format === p.format || p.format === 'Flexibel' || m.format === 'Flexibel') s += 12;
  if (m.availability === p.availability || p.availability === 'Flexibel' || m.availability === 'Flexibel') s += 10;
  s += m.strengths.includes('Geduld') ? 6 : 0;
  return { score: Math.min(99, s + 8), overlap };
}

function computeMatch(autoPick) {
  if (!state.profile) return;
  const ranked = MENTOR_POOL.map(m => ({ m, ...scoreMentor(state.profile, m) }))
                            .sort((a, b) => b.score - a.score);
  if (autoPick && !state.mentorId) state.mentorId = ranked[0].m.id;
  return ranked;
}

function renderMatching() {
  const list = $('#matchList');
  if (!state.profile) {
    list.innerHTML = emptyState('Bitte zuerst dein Profil ausfüllen, dann erscheinen hier passende Mentor:innen.');
    return;
  }
  const ranked = computeMatch(false);
  list.innerHTML = ranked.map(({ m, score, overlap }) => {
    const chosen = state.mentorId === m.id;
    const shared = m.teaches.filter(t => state.profile.topics.includes(t));
    return `<div class="match" style="${chosen?'border-color:var(--green);background:var(--green-light)':''}">
      <div class="avatar">${initials(m.name)}</div>
      <div class="match-info">
        <b>${esc(m.name)}</b> ${chosen?'<span class="pill done" style="margin-left:6px">Dein Match</span>':''}
        <div class="role">${esc(m.position)} · ${esc(m.dept)} · ${esc(m.format)}</div>
        <div class="tag-row">${(shared.length?shared:m.teaches.slice(0,3)).map(t=>`<span class="mini-tag">${esc(t)}</span>`).join('')}</div>
      </div>
      <div class="score"><div class="num">${score}%</div><div class="lbl">Match</div></div>
      <button class="btn ${chosen?'btn-ghost':'btn-primary'} btn-sm" onclick="pickMentor('${m.id}')">${chosen?'Ausgewählt':'Auswählen'}</button>
    </div>`;
  }).join('');
}
window.pickMentor = id => {
  state.mentorId = id; save();
  toast('Match bestätigt – jetzt Treffen vereinbaren!');
  switchTab('treffen');
};
$('#rematchBtn').onclick = () => { renderMatching(); toast('Matching aktualisiert.'); };

function currentMentor() { return MENTOR_POOL.find(m => m.id === state.mentorId); }

/* ---------- Meetings ---------- */
function fillPartnerSelects() {
  const m = currentMentor();
  const opts = m ? `<option value="${m.id}">${esc(m.name)} (${esc(m.position)})</option>`
                 : `<option value="">Noch kein Match gewählt</option>`;
  $('#meetingPartner').innerHTML = opts;
}
$('#meetingForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!state.mentorId) { toast('Bitte zuerst im Matching ein Tandem wählen.'); switchTab('matching'); return; }
  const f = e.target;
  state.meetings.push({
    id: uid(), partner: currentMentor().name,
    date: f.date.value, time: f.time.value, format: f.format.value,
    duration: f.duration.value, topic: f.topic.value.trim() || 'Allgemeiner Austausch',
    done: false
  });
  f.reset(); save();
  toast('Treffen eingetragen ✓');
});
function renderMeetings() {
  fillPartnerSelects();
  const list = $('#meetingList');
  if (!state.meetings.length) { list.innerHTML = emptyState('Noch keine Treffen geplant.'); $('#cntTreffen').textContent='0'; return; }
  const sorted = [...state.meetings].sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));
  $('#cntTreffen').textContent = state.meetings.length;
  list.innerHTML = sorted.map(mt => {
    const past = new Date(mt.date + 'T' + (mt.time||'00:00')) < new Date();
    const status = mt.done ? '<span class="pill done">Abgeschlossen</span>'
                  : past ? '<span class="pill open">Offen – Ergebnis festhalten</span>'
                  : '<span class="pill planned">Geplant</span>';
    return `<div class="list-item">
      <div class="when"><div class="d">${dayNum(mt.date)}</div><div class="m">${monShort(mt.date)}</div></div>
      <div class="body">
        <b>${esc(mt.topic)}</b> ${status}<br>
        <span class="meta">${esc(mt.partner)} · ${mt.time} Uhr · ${esc(mt.format)} · ${esc(mt.duration)}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${!mt.done?`<button class="btn btn-outline btn-sm" onclick="completeMeeting('${mt.id}')">Erledigt</button>`:''}
        <button class="btn btn-ghost btn-sm" onclick="delMeeting('${mt.id}')">Löschen</button>
      </div>
    </div>`;
  }).join('');
}
window.completeMeeting = id => { const m = state.meetings.find(x=>x.id===id); if(m){m.done=true; save(); toast('Treffen als abgeschlossen markiert.');} };
window.delMeeting = id => { state.meetings = state.meetings.filter(x=>x.id!==id); save(); };

/* ---------- Topics / Wissensaustausch ---------- */
const STATUSES = ['Offen','In Arbeit','Erreicht'];
$('#topicForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  state.topics.push({ id: uid(), title: f.title.value.trim(), direction: f.direction.value, notes: f.notes.value.trim(), status:'Offen' });
  f.reset(); save();
  toast('Lernthema hinzugefügt ✓');
});
function renderTopics() {
  const list = $('#topicList');
  if (!state.topics.length) { list.innerHTML = emptyState('Noch keine Lernthemen erfasst.'); return; }
  list.innerHTML = state.topics.map(t => `
    <div class="list-item">
      <div class="body">
        <b>${esc(t.title)}</b> <span class="mini-tag">${t.direction==='mentor'?'Ich gebe weiter':'Ich lerne'}</span><br>
        ${t.notes?`<span class="meta">${esc(t.notes)}</span><br>`:''}
        <div style="margin-top:8px;display:flex;gap:6px;align-items:center">
          <span class="meta">Status:</span>
          <select onchange="setTopicStatus('${t.id}', this.value)" style="padding:4px 8px;border-radius:8px;border:1px solid var(--line)">
            ${STATUSES.map(s=>`<option ${s===t.status?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="delTopic('${t.id}')">×</button>
    </div>`).join('');
}
window.setTopicStatus = (id,v) => { const t=state.topics.find(x=>x.id===id); if(t){t.status=v; save(); toast('Status aktualisiert.');} };
window.delTopic = id => { state.topics = state.topics.filter(x=>x.id!==id); save(); };

/* ---------- Feedback ---------- */
$$('#starRate span').forEach(s => {
  s.onclick = () => {
    const v = +s.dataset.v;
    $('#feedbackForm').rating.value = v;
    $$('#starRate span').forEach(x => x.classList.toggle('on', +x.dataset.v <= v));
  };
});
function fillFeedbackRef() {
  const sel = $('#feedbackRef'); const opts = [];
  if (currentMentor()) opts.push(`<option value="tandem">Tandem mit ${esc(currentMentor().name)}</option>`);
  state.meetings.forEach(m => opts.push(`<option value="${m.id}">Treffen: ${esc(m.topic)} (${fmtDate(m.date)})</option>`));
  sel.innerHTML = opts.length ? opts.join('') : '<option value="">Noch kein Treffen / Match</option>';
}
$('#feedbackForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (+f.rating.value === 0) { toast('Bitte eine Sternebewertung wählen.'); return; }
  const refEl = $('#feedbackRef');
  state.feedback.push({
    id: uid(), ref: refEl.options[refEl.selectedIndex]?.text || '–',
    rating: +f.rating.value, positive: f.positive.value.trim(),
    improve: f.improve.value.trim(), date: new Date().toISOString()
  });
  f.reset(); f.rating.value = 0; $$('#starRate span').forEach(x=>x.classList.remove('on'));
  save();
  toast('Danke für dein Feedback ✓');
});
function renderFeedback() {
  fillFeedbackRef();
  const list = $('#feedbackList');
  if (!state.feedback.length) { list.innerHTML = emptyState('Noch kein Feedback abgegeben.'); return; }
  list.innerHTML = [...state.feedback].reverse().map(fb => `
    <div class="list-item" style="align-items:flex-start">
      <div class="body">
        <div class="stars" style="font-size:1.1rem">${'★'.repeat(fb.rating).padEnd(fb.rating)}<span style="color:var(--line)">${'★'.repeat(5-fb.rating)}</span></div>
        <b>${esc(fb.ref)}</b><div class="t-date">${fmtDate(fb.date)}</div>
        ${fb.positive?`<div class="meta" style="margin-top:6px">👍 ${esc(fb.positive)}</div>`:''}
        ${fb.improve?`<div class="meta">🔧 ${esc(fb.improve)}</div>`:''}
      </div>
      <button class="btn btn-ghost btn-sm" onclick="delFeedback('${fb.id}')">×</button>
    </div>`).join('');
}
window.delFeedback = id => { state.feedback = state.feedback.filter(x=>x.id!==id); save(); };

/* ---------- Results & Tracking ---------- */
$('#resultForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  state.results.push({ id: uid(), title: f.title.value.trim(), desc: f.desc.value.trim(), date: new Date().toISOString() });
  f.reset(); save();
  toast('Ergebnis festgehalten 🎉');
});
window.delResult = id => { state.results = state.results.filter(x=>x.id!==id); save(); };

function renderResults() {
  /* Stats */
  const achieved = state.topics.filter(t=>t.status==='Erreicht').length;
  const totalTopics = state.topics.length;
  const avg = state.feedback.length
    ? (state.feedback.reduce((a,b)=>a+b.rating,0)/state.feedback.length).toFixed(1) : '–';
  $('#statRow').innerHTML = `
    <div class="stat"><div class="big">${state.meetings.filter(m=>m.done).length}/${state.meetings.length}</div><div class="lbl">Treffen abgeschlossen</div></div>
    <div class="stat"><div class="big">${achieved}/${totalTopics||0}</div><div class="lbl">Lernziele erreicht</div></div>
    <div class="stat"><div class="big">${avg}${avg!=='–'?' ★':''}</div><div class="lbl">Ø Feedback</div></div>`;

  /* Progress per topic */
  const pl = $('#progressList');
  if (!totalTopics) { pl.innerHTML = emptyState('Noch keine Lernthemen zum Tracken.'); }
  else {
    const pct = { 'Offen':10, 'In Arbeit':55, 'Erreicht':100 };
    pl.innerHTML = state.topics.map(t => `
      <div style="margin-bottom:16px">
        <div class="row-between"><b>${esc(t.title)}</b><span class="meta">${t.status}</span></div>
        <div class="progress"><span style="width:${pct[t.status]}%"></span></div>
      </div>`).join('');
  }

  /* Results list */
  const rl = $('#resultList');
  rl.innerHTML = state.results.length ? state.results.map(r=>`
    <div class="list-item">
      <div class="when" style="background:var(--green);color:#fff"><div class="d" style="color:#fff">🏆</div></div>
      <div class="body"><b>${esc(r.title)}</b><div class="t-date">${fmtDate(r.date)}</div>
      ${r.desc?`<div class="meta">${esc(r.desc)}</div>`:''}</div>
      <button class="btn btn-ghost btn-sm" onclick="delResult('${r.id}')">×</button>
    </div>`).join('') : emptyState('Noch keine Ergebnisse dokumentiert.');
}

/* ---------- Shared ---------- */
function emptyState(msg) {
  return `<div class="empty">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
    <p>${msg}</p></div>`;
}

function renderAll() {
  renderProfileSummary();
  renderMatching();
  renderMeetings();
  renderTopics();
  renderFeedback();
  renderResults();
}

/* ---------- Reset ---------- */
$('#resetBtn').onclick = () => {
  if (confirm('Wirklich alle lokal gespeicherten Daten löschen?')) {
    localStorage.removeItem(KEY);
    state = Object.assign({}, blank);
    renderProfileForm(); renderAll();
    switchTab('profil');
    toast('Alle Daten zurückgesetzt.');
  }
};

/* ---------- Init ---------- */
renderProfileForm();
renderAll();
