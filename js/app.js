/* ===== DigitalTogether – Relational Mentoring App Logic ===== */
/* Alle Daten werden lokal im Browser (localStorage) gespeichert. */

const KEY = 'digitaltogether_v2';

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

/* Demo-Mentor:innen-Pool für das Matching (Oldie-Sicht) */
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

/* Demo-Mentees für die Mentor-Sicht */
const MENTEE_POOL = [
  { id:'e1', name:'Renate Hoffmann', position:'Teamleitung', dept:'Vertrieb',
    topics:['Videokonferenzen','Online-Sicherheit','Team-Chat & Messenger'],
    format:'Persönlich vor Ort', availability:'Vormittags', goal:'Sicher mit Videokonferenzen umgehen.' },
  { id:'e2', name:'Werner Krause', position:'Sachbearbeiter', dept:'Buchhaltung',
    topics:['Office / Tabellen','Cloud & Dateien teilen','Digitale Signaturen'],
    format:'Video-Call', availability:'Nachmittags', goal:'Rechnungen digital signieren und ablegen.' }
];

/* ---------- State ---------- */
const blank = {
  session: null,                 // { role:'oldie'|'mentor', name }
  menteeProfile: null,           // Profil des Oldies
  mentorProfile: null,           // Profil des Mentors
  mentorId: null,                // vom Oldie gewähltes Tandem
  menteeId: null,                // vom Mentor gewähltes Tandem
  meetings: [], topics: [], feedback: [], results: []
};
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
const isOldie = () => state.session && state.session.role === 'oldie';

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* current profile = the profile of the logged-in role */
function myProfile() { return isOldie() ? state.menteeProfile : state.mentorProfile; }
function setMyProfile(p) { if (isOldie()) state.menteeProfile = p; else state.mentorProfile = p; }

/* ========================================================= */
/* LOGIN                                                     */
/* ========================================================= */
let pickedRole = null;
$('#rolePick').addEventListener('click', e => {
  const opt = e.target.closest('.role-opt'); if (!opt) return;
  pickedRole = opt.dataset.role;
  $$('.role-opt').forEach(o => o.classList.toggle('sel', o === opt));
});
$('#loginBtn').addEventListener('click', () => {
  const name = $('#loginName').value.trim();
  if (!pickedRole) { toast('Bitte Oldie oder Mentor wählen.'); return; }
  if (!name) { toast('Bitte deinen Namen eingeben.'); return; }
  state.session = { role: pickedRole, name };
  // Falls noch kein Profil existiert, Namen vorbefüllen
  if (!myProfile()) setMyProfile({ name, topics: [], strengths: [] });
  save();
  applySession();
  toast('Angemeldet als ' + (pickedRole === 'oldie' ? 'Oldie' : 'Mentor'));
});
$('#logoutBtn').addEventListener('click', () => {
  state.session = null; save(); applySession();
});

function applySession() {
  const s = state.session;
  $('#loginOverlay').classList.toggle('hide', !!s);
  if (!s) { pickedRole = null; $('#loginName').value=''; $$('.role-opt').forEach(o=>o.classList.remove('sel')); return; }

  const oldie = s.role === 'oldie';
  $('#roleBadge').innerHTML = `<span class="role-badge ${s.role}">${oldie
    ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/></svg> Oldie'
    : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L3 7l9 5 9-5-9-5z"/></svg> Mentor'} · ${esc(s.name)}</span>`;

  // Labels je nach Rolle anpassen
  $('#pageTitle').textContent = oldie ? 'Mein Mentoring-Bereich' : 'Mein Mentor-Bereich';
  $('#pageSub').textContent = oldie
    ? 'Profil pflegen, Match finden, Treffen planen und Fortschritt festhalten.'
    : 'Profil pflegen, Mentees begleiten, Treffen planen und Fortschritt festhalten.';
  $('#profileFormTitle').textContent = oldie ? 'Anmeldung & Profil' : 'Mein Mentor-Profil';
  $('#topicLabel').textContent = oldie
    ? 'Worüber möchtest du gern lernen? (Lernwünsche)'
    : 'Welche digitalen Kompetenzen gibst du weiter?';
  $('#goalLabel').textContent = oldie ? 'Dein Ziel in einem Satz' : 'Womit kannst du am besten unterstützen?';
  $('#profileSubmit').textContent = oldie ? 'Profil speichern & Matching starten' : 'Profil speichern & Mentees ansehen';
  $('[data-label="matching"]').textContent = oldie ? 'Matching' : 'Meine Mentees';
  $('#matchTitle').textContent = oldie ? 'Dein Matching' : 'Meine Mentees';
  $('#matchSub').textContent = oldie
    ? 'Auf Basis deiner Lernwünsche, Stärken und Verfügbarkeit.'
    : 'Diese Oldies passen zu deinen Kompetenzen.';

  renderProfileForm();
  renderAll();
  switchTab(myProfile() && (myProfile().topics||[]).length ? 'matching' : 'profil');
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

/* ---------- Chips ---------- */
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
  if (!topics.length) { toast('Bitte mindestens ein Thema wählen.'); return; }
  setMyProfile({
    name: f.name.value.trim(), department: f.department.value.trim(),
    position: f.position.value.trim(), email: f.email.value.trim(),
    role: state.session.role, topics, strengths: chipValues('strengthChips'),
    format: f.format.value, availability: f.availability.value, goal: f.goal.value.trim()
  });
  if (isOldie() && !state.mentorId) computeMatch(true);
  save();
  toast('Profil gespeichert ✓');
  switchTab('matching');
});

function renderProfileForm() {
  const p = myProfile();
  buildChips('topicChips', TOPICS, p ? (p.topics||[]) : []);
  buildChips('strengthChips', STRENGTHS, p ? (p.strengths||[]) : []);
  const f = $('#profileForm');
  if (!p) { f.reset(); return; }
  f.name.value = p.name || ''; f.department.value = p.department || '';
  f.position.value = p.position || ''; f.email.value = p.email || '';
  f.format.value = p.format || 'Flexibel';
  f.availability.value = p.availability || 'Flexibel'; f.goal.value = p.goal || '';
}

function renderProfileSummary() {
  const box = $('#profileSummary'); const p = myProfile();
  if (!p || !p.topics || !p.topics.length) { box.style.display = 'none'; return; }
  const oldie = isOldie();
  box.style.display = 'block';
  box.innerHTML = `
    <div class="row-between">
      <div style="display:flex;gap:14px;align-items:center">
        <div class="avatar ${oldie?'g':''}">${initials(p.name)}</div>
        <div><b style="font-size:1.1rem">${esc(p.name)}</b>
        <div class="sub" style="margin:0">${esc(p.position||'–')} · ${esc(p.department||'–')}</div></div>
      </div>
      <span class="role-badge ${state.session.role}">${oldie?'Oldie':'Mentor'}</span>
    </div>
    <div class="divider"></div>
    <div class="t-date" style="margin-bottom:6px;font-weight:600;color:var(--ink)">${oldie?'Lernwünsche':'Kompetenzen'}</div>
    <div class="tag-row">${p.topics.map(t=>`<span class="mini-tag">${esc(t)}</span>`).join('')}</div>
    ${p.goal?`<p style="margin-top:14px;color:var(--muted)"><em>„${esc(p.goal)}"</em></p>`:''}`;
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
/* Mentor-Sicht: Wie gut passt ein Mentee zu meinen Kompetenzen */
function scoreMentee(myP, mentee) {
  const overlap = mentee.topics.filter(t => (myP.topics||[]).includes(t)).length;
  let s = overlap * 28 + 14;
  if (mentee.format === myP.format || myP.format==='Flexibel') s += 10;
  return Math.min(99, s);
}

function computeMatch(autoPick) {
  const p = state.menteeProfile; if (!p) return [];
  const ranked = MENTOR_POOL.map(m => ({ m, ...scoreMentor(p, m) })).sort((a, b) => b.score - a.score);
  if (autoPick && !state.mentorId) state.mentorId = ranked[0].m.id;
  return ranked;
}

function renderMatching() {
  const list = $('#matchList');
  const p = myProfile();
  if (!p || !(p.topics||[]).length) {
    list.innerHTML = emptyState('Bitte zuerst dein Profil ausfüllen.');
    return;
  }

  if (isOldie()) {
    const ranked = computeMatch(false);
    list.innerHTML = ranked.map(({ m, score }) => {
      const chosen = state.mentorId === m.id;
      const shared = m.teaches.filter(t => p.topics.includes(t));
      return matchRow({
        name:m.name, sub:`${m.position} · ${m.dept} · ${m.format}`,
        tags: shared.length?shared:m.teaches.slice(0,3), score, chosen,
        action:`pickMentor('${m.id}')`, label: chosen?'Ausgewählt':'Auswählen', green:false
      });
    }).join('');
  } else {
    // Mentor-Sicht: Mentees (echtes Oldie-Profil falls vorhanden + Demo-Pool)
    const pool = [...MENTEE_POOL];
    if (state.menteeProfile && (state.menteeProfile.topics||[]).length) {
      pool.unshift({ id:'self', ...state.menteeProfile });
    }
    list.innerHTML = pool.map(mentee => {
      const score = scoreMentee(p, mentee);
      const chosen = state.menteeId === mentee.id;
      const shared = (mentee.topics||[]).filter(t => (p.topics||[]).includes(t));
      return matchRow({
        name:mentee.name, sub:`${mentee.position||''} · ${mentee.dept||''}`,
        tags: shared.length?shared:(mentee.topics||[]).slice(0,3), score, chosen,
        action:`pickMentee('${mentee.id}')`, label: chosen?'Ausgewählt':'Begleiten', green:true
      });
    }).join('');
  }
}
function matchRow({name, sub, tags, score, chosen, action, label, green}) {
  return `<div class="match" style="${chosen?'border-color:var(--green);background:var(--green-light)':''}">
    <div class="avatar ${green?'g':''}">${initials(name)}</div>
    <div class="match-info">
      <b>${esc(name)}</b> ${chosen?'<span class="pill done" style="margin-left:6px">Tandem</span>':''}
      <div class="role">${esc(sub)}</div>
      <div class="tag-row">${tags.map(t=>`<span class="mini-tag">${esc(t)}</span>`).join('')}</div>
    </div>
    <div class="score"><div class="num">${score}%</div><div class="lbl">Match</div></div>
    <button class="btn ${chosen?'btn-ghost':'btn-primary'} btn-sm" onclick="${action}">${label}</button>
  </div>`;
}
window.pickMentor = id => { state.mentorId = id; save(); toast('Match bestätigt – jetzt Treffen vereinbaren!'); switchTab('treffen'); };
window.pickMentee = id => { state.menteeId = id; save(); toast('Mentee ausgewählt – jetzt Treffen vereinbaren!'); switchTab('treffen'); };

function currentMentor() { return MENTOR_POOL.find(m => m.id === state.mentorId); }
function currentMentee() {
  if (state.menteeId === 'self') return state.menteeProfile;
  return MENTEE_POOL.find(m => m.id === state.menteeId);
}
/* Partnername aus Sicht der aktuellen Rolle */
function partnerName() {
  if (isOldie()) return currentMentor() ? currentMentor().name : null;
  return currentMentee() ? currentMentee().name : null;
}

/* ---------- Meetings + Regeltermine ---------- */
$('#recurrenceSel').addEventListener('change', e => {
  $('#occField').style.display = e.target.value === 'none' ? 'none' : 'block';
});
function fillPartnerSelects() {
  const name = partnerName();
  $('#meetingPartner').innerHTML = name
    ? `<option value="${esc(name)}">${esc(name)}</option>`
    : `<option value="">Noch kein Tandem gewählt</option>`;
}
const RECUR_LABEL = { none:'Einmalig', weekly:'Wöchentlich', biweekly:'Alle 2 Wochen', monthly:'Monatlich' };
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate()+n); return d; }
function addMonths(date, n) { const d = new Date(date); d.setMonth(d.getMonth()+n); return d; }

$('#meetingForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!partnerName()) { toast('Bitte zuerst ein Tandem wählen.'); switchTab('matching'); return; }
  const f = e.target;
  const recurrence = f.recurrence.value;
  const occ = recurrence === 'none' ? 1 : parseInt(f.occurrences.value, 10);
  const seriesId = recurrence === 'none' ? null : uid();
  const base = new Date(f.date.value + 'T' + f.time.value);
  const common = {
    partner: partnerName(), time: f.time.value, format: f.format.value,
    duration: f.duration.value, topic: f.topic.value.trim() || 'Allgemeiner Austausch',
    recurrence, seriesId
  };
  for (let i = 0; i < occ; i++) {
    let d;
    if (recurrence === 'weekly') d = addDays(base, i*7);
    else if (recurrence === 'biweekly') d = addDays(base, i*14);
    else if (recurrence === 'monthly') d = addMonths(base, i);
    else d = base;
    state.meetings.push({ id: uid(), ...common, date: d.toISOString().slice(0,10), done:false });
  }
  f.reset(); $('#occField').style.display='none'; save();
  toast(recurrence==='none' ? 'Treffen eingetragen ✓' : `${occ} Regeltermine eingetragen ✓`);
});

function renderMeetings() {
  fillPartnerSelects();
  const list = $('#meetingList');
  if (!state.meetings.length) { list.innerHTML = emptyState('Noch keine Treffen geplant.'); $('#cntTreffen').textContent='0'; return; }
  $('#cntTreffen').textContent = state.meetings.length;
  const sorted = [...state.meetings].sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));
  list.innerHTML = sorted.map(mt => {
    const past = new Date(mt.date + 'T' + (mt.time||'00:00')) < new Date();
    const status = mt.done ? '<span class="pill done">Abgeschlossen</span>'
                  : past ? '<span class="pill open">Offen – Ergebnis festhalten</span>'
                  : '<span class="pill planned">Geplant</span>';
    const recur = mt.recurrence && mt.recurrence !== 'none'
      ? `<span class="recur-badge">↻ ${RECUR_LABEL[mt.recurrence]}</span>` : '';
    return `<div class="list-item">
      <div class="when"><div class="d">${dayNum(mt.date)}</div><div class="m">${monShort(mt.date)}</div></div>
      <div class="body">
        <b>${esc(mt.topic)}</b> ${status} ${recur}<br>
        <span class="meta">${esc(mt.partner)} · ${mt.time} Uhr · ${esc(mt.format)} · ${esc(mt.duration)}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${!mt.done?`<button class="btn btn-outline btn-sm" onclick="completeMeeting('${mt.id}')">Erledigt</button>`:''}
        <button class="btn btn-ghost btn-sm" onclick="delMeeting('${mt.id}', ${mt.seriesId?`'${mt.seriesId}'`:'null'})">Löschen</button>
      </div>
    </div>`;
  }).join('');
}
window.completeMeeting = id => { const m = state.meetings.find(x=>x.id===id); if(m){m.done=true; save(); toast('Treffen abgeschlossen.');} };
window.delMeeting = (id, seriesId) => {
  if (seriesId && confirm('Ganze Terminserie löschen? (Abbrechen = nur dieses Treffen)')) {
    state.meetings = state.meetings.filter(x => x.seriesId !== seriesId);
  } else {
    state.meetings = state.meetings.filter(x => x.id !== id);
  }
  save();
};

/* ---------- Topics ---------- */
const STATUSES = ['Offen','In Arbeit','Erreicht'];
$('#topicForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  state.topics.push({ id: uid(), title: f.title.value.trim(), direction: f.direction.value, notes: f.notes.value.trim(), status:'Offen' });
  f.reset(); save(); toast('Lernthema hinzugefügt ✓');
});
function renderTopics() {
  const list = $('#topicList');
  if (!state.topics.length) { list.innerHTML = emptyState('Noch keine Lernthemen erfasst.'); return; }
  list.innerHTML = state.topics.map(t => `
    <div class="list-item">
      <div class="body">
        <b>${esc(t.title)}</b> <span class="mini-tag">${t.direction==='mentor'?'Oldie → Mentor':'Mentor → Oldie'}</span><br>
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
  if (partnerName()) opts.push(`<option value="tandem">Tandem mit ${esc(partnerName())}</option>`);
  state.meetings.forEach(m => opts.push(`<option value="${m.id}">Treffen: ${esc(m.topic)} (${fmtDate(m.date)})</option>`));
  sel.innerHTML = opts.length ? opts.join('') : '<option value="">Noch kein Treffen / Tandem</option>';
}
$('#feedbackForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (+f.rating.value === 0) { toast('Bitte eine Sternebewertung wählen.'); return; }
  const refEl = $('#feedbackRef');
  state.feedback.push({
    id: uid(), ref: refEl.options[refEl.selectedIndex]?.text || '–',
    role: state.session.role, author: state.session.name,
    rating: +f.rating.value, positive: f.positive.value.trim(),
    improve: f.improve.value.trim(), date: new Date().toISOString()
  });
  f.reset(); f.rating.value = 0; $$('#starRate span').forEach(x=>x.classList.remove('on'));
  save(); toast('Danke für dein Feedback ✓');
});
function starStr(n) { return '★'.repeat(n) + `<span style="color:var(--line)">${'★'.repeat(5-n)}</span>`; }
function renderFeedback() {
  fillFeedbackRef();
  const list = $('#feedbackList');
  if (!state.feedback.length) { list.innerHTML = emptyState('Noch kein Feedback abgegeben.'); return; }
  list.innerHTML = [...state.feedback].reverse().map(fb => `
    <div class="list-item" style="align-items:flex-start">
      <div class="body">
        <div class="stars" style="font-size:1.1rem">${starStr(fb.rating)}</div>
        <b>${esc(fb.ref)}</b> <span class="role-badge ${fb.role||'oldie'}" style="padding:2px 9px;font-size:.72rem">${(fb.role==='mentor')?'Mentor':'Oldie'}</span>
        <div class="t-date">${esc(fb.author||'')} · ${fmtDate(fb.date)}</div>
        ${fb.positive?`<div class="meta" style="margin-top:6px">👍 ${esc(fb.positive)}</div>`:''}
        ${fb.improve?`<div class="meta">🔧 ${esc(fb.improve)}</div>`:''}
      </div>
      <button class="btn btn-ghost btn-sm" onclick="delFeedback('${fb.id}')">×</button>
    </div>`).join('');
}
window.delFeedback = id => { state.feedback = state.feedback.filter(x=>x.id!==id); save(); };

/* ---------- Feedback-Auswertung ---------- */
function avg(arr) { return arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : 0; }
function renderFeedbackEval() {
  const fb = state.feedback;
  const all = fb.map(f=>f.rating);
  const overall = avg(all);

  $('#fbStatRow').innerHTML = `
    <div class="stat"><div class="big-score" style="justify-content:center"><span class="n">${all.length?overall.toFixed(1):'–'}</span><span class="o">/ 5</span></div><div class="lbl">Ø Gesamtbewertung</div></div>
    <div class="stat"><div class="big">${fb.length}</div><div class="lbl">Feedbacks gesamt</div></div>
    <div class="stat"><div class="big">${all.length?Math.round(all.filter(r=>r>=4).length/all.length*100):0}%</div><div class="lbl">Anteil 4–5 ★</div></div>`;

  // Verteilung 5 → 1
  const chart = $('#distChart');
  if (!fb.length) { chart.innerHTML = emptyState('Noch keine Bewertungen vorhanden.'); }
  else {
    const max = Math.max(...[1,2,3,4,5].map(s => all.filter(r=>r===s).length), 1);
    chart.innerHTML = [5,4,3,2,1].map(s => {
      const c = all.filter(r=>r===s).length;
      return `<div class="dist-row"><span class="lbl">${s} ★</span>
        <div class="dist-bar"><span style="width:${c/max*100}%"></span></div>
        <span class="val">${c}</span></div>`;
    }).join('');
  }

  // Nach Perspektive
  const oldieR = fb.filter(f=>f.role==='oldie').map(f=>f.rating);
  const mentorR = fb.filter(f=>f.role==='mentor').map(f=>f.rating);
  $('#byRole').innerHTML = `
    <div class="dist-row"><span class="lbl" style="width:70px">Oldies</span>
      <div class="dist-bar"><span style="width:${avg(oldieR)/5*100}%"></span></div>
      <span class="val">${oldieR.length?avg(oldieR).toFixed(1):'–'}</span></div>
    <div class="dist-row"><span class="lbl" style="width:70px">Mentoren</span>
      <div class="dist-bar"><span style="width:${avg(mentorR)/5*100}%;background:var(--green)"></span></div>
      <span class="val">${mentorR.length?avg(mentorR).toFixed(1):'–'}</span></div>`;

  // Verbesserungs-Themen
  const improves = fb.filter(f=>f.improve).map(f=>f.improve);
  $('#improveThemes').innerHTML = improves.length
    ? improves.map(t=>`<div class="meta" style="padding:5px 0;border-bottom:1px solid var(--line)">🔧 ${esc(t)}</div>`).join('')
    : '<p class="meta">Noch keine Verbesserungshinweise.</p>';
}

/* ---------- Results & Tracking ---------- */
$('#resultForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  state.results.push({ id: uid(), title: f.title.value.trim(), desc: f.desc.value.trim(), date: new Date().toISOString() });
  f.reset(); save(); toast('Ergebnis festgehalten 🎉');
});
window.delResult = id => { state.results = state.results.filter(x=>x.id!==id); save(); };
function renderResults() {
  const achieved = state.topics.filter(t=>t.status==='Erreicht').length;
  const totalTopics = state.topics.length;
  const avgFb = state.feedback.length ? (state.feedback.reduce((a,b)=>a+b.rating,0)/state.feedback.length).toFixed(1) : '–';
  $('#statRow').innerHTML = `
    <div class="stat"><div class="big">${state.meetings.filter(m=>m.done).length}/${state.meetings.length}</div><div class="lbl">Treffen abgeschlossen</div></div>
    <div class="stat"><div class="big">${achieved}/${totalTopics||0}</div><div class="lbl">Lernziele erreicht</div></div>
    <div class="stat"><div class="big">${avgFb}${avgFb!=='–'?' ★':''}</div><div class="lbl">Ø Feedback</div></div>`;

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

  const rl = $('#resultList');
  rl.innerHTML = state.results.length ? state.results.map(r=>`
    <div class="list-item">
      <div class="when" style="background:var(--green)"><div class="d" style="color:#fff">🏆</div></div>
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
  if (!state.session) return;
  renderProfileSummary();
  renderMatching();
  renderMeetings();
  renderTopics();
  renderFeedback();
  renderFeedbackEval();
  renderResults();
}

/* ---------- Reset ---------- */
$('#resetBtn').onclick = () => {
  if (confirm('Wirklich alle lokal gespeicherten Daten löschen?')) {
    const sess = state.session;
    localStorage.removeItem(KEY);
    state = Object.assign({}, blank, { session: sess });
    save(); applySession();
    toast('Alle Daten zurückgesetzt.');
  }
};

/* ---------- Init ---------- */
applySession();
