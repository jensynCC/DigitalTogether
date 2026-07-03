/* ===== DigitalTogether – Relational Mentoring App Logic ===== */
/* Alle Daten werden lokal im Browser (localStorage) gespeichert. */

const KEY = 'digitaltogether_v3';

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
/* Erfahrungsbezogenes Wissen: fließt von erfahrenen Kolleg:innen zu den Mentor:innen
   – Relational Mentoring ist ein gegenseitiger Austausch. */
const EXPERIENCE_TOPICS = [
  'Branchen- & Fachwissen', 'Unternehmensgeschichte & Kultur',
  'Kundenbeziehungen & Netzwerk', 'Verhandlung & Gesprächsführung',
  'Prozess- & Abläufe-Know-how', 'Gelassenheit & Resilienz',
  'Entscheidungsfindung', 'Konfliktlösung',
  'Berufliche Orientierung', 'Strukturierte Arbeitsweise'
];
/* "About you" – persönliche Präferenzen fürs Matching */
const WORK_STYLES = [
  'Strukturiert & planvoll', 'Flexibel & spontan', 'Ergebnisorientiert',
  'Detailorientiert', 'Selbstständig', 'Teamorientiert'
];
const COMM_STYLES = [
  'Direkt & sachlich', 'Persönlich & einfühlsam', 'Kurz & knapp',
  'Ausführlich & erklärend', 'Lieber schriftlich', 'Lieber im Gespräch'
];
/* Faktoren, die Teilnehmende beim Matching priorisieren können */
const MATCH_FACTORS = ['Themen-Übereinstimmung', 'Arbeitsstil', 'Kommunikationsstil', 'Verfügbarkeit & Format'];
/* Interessen/Hobbys als Auswahl – liefern Gemeinsamkeiten als Gesprächsanlässe */
const INTERESTS = [
  'Wandern & Natur', 'Kochen & Backen', 'Lesen', 'Musik & Konzerte', 'Sport & Fitness',
  'Reisen', 'Fotografie', 'Gaming', 'Gartenarbeit', 'Ehrenamt',
  'Kunst & Kultur', 'Familie', 'Heimwerken', 'Yoga & Achtsamkeit', 'Kino & Serien', 'Radfahren'
];
const TRAVEL_DESTINATIONS = [
  '–', 'Italien', 'Spanien', 'Skandinavien', 'Asien', 'Nordamerika',
  'Roadtrip / Fernwanderung', 'Städtetrip Europa', 'Strandurlaub', 'Staycation / Zuhause'
];
/* Statischer HR-Kontakt für den Hilfe-Bereich */
const HR_CONTACT = {
  name: 'Sandra Keller', role: 'HR Business Partner · Relational Mentoring',
  email: 'mentoring@firma.de', phone: '+49 30 1234-567'
};

/* Personen-Pool (Demo): Kolleg:innen im Programm. Relational Mentoring – jede Person kann
   Mentor:in, Mentee oder beides sein. teach* = vermittelt, want* = möchte lernen. */
const PERSON_POOL = [
  { id:'p1', name:'Jonas Becker', position:'Werkstudent IT', dept:'IT',
    teachDigital:['Videokonferenzen','Team-Chat & Messenger','KI-Tools','Online-Sicherheit'], teachExp:[],
    wantDigital:[], wantExp:['Branchen- & Fachwissen','Kundenbeziehungen & Netzwerk'],
    strengths:['Digitale Affinität','Geduld'], format:'Video-Call', availability:'Nachmittags',
    workStyle:'Flexibel & spontan', commStyle:'Direkt & sachlich',
    interests:['Gaming','Sport & Fitness','Kino & Serien'], nextTravel:'Asien' },
  { id:'p2', name:'Renate Hoffmann', position:'Teamleitung', dept:'Vertrieb',
    teachDigital:[], teachExp:['Kundenbeziehungen & Netzwerk','Verhandlung & Gesprächsführung','Branchen- & Fachwissen'],
    wantDigital:['Videokonferenzen','Online-Sicherheit','Team-Chat & Messenger'], wantExp:[],
    strengths:['Branchenwissen','Kundenkontakt','Netzwerk'], format:'Persönlich vor Ort', availability:'Vormittags',
    workStyle:'Strukturiert & planvoll', commStyle:'Persönlich & einfühlsam',
    interests:['Wandern & Natur','Lesen','Musik & Konzerte'], nextTravel:'Italien' },
  { id:'p3', name:'Lena Vogt', position:'Junior Marketing', dept:'Marketing',
    teachDigital:['Social Media','Smartphone-Apps','Cloud & Dateien teilen','KI-Tools'], teachExp:[],
    wantDigital:[], wantExp:['Verhandlung & Gesprächsführung','Unternehmensgeschichte & Kultur'],
    strengths:['Kreativität','Digitale Affinität'], format:'Persönlich vor Ort', availability:'Vormittags',
    workStyle:'Teamorientiert', commStyle:'Persönlich & einfühlsam',
    interests:['Fotografie','Reisen','Kunst & Kultur'], nextTravel:'Städtetrip Europa' },
  { id:'p4', name:'Werner Krause', position:'Sachbearbeiter', dept:'Buchhaltung',
    teachDigital:[], teachExp:['Strukturierte Arbeitsweise','Prozess- & Abläufe-Know-how'],
    wantDigital:['Office / Tabellen','Cloud & Dateien teilen','Digitale Signaturen'], wantExp:[],
    strengths:['Strukturierte Arbeitsweise','Verlässlichkeit'], format:'Video-Call', availability:'Nachmittags',
    workStyle:'Detailorientiert', commStyle:'Ausführlich & erklärend',
    interests:['Gartenarbeit','Heimwerken','Radfahren'], nextTravel:'Staycation / Zuhause' },
  { id:'p5', name:'Sophie Klein', position:'Trainee', dept:'HR',
    teachDigital:['Online-Sicherheit','E-Mail & Kalender','Smartphone-Apps','Videokonferenzen'], teachExp:[],
    wantDigital:[], wantExp:['Konfliktlösung','Entscheidungsfindung','Gelassenheit & Resilienz'],
    strengths:['Geduld','Mentoring-Erfahrung'], format:'Video-Call', availability:'Vormittags',
    workStyle:'Detailorientiert', commStyle:'Persönlich & einfühlsam',
    interests:['Yoga & Achtsamkeit','Lesen','Wandern & Natur'], nextTravel:'Skandinavien' },
  { id:'p6', name:'Karl-Heinz Sommer', position:'Meister', dept:'Produktion',
    teachDigital:[], teachExp:['Prozess- & Abläufe-Know-how','Konfliktlösung','Entscheidungsfindung'],
    wantDigital:['Team-Chat & Messenger','Smartphone-Apps','KI-Tools'], wantExp:[],
    strengths:['Problemlösung','Verlässlichkeit','Netzwerk'], format:'Persönlich vor Ort', availability:'Flexibel',
    workStyle:'Ergebnisorientiert', commStyle:'Kurz & knapp',
    interests:['Heimwerken','Radfahren','Kochen & Backen'], nextTravel:'Roadtrip / Fernwanderung' },
  { id:'p7', name:'Gisela Brandt', position:'Assistenz', dept:'Geschäftsleitung',
    teachDigital:[], teachExp:[],
    wantDigital:['E-Mail & Kalender','Videokonferenzen','Cloud & Dateien teilen'], wantExp:[],
    strengths:['Verlässlichkeit','Kundenkontakt'], format:'Flexibel', availability:'Vormittags',
    workStyle:'Strukturiert & planvoll', commStyle:'Lieber im Gespräch',
    interests:['Kochen & Backen','Familie','Lesen'], nextTravel:'Spanien' },
  { id:'p8', name:'Tim Rademacher', position:'Dualer Student', dept:'Einkauf',
    teachDigital:['Office / Tabellen','Digitale Signaturen','E-Mail & Kalender'], teachExp:[],
    wantDigital:[], wantExp:[],
    strengths:['Digitale Affinität','Strukturierte Arbeitsweise'], format:'Flexibel', availability:'Flexibel',
    workStyle:'Selbstständig', commStyle:'Lieber schriftlich',
    interests:['Gaming','Sport & Fitness','Reisen'], nextTravel:'Nordamerika' }
];

/* Demo-Programmdaten für die HR-Auswertung (mehrere Tandems im Unternehmen).
   Das eigene lokale Tandem wird – falls Aktivität vorhanden – ergänzt. */
const DEMO_TANDEMS = [
  { dept:'Vertrieb',    meetingsPlanned:6, meetingsDone:5, goalsTotal:4, goalsAchieved:3, results:2, progress:4.2, confidence:3.8, recommend:true,  topics:['Videokonferenzen','Online-Sicherheit'] },
  { dept:'Buchhaltung', meetingsPlanned:4, meetingsDone:4, goalsTotal:3, goalsAchieved:3, results:2, progress:4.6, confidence:4.3, recommend:true,  topics:['Office / Tabellen','Digitale Signaturen'] },
  { dept:'Marketing',   meetingsPlanned:6, meetingsDone:4, goalsTotal:5, goalsAchieved:3, results:1, progress:3.9, confidence:3.6, recommend:true,  topics:['Social Media','KI-Tools'] },
  { dept:'Produktion',  meetingsPlanned:5, meetingsDone:3, goalsTotal:4, goalsAchieved:2, results:1, progress:3.5, confidence:3.2, recommend:false, topics:['Smartphone-Apps','Team-Chat & Messenger'] },
  { dept:'IT',          meetingsPlanned:4, meetingsDone:4, goalsTotal:3, goalsAchieved:3, results:3, progress:4.8, confidence:4.5, recommend:true,  topics:['Cloud & Dateien teilen','KI-Tools'] },
  { dept:'HR',          meetingsPlanned:5, meetingsDone:4, goalsTotal:4, goalsAchieved:3, results:2, progress:4.1, confidence:4.0, recommend:true,  topics:['E-Mail & Kalender','Videokonferenzen'] },
  { dept:'Vertrieb',    meetingsPlanned:6, meetingsDone:6, goalsTotal:5, goalsAchieved:4, results:2, progress:4.4, confidence:4.2, recommend:true,  topics:['Online-Sicherheit','KI-Tools'] },
  { dept:'Einkauf',     meetingsPlanned:4, meetingsDone:2, goalsTotal:3, goalsAchieved:1, results:0, progress:3.2, confidence:3.0, recommend:false, topics:['Office / Tabellen','Cloud & Dateien teilen'] }
];

/* Selbsteingeschätztes digitales Niveau der Mentees, Verteilung Level 1–5 (Demo-Basis) */
const DEMO_SKILL_LEVELS = { 1: 1, 2: 3, 3: 7, 4: 6, 5: 2 };

/* ---------- State ---------- */
const blank = {
  session: null,                 // { role:'user'|'hr', name }
  profile: null,                 // Personenprofil: teach* (Mentor-Seite) + want* (Mentee-Seite)
  tandem: null,                  // { partnerId, by:'hr', date } – das eine gemeinsame Tandem
  wishIds: [],                   // bis zu 3 Wunsch-Partner:innen der lokalen Person
  demoTandems: [],               // von HR gepaarte Dummy-Tandems [{ id, aId, bId, date }]
  notices: [],                   // [{ role:'user'|'hr', type:'match'|'dissolve', text, date, seen }]
  dissolved: [],                 // [{ by, partnerName, reason, date }] – nur HR sieht Gründe
  meetings: [], topics: [], feedback: [], results: [],
  // Onboarding-Event für die Startseite – von HR pflegbar
  event: {
    title: 'Kick-off: Relational Mentoring',
    date: '2026-07-15', time: '14:00',
    location: 'Hauptstandort · Forum (EG) & online via Video-Call',
    audience: 'Alle Mitarbeitenden',
    desc: 'Lerne das Programm kennen, triff dein mögliches Tandem und erfahre, wie der gegenseitige Wissensaustausch konkret abläuft.'
  }
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
const isHR = () => state.session && state.session.role === 'hr';

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Personen-Helpers ---------- */
function myProfile() { return state.profile; }
function personById(id) { return id === 'me' ? state.profile : PERSON_POOL.find(p => p.id === id); }
const hasTeachSide = p => !!p && ((p.teachDigital||[]).length + (p.teachExp||[]).length) > 0;
const hasWantSide  = p => !!p && ((p.wantDigital||[]).length + (p.wantExp||[]).length) > 0;
const profileFilled = () => hasTeachSide(state.profile) || hasWantSide(state.profile);
/* Rollen-Badges einer Person: Mentor:in / Mentee / beides */
function sideBadges(p) {
  const out = [];
  if (hasTeachSide(p)) out.push('<span class="role-badge mentor" style="padding:2px 9px;font-size:.72rem">Mentor:in</span>');
  if (hasWantSide(p)) out.push('<span class="role-badge oldie" style="padding:2px 9px;font-size:.72rem">Mentee</span>');
  return out.join(' ');
}
/* IDs aller Personen, die bereits in einem Tandem stecken (Dummy-Paare + reales Tandem) */
function takenIds() {
  const t = new Set(state.demoTandems.flatMap(x => [x.aId, x.bId]));
  if (state.tandem) { t.add('me'); t.add(state.tandem.partnerId); }
  return t;
}

/* ========================================================= */
/* LOGIN                                                     */
/* ========================================================= */
let pickedRole = null;
$('#rolePick').addEventListener('click', e => {
  const opt = e.target.closest('.role-opt'); if (!opt) return;
  pickedRole = opt.dataset.role;
  $$('.role-opt').forEach(o => o.classList.toggle('sel', o === opt));
});
const ROLE_LABEL = { user:'Teilnehmer:in', hr:'HR-Personalverantwortliche' };
$('#loginBtn').addEventListener('click', () => {
  const name = $('#loginName').value.trim();
  if (!pickedRole) { toast('Bitte eine Rolle wählen.'); return; }
  if (!name) { toast('Bitte deinen Namen eingeben.'); return; }
  state.session = { role: pickedRole, name };
  save();
  applySession();
  toast('Angemeldet als ' + ROLE_LABEL[pickedRole]);
});
$('#logoutBtn').addEventListener('click', () => {
  state.session = null; save(); applySession();
});

/* ---------- In-App-Benachrichtigungen ---------- */
function addNotice(role, type, text) {
  state.notices.push({ id: uid(), role, type, text, date: new Date().toISOString(), seen: false });
}
function showNotice() {
  const bar = $('#noticeBar'); if (!bar) return;
  const s = state.session;
  const mine = (state.notices||[]).filter(n => n.role === s.role && !n.seen);
  if (!mine.length) { bar.style.display = 'none'; bar.innerHTML = ''; return; }
  bar.style.display = 'block';
  bar.innerHTML = mine.map(n => `<div class="notice ${n.type}">
    <span class="notice-ico">${n.type==='dissolve'?'⚠️':'🔔'}</span>
    <span>${esc(n.text)}</span>
    <button class="notice-x" onclick="dismissNotice('${n.id}')">×</button>
  </div>`).join('');
}
window.dismissNotice = id => {
  const n = (state.notices||[]).find(x => x.id === id); if (n) n.seen = true;
  save(); showNotice();
};

function applySession() {
  const s = state.session;
  $('#loginOverlay').classList.toggle('hide', !!s);
  if (!s) { pickedRole = null; $('#loginName').value=''; $$('.role-opt').forEach(o=>o.classList.remove('sel')); return; }

  const hr = s.role === 'hr';
  const ICONS = {
    user: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>',
    hr:   '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></svg> HR ·'
  };
  $('#roleBadge').innerHTML = `<span class="role-badge ${s.role}">${ICONS[s.role]} ${esc(s.name)}</span>`;

  // In-App-Benachrichtigung für die aktuelle Rolle
  showNotice();

  // Tabs je nach Rolle: HR sieht nur die Auswertungen, Teilnehmende den persönlichen Bereich
  const HR_TABS = ['hrtracking','auswertung'];
  const PERSONAL_TABS = ['profil','matching','treffen','austausch','feedback','ergebnisse'];
  $$('#tabs .tab').forEach(t => {
    const show = hr ? HR_TABS.includes(t.dataset.tab) : PERSONAL_TABS.includes(t.dataset.tab);
    t.style.display = show ? '' : 'none';
  });

  if (hr) {
    $('#pageTitle').textContent = 'HR-Auswertung';
    $('#pageSub').textContent = 'Tandems zuordnen, Ergebnis-Tracking und Wirkungsmessung der Mentoring-Strategie.';
    renderAll();
    switchTab('hrtracking');
    return;
  }

  $('#pageTitle').textContent = 'Mein Mentoring-Bereich';
  $('#pageSub').textContent = 'Ein Profil, zwei Seiten: vermitteln und lernen – Treffen planen und Fortschritt festhalten.';
  $('[data-label="matching"]').textContent = 'Match';

  renderProfileForm();
  renderAll();
  switchTab(profileFilled() ? 'matching' : 'profil');
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

/* ---------- Profile (eine Person, zwei Seiten) ---------- */
$('#profileForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const teachDigital = chipValues('mentorDigChips'), teachExp = chipValues('mentorExpChips');
  const wantDigital = chipValues('menteeDigChips'), wantExp = chipValues('menteeExpChips');
  if (!(teachDigital.length + teachExp.length) && !(wantDigital.length + wantExp.length)) {
    toast('Bitte mindestens ein Thema wählen – als Mentor:in, Mentee oder beides.'); return;
  }
  const prev = myProfile() || {};
  state.profile = {
    name: f.name.value.trim(), department: f.department.value.trim(),
    position: f.position.value.trim(), email: f.email.value.trim(),
    teachDigital, teachExp, wantDigital, wantExp,
    strengths: chipValues('strengthChips'),
    format: f.format.value, availability: f.availability.value, goal: f.goal.value.trim(),
    workStyle: f.workStyle.value, commStyle: f.commStyle.value,
    // "Über dich" (Match-Seite) & Einschätzung erhalten
    interests: prev.interests || [], nextTravel: prev.nextTravel || '–',
    skillLevel: prev.skillLevel || 0, learningNeed: prev.learningNeed || 0, priorities: prev.priorities || []
  };
  save();
  toast('Profil gespeichert ✓');
  switchTab('matching');
});

function fillSelect(id, items, sel) {
  const el = $('#' + id); if (!el) return;
  el.innerHTML = items.map(i => `<option ${i===sel?'selected':''}>${i}</option>`).join('');
}
function renderProfileForm() {
  const p = myProfile();
  buildChips('mentorDigChips', TOPICS, p ? (p.teachDigital||[]) : []);
  buildChips('mentorExpChips', EXPERIENCE_TOPICS, p ? (p.teachExp||[]) : []);
  buildChips('menteeDigChips', TOPICS, p ? (p.wantDigital||[]) : []);
  buildChips('menteeExpChips', EXPERIENCE_TOPICS, p ? (p.wantExp||[]) : []);
  buildChips('strengthChips', STRENGTHS, p ? (p.strengths||[]) : []);
  buildChips('interestChips', INTERESTS, p ? (p.interests||[]) : []);
  fillSelect('travelSel', TRAVEL_DESTINATIONS, p ? p.nextTravel : null);
  fillSelect('workStyleSel', WORK_STYLES, p ? p.workStyle : null);
  fillSelect('commStyleSel', COMM_STYLES, p ? p.commStyle : null);
  const f = $('#profileForm');
  if (!p) {
    f.reset();
    // Name aus dem Login vorbefüllen
    if (state.session && state.session.role === 'user') f.name.value = state.session.name;
    return;
  }
  f.name.value = p.name || ''; f.department.value = p.department || '';
  f.position.value = p.position || ''; f.email.value = p.email || '';
  f.format.value = p.format || 'Flexibel';
  f.availability.value = p.availability || 'Flexibel'; f.goal.value = p.goal || '';
  if (p.workStyle) f.workStyle.value = p.workStyle;
  if (p.commStyle) f.commStyle.value = p.commStyle;
}

function renderProfileSummary() {
  const box = $('#profileSummary'); const p = myProfile();
  if (!p || !profileFilled()) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  const chips = (arr, styled) => (arr||[]).map(t=>`<span class="mini-tag"${styled?' style="background:var(--green-light);color:var(--green)"':''}>${esc(t)}</span>`).join('');
  box.innerHTML = `
    <div class="row-between">
      <div style="display:flex;gap:14px;align-items:center">
        <div class="avatar g">${initials(p.name)}</div>
        <div><b style="font-size:1.1rem">${esc(p.name)}</b>
        <div class="sub" style="margin:0">${esc(p.position||'–')} · ${esc(p.department||'–')}</div></div>
      </div>
      <span>${sideBadges(p)}</span>
    </div>
    <div class="divider"></div>
    ${hasTeachSide(p)?`
      <div class="t-date" style="margin-bottom:6px;font-weight:600;color:var(--ink)">Ich vermittle</div>
      <div class="tag-row">${chips(p.teachDigital)} ${chips(p.teachExp, true)}</div>`:''}
    ${hasWantSide(p)?`
      <div class="t-date" style="margin:${hasTeachSide(p)?'14px':'0'} 0 6px;font-weight:600;color:var(--ink)">Ich möchte lernen</div>
      <div class="tag-row">${chips(p.wantDigital)} ${chips(p.wantExp, true)}</div>`:''}
    ${(p.workStyle||p.commStyle)?`
      <div class="t-date" style="margin:14px 0 6px;font-weight:600;color:var(--ink)">Präferenzen</div>
      <div class="tag-row">
        ${p.workStyle?`<span class="mini-tag">🧭 ${esc(p.workStyle)}</span>`:''}
        ${p.commStyle?`<span class="mini-tag">💬 ${esc(p.commStyle)}</span>`:''}
      </div>`:''}
    ${p.goal?`<p style="margin-top:14px;color:var(--muted)"><em>„${esc(p.goal)}"</em></p>`:''}`;
}

/* ---------- Matching (Person ↔ Person) ---------- */
/* Gewichtung: priorisierte Faktoren zählen stärker (1.6×), sonst 1× */
function factorWeight(p, factor) { return (p.priorities||[]).includes(factor) ? 1.6 : 1; }
function formatFits(a, b) { return a === b || a === 'Flexibel' || b === 'Flexibel'; }
function inter(a, b) { return (a||[]).filter(x => (b||[]).includes(x)); }

/* Paar-Score aus Sicht von a: get = was a von b lernt, give = was a an b vermittelt.
   Gegenseitigkeit (beide Richtungen belegt) gibt einen Bonus – das ist der Kern von Relational Mentoring. */
function pairScore(a, b) {
  const W = f => factorWeight(a, f);
  const get  = inter(b.teachDigital, a.wantDigital).concat(inter(b.teachExp, a.wantExp));
  const give = inter(a.teachDigital, b.wantDigital).concat(inter(a.teachExp, b.wantExp));
  const fit = [];
  let s = 10;
  s += Math.min(get.length, 4) * 13 * W('Themen-Übereinstimmung');
  s += Math.min(give.length, 4) * 10 * W('Themen-Übereinstimmung');
  if (get.length && give.length) { s += 14; fit.push('Gegenseitig'); }
  if (a.workStyle && a.workStyle === b.workStyle) { s += 8 * W('Arbeitsstil'); fit.push('Arbeitsstil'); }
  if (a.commStyle && a.commStyle === b.commStyle) { s += 8 * W('Kommunikationsstil'); fit.push('Kommunikation'); }
  if (formatFits(a.format, b.format)) { s += 7 * W('Verfügbarkeit & Format'); fit.push('Format'); }
  if (formatFits(a.availability, b.availability)) s += 6 * W('Verfügbarkeit & Format');
  return { score: Math.min(99, Math.round(s)), get, give, fit };
}

/* Gemeinsamkeiten zwischen zwei Personen – als Gesprächsanlässe */
function commonalities(a, b) {
  const out = [];
  (a.interests||[]).filter(i => (b.interests||[]).includes(i)).forEach(i => out.push('🎯 ' + i));
  if (a.nextTravel && a.nextTravel !== '–' && a.nextTravel === b.nextTravel) out.push('✈️ Reiseziel: ' + a.nextTravel);
  if (a.workStyle && a.workStyle === b.workStyle) out.push('🧭 ' + a.workStyle);
  if (a.commStyle && a.commStyle === b.commStyle) out.push('💬 ' + a.commStyle);
  if (a.department && a.department === b.dept) out.push('🏢 Abteilung: ' + a.department);
  return out;
}
function renderMatching() {
  renderHelpCard();
  const p = myProfile();
  const matchCard = $('#matchCard'), about = $('#aboutCard'), intake = $('#intakeCard'), suggest = $('#suggestCard');
  if (!matchCard) return;
  if (!p || !profileFilled()) {
    matchCard.style.display = 'none'; about.style.display = ''; intake.style.display = ''; suggest.style.display = '';
    $('#matchList').innerHTML = emptyState('Bitte zuerst dein Profil ausfüllen.');
    return;
  }
  if (state.tandem) {
    matchCard.style.display = ''; about.style.display = ''; intake.style.display = 'none'; suggest.style.display = 'none';
    renderMatchCard(state.tandem.partnerId);
    return;
  }
  // Noch kein Tandem: Vorschläge + Wunsch (ohne "Über dich"-Details der anderen)
  matchCard.style.display = 'none'; about.style.display = ''; intake.style.display = ''; suggest.style.display = '';
  const taken = takenIds();
  const wishes = state.wishIds || [];
  const cands = PERSON_POOL.filter(x => !taken.has(x.id));
  const ranked = cands.map(c => ({ c, ...pairScore(p, c) })).sort((a, b) => b.score - a.score);
  $('#matchList').innerHTML = ranked.length ? ranked.map(({ c, score, get, give, fit }) => matchRow({
    person: c, score, get, give, fit, wishRank: wishes.indexOf(c.id) + 1
  })).join('') : emptyState('Aktuell sind alle Kolleg:innen im Pool vergeben.');
  $('#wishCounter').textContent = `${wishes.length} / 3`;
}
function dirRow(label, arr, styled) {
  if (!arr || !arr.length) return '';
  return `<div class="tag-row" style="margin-top:6px"><span class="meta" style="font-size:.8rem">${label}</span> ${arr.slice(0,3).map(t=>`<span class="mini-tag"${styled?' style="background:var(--green-light);color:var(--green)"':''}>${esc(t)}</span>`).join('')}</div>`;
}
function matchRow({person, score, get, give, fit, wishRank}) {
  const wished = wishRank > 0;
  const fitRow = (fit && fit.length)
    ? `<div class="tag-row" style="margin-top:6px"><span class="meta" style="font-size:.8rem">✓ Passt bei:</span> ${fit.map(t=>`<span class="fit-tag">${esc(t)}</span>`).join('')}</div>` : '';
  return `<div class="match" style="${wished?'border-color:var(--blue);background:#eaf6ff':''}">
    <div class="avatar g">${initials(person.name)}</div>
    <div class="match-info">
      <b>${esc(person.name)}</b> ${sideBadges(person)} ${wished?`<span class="pill" style="background:#dbeeff;color:#1c6aa8;margin-left:6px">Wunsch ${wishRank}</span>`:''}
      <div class="role">${esc(person.position||'')} · ${esc(person.dept||'')} · ${esc(person.format||'')}</div>
      ${dirRow('🌱 Du lernst:', get, false)}
      ${dirRow('🧭 Du gibst:', give, true)}
      ${fitRow}
    </div>
    <div class="score"><div class="num">${score}%</div><div class="lbl">Match</div></div>
    <button class="btn ${wished?'btn-ghost':'btn-outline'} btn-sm" onclick="markWish('${person.id}')">${wished?'✓ Wunsch '+wishRank:'Als Wunsch'}</button>
  </div>`;
}
/* Hybrid: Teilnehmende äußern bis zu 3 Wünsche – HR weist final zu */
window.markWish = id => {
  const w = state.wishIds || (state.wishIds = []);
  const i = w.indexOf(id);
  if (i >= 0) { w.splice(i, 1); toast('Wunsch entfernt.'); }
  else if (w.length >= 3) { toast('Maximal 3 Wünsche – entferne zuerst einen.'); return; }
  else { w.push(id); toast(`Wunsch ${w.length} von 3 gespeichert – HR berücksichtigt ihn.`); }
  save();
};

/* Match-Detailkarte (zugeordnetes Tandem) – erst hier wird "Über dich" des Gegenübers sichtbar */
function renderMatchCard(partnerId) {
  const me = myProfile();
  const partner = personById(partnerId);
  if (!partner) { $('#matchCard').style.display='none'; return; }
  const { get, give } = pairScore(me, partner);
  const com = commonalities(me, partner);
  const chips = arr => arr.map(t=>`<span class="mini-tag">${esc(t)}</span>`).join('');
  $('#matchCard').innerHTML = `
    <div class="row-between" style="align-items:flex-start">
      <div><h3 style="margin:0">Dein Tandem</h3>
        <p class="sub" style="margin:2px 0 0">Von HR zugeordnet – Wissen fließt in beide Richtungen.</p></div>
      <span class="pill done">HR-Zuordnung</span>
    </div>
    <div class="match" style="border-color:var(--green);background:var(--green-light);margin-top:16px">
      <div class="avatar g">${initials(partner.name)}</div>
      <div class="match-info">
        <b style="font-size:1.15rem">${esc(partner.name)}</b> ${sideBadges(partner)}
        <div class="role">${esc(partner.position||'')} · ${esc(partner.dept||'')} · ${esc(partner.format||'')}</div>
        ${get.length?`<div class="tag-row" style="margin-top:8px"><span class="meta" style="font-size:.8rem">🌱 Du lernst von ${esc(partner.name.split(' ')[0])}:</span> ${chips(get)}</div>`:''}
        ${give.length?`<div class="tag-row" style="margin-top:6px"><span class="meta" style="font-size:.8rem">🧭 Du gibst weiter:</span> ${chips(give)}</div>`:''}
      </div>
    </div>
    <div class="commons">
      <div class="t-date" style="font-weight:700;color:var(--ink);margin-bottom:8px">🤝 Über ${esc(partner.name.split(' ')[0])} – nice to know für euer Kennenlernen</div>
      <div class="tag-row" style="margin-bottom:8px">
        ${(partner.interests||[]).map(i=>`<span class="mini-tag" style="background:#eaf6ff;color:#1c6aa8">${esc(i)}</span>`).join('')}
        ${(partner.nextTravel&&partner.nextTravel!=='–')?`<span class="mini-tag" style="background:#eaf6ff;color:#1c6aa8">✈️ ${esc(partner.nextTravel)}</span>`:''}
      </div>
      ${com.length ? `<div class="t-date" style="font-weight:700;color:var(--ink);margin:10px 0 6px">Eure Gemeinsamkeiten</div>
        <div class="tag-row">${com.map(c=>`<span class="common-tag">${esc(c)}</span>`).join('')}</div>`
        : `<p class="meta" style="margin:0">Noch keine direkten Gemeinsamkeiten gefunden – vielleicht entdeckt ihr welche im Gespräch. Pflege dein „Über dich" für mehr Anknüpfungspunkte.</p>`}
    </div>
    <div class="divider"></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="switchTab('treffen')">Treffen vereinbaren</button>
      <button class="btn btn-outline btn-sm" onclick="openDissolve()">Match auflösen</button>
      <button class="btn btn-ghost btn-sm" onclick="document.getElementById('helpCard').scrollIntoView({behavior:'smooth'})">Probleme? Hilfe &amp; Kontakt</button>
    </div>
    <div id="dissolveBox" class="dissolve-box">
      <div class="dissolve-box-inner">
        <div class="field" style="margin-bottom:10px"><label>Grund für die Auflösung <span style="font-weight:400;color:var(--muted)">(optional – nur HR sieht den Grund)</span></label>
          <textarea id="dissolveReason" placeholder="z. B. terminlich schwierig, fachlich doch nicht passend, persönlich kein gutes Match …"></textarea></div>
        <button class="btn btn-primary btn-sm" onclick="confirmDissolve()">Auflösung bestätigen</button>
        <button class="btn btn-ghost btn-sm" onclick="document.getElementById('dissolveBox').classList.remove('open')">Abbrechen</button>
      </div>
    </div>`;
}
window.openDissolve = () => { const b=$('#dissolveBox'); if(b) b.classList.toggle('open'); };
window.confirmDissolve = () => {
  const reason = ($('#dissolveReason').value||'').trim();
  const partner = state.tandem ? personById(state.tandem.partnerId) : null;
  state.dissolved.push({
    id: uid(), by: state.session.name,
    partnerName: partner ? partner.name : '–',
    reason: reason || '(kein Grund angegeben)', date: new Date().toISOString()
  });
  state.tandem = null;
  addNotice('hr', 'dissolve', `Tandem aufgelöst von ${state.session.name}.`);
  save();
  toast('Match aufgelöst. HR wurde informiert.');
};

/* ---------- "Über dich": eigene Angaben, sichtbar nur fürs Tandem ---------- */
$('#aboutForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!state.profile) { toast('Bitte zuerst dein Profil anlegen.'); switchTab('profil'); return; }
  state.profile.interests = chipValues('interestChips');
  state.profile.nextTravel = e.target.nextTravel.value;
  save();
  toast('„Über dich" gespeichert ✓');
});
$('#aboutToggle').addEventListener('click', () => {
  const card = $('#aboutCard');
  card.classList.toggle('collapsed');
  $('#aboutToggle').textContent = card.classList.contains('collapsed') ? 'Einblenden' : 'Ausblenden';
});

/* Hilfe & Kontakt (statischer HR-Kontakt) */
function renderHelpCard() {
  const c = $('#helpCard'); if (!c) return;
  c.innerHTML = `
    <h3>Hilfe &amp; Kontakt</h3>
    <p class="sub">Läuft im Tandem etwas technisch oder persönlich nicht rund? Deine HR-Ansprechperson hilft – vertraulich.</p>
    <div class="contact-box">
      <div class="avatar g">${initials(HR_CONTACT.name)}</div>
      <div>
        <b>${esc(HR_CONTACT.name)}</b>
        <div class="sub" style="margin:0">${esc(HR_CONTACT.role)}</div>
        <div class="meta" style="margin-top:6px">✉️ <a href="mailto:${esc(HR_CONTACT.email)}">${esc(HR_CONTACT.email)}</a> &nbsp;·&nbsp; ☎️ ${esc(HR_CONTACT.phone)}</div>
      </div>
    </div>`;
}

/* ---------- Matching-Intake: Einschätzung & Prioritäten ---------- */
$('#intakeForm').addEventListener('submit', e => {
  e.preventDefault();
  const p = myProfile();
  if (!p || !profileFilled()) { toast('Bitte zuerst dein Profil ausfüllen.'); switchTab('profil'); return; }
  p.skillLevel = +e.target.skillLevel.value || 0;
  p.learningNeed = +e.target.learningNeed.value || 0;
  p.priorities = chipValues('priorityChips');
  save();
  toast('Einschätzung gespeichert – Matching aktualisiert ✓');
});
$('#intakeToggle').addEventListener('click', () => {
  const card = $('#intakeCard');
  card.classList.toggle('collapsed');
  $('#intakeToggle').textContent = card.classList.contains('collapsed') ? 'Einblenden' : 'Ausblenden';
});
function renderIntake() {
  if (isHR()) return;
  const p = myProfile() || {};
  buildChips('priorityChips', MATCH_FACTORS, p.priorities || []);
  const f = $('#intakeForm');
  if (f) { f.skillLevel.value = p.skillLevel || 0; f.learningNeed.value = p.learningNeed || 0; }
  setStars('rateSkill', p.skillLevel || 0);
  setStars('rateNeed', p.learningNeed || 0);
}

/* Name der Tandem-Partner:in (falls zugeordnet) */
function partnerName() {
  if (!state.tandem) return null;
  const partner = personById(state.tandem.partnerId);
  return partner ? partner.name : null;
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
        <b>${esc(t.title)}</b> <span class="mini-tag">${t.direction==='mentor'?'Ich vermittle':'Ich lerne'}</span><br>
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

/* ---------- Lernjournal / Selbstreflexion ---------- */
/* Mehrere Sterne-Skalen (Fortschritt, Sicherheit, Programm-Nutzen) – jede schreibt in ihr Hidden-Feld */
$$('.stars[data-target]').forEach(group => {
  group.querySelectorAll('span').forEach(s => {
    s.onclick = () => {
      const v = +s.dataset.v;
      const form = group.closest('form');
      if (form && form[group.dataset.target]) form[group.dataset.target].value = v;
      group.querySelectorAll('span').forEach(x => x.classList.toggle('on', +x.dataset.v <= v));
    };
  });
});
/* statische Sterne-Anzeige (z. B. Intake nach erneutem Öffnen) setzen */
function setStars(groupId, v) {
  $$('#' + groupId + ' span').forEach(x => x.classList.toggle('on', +x.dataset.v <= v));
}
function fillFeedbackRef() {
  const sel = $('#feedbackRef');
  const opts = ['<option value="general">Allgemeiner Eintrag</option>'];
  state.meetings.forEach(m => opts.push(`<option value="${m.id}">Treffen: ${esc(m.topic)} (${fmtDate(m.date)})</option>`));
  sel.innerHTML = opts.join('');
}
$('#feedbackForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const progress = +f.progress.value, confidence = +f.confidence.value;
  if (!progress || !confidence) { toast('Bitte Fortschritt und Sicherheit einschätzen.'); return; }
  const refEl = $('#feedbackRef');
  state.feedback.push({
    id: uid(), ref: refEl.options[refEl.selectedIndex]?.text || 'Allgemeiner Eintrag',
    direction: f.direction.value, author: state.session.name,
    progress, confidence,
    learned: f.learned.value.trim(), next: f.next.value.trim(),
    programScore: +f.programScore.value || 0, recommend: !!f.recommend.checked,
    date: new Date().toISOString()
  });
  f.reset();
  ['progress','confidence','programScore'].forEach(t => f[t].value = 0);
  $$('.stars[data-target] span').forEach(x => x.classList.remove('on'));
  save(); toast('Journal-Eintrag gespeichert ✓');
});
function starStr(n) {
  n = Math.max(0, Math.min(5, n||0));
  return `<span style="color:#f0a818">${'★'.repeat(n)}</span><span style="color:var(--line)">${'★'.repeat(5-n)}</span>`;
}
function renderFeedback() {
  fillFeedbackRef();
  const list = $('#feedbackList');
  if (!state.feedback.length) { list.innerHTML = emptyState('Noch kein Journal-Eintrag.'); return; }
  list.innerHTML = [...state.feedback].reverse().map(fb => `
    <div class="list-item" style="align-items:flex-start">
      <div class="body">
        <b>${esc(fb.ref)}</b> <span class="role-badge ${fb.direction==='taught'?'mentor':'oldie'}" style="padding:2px 9px;font-size:.72rem">${fb.direction==='taught'?'Vermittelt':'Gelernt'}</span>
        <div class="t-date">${esc(fb.author||'')} · ${fmtDate(fb.date)}</div>
        <div class="meta" style="margin-top:6px">📈 Fortschritt: ${starStr(fb.progress)} &nbsp; 💪 Sicherheit: ${starStr(fb.confidence)}</div>
        ${fb.learned?`<div class="meta" style="margin-top:6px">📝 ${esc(fb.learned)}</div>`:''}
        ${fb.next?`<div class="meta">➡️ Nächster Schritt: ${esc(fb.next)}</div>`:''}
      </div>
      <button class="btn btn-ghost btn-sm" onclick="delFeedback('${fb.id}')">×</button>
    </div>`).join('');
}
window.delFeedback = id => { state.feedback = state.feedback.filter(x=>x.id!==id); save(); };

/* ---------- Programm-Auswertung (HR-KPIs aus dem Lernjournal) ---------- */
function avg(arr) { return arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : 0; }
function roleBar(label, vals, green) {
  return `<div class="dist-row"><span class="lbl" style="width:150px">${label}</span>
    <div class="dist-bar"><span style="width:${avg(vals)/5*100}%${green?';background:var(--green)':''}"></span></div>
    <span class="val">${vals.length?avg(vals).toFixed(1):'–'}</span></div>`;
}
function renderFeedbackEval() {
  const fb = state.feedback;
  const prog = fb.map(f=>f.progress||0).filter(Boolean);
  const conf = fb.map(f=>f.confidence||0).filter(Boolean);
  const prgm = fb.map(f=>f.programScore||0).filter(Boolean);
  const recRate = fb.length ? Math.round(fb.filter(f=>f.recommend).length/fb.length*100) : 0;

  // Kopf-KPIs: Selbsteinschätzung + Weiterempfehlung (HR)
  $('#fbStatRow').innerHTML = `
    <div class="stat"><div class="big-score" style="justify-content:center"><span class="n">${prog.length?avg(prog).toFixed(1):'–'}</span><span class="o">/ 5</span></div><div class="lbl">Ø wahrgenommener Fortschritt</div></div>
    <div class="stat"><div class="big-score" style="justify-content:center"><span class="n">${conf.length?avg(conf).toFixed(1):'–'}</span><span class="o">/ 5</span></div><div class="lbl">Ø Sicherheit mit dem Gelernten</div></div>
    <div class="stat"><div class="big">${recRate}%</div><div class="lbl">Weiterempfehlung (HR-KPI)</div></div>`;

  // Verteilung der Sicherheit 5 → 1
  const chart = $('#distChart');
  if (!conf.length) { chart.innerHTML = emptyState('Noch keine Journal-Einträge.'); }
  else {
    const max = Math.max(...[1,2,3,4,5].map(s => conf.filter(r=>r===s).length), 1);
    chart.innerHTML = [5,4,3,2,1].map(s => {
      const c = conf.filter(r=>r===s).length;
      return `<div class="dist-row"><span class="lbl">${s} ★</span>
        <div class="dist-bar"><span style="width:${c/max*100}%"></span></div>
        <span class="val">${c}</span></div>`;
    }).join('');
  }

  // HR-Kennzahlen-Strip
  $('#hrKpis').innerHTML = `
    <div class="dist-row"><span class="lbl" style="width:150px">Journal-Einträge</span>
      <div class="dist-bar"><span style="width:${Math.min(100, fb.length*10)}%;background:var(--green)"></span></div>
      <span class="val">${fb.length}</span></div>
    <div class="dist-row"><span class="lbl" style="width:150px">Ø Programm-Nutzen</span>
      <div class="dist-bar"><span style="width:${avg(prgm)/5*100}%;background:var(--green)"></span></div>
      <span class="val">${prgm.length?avg(prgm).toFixed(1):'–'}</span></div>
    <div class="dist-row"><span class="lbl" style="width:150px">Aktive Teilnehmende</span>
      <div class="dist-bar"><span style="width:${Math.min(100, new Set(fb.map(f=>f.author)).size*20)}%;background:var(--green)"></span></div>
      <span class="val">${new Set(fb.map(f=>f.author)).size}</span></div>`;

  // Nach Perspektive – jede Person lernt UND vermittelt (Richtungs-Tag je Eintrag)
  const lP = fb.filter(f=>f.direction!=='taught').map(f=>f.progress||0).filter(Boolean);
  const lC = fb.filter(f=>f.direction!=='taught').map(f=>f.confidence||0).filter(Boolean);
  const tP = fb.filter(f=>f.direction==='taught').map(f=>f.progress||0).filter(Boolean);
  const tC = fb.filter(f=>f.direction==='taught').map(f=>f.confidence||0).filter(Boolean);
  $('#byRole').innerHTML =
    roleBar('Gelernt · Fortschritt', lP, false) +
    roleBar('Gelernt · Sicherheit', lC, false) +
    roleBar('Vermittelt · Fortschritt', tP, true) +
    roleBar('Vermittelt · Sicherheit', tC, true);

  // Stimmen aus dem Lernjournal (qualitativ)
  const voices = fb.filter(f=>f.learned).map(f=>f.learned);
  $('#improveThemes').innerHTML = voices.length
    ? voices.slice(-6).reverse().map(t=>`<div class="meta" style="padding:5px 0;border-bottom:1px solid var(--line)">📝 ${esc(t)}</div>`).join('')
    : '<p class="meta">Noch keine Journal-Einträge.</p>';
}

/* ---------- HR: Ergebnis-Tracking (programmweite Auswertung) ---------- */
/* Eigenes lokales Tandem als zusätzliches Programm-Tandem aufbereiten */
function localTandem() {
  const active = state.meetings.length || state.topics.length || state.results.length || state.feedback.length;
  if (!active) return null;
  const dept = (state.profile && state.profile.department) || 'Mein Tandem';
  const prog = state.feedback.map(f=>f.progress||0).filter(Boolean);
  const conf = state.feedback.map(f=>f.confidence||0).filter(Boolean);
  return {
    dept, local: true,
    meetingsPlanned: state.meetings.length,
    meetingsDone: state.meetings.filter(m=>m.done).length,
    goalsTotal: state.topics.length,
    goalsAchieved: state.topics.filter(t=>t.status==='Erreicht').length,
    results: state.results.length,
    progress: prog.length?avg(prog):0,
    confidence: conf.length?avg(conf):0,
    recommend: state.feedback.some(f=>f.recommend),
    topics: ((state.profile&&state.profile.wantDigital)||[]).slice(0,2)
  };
}
function barRow(label, val, max, green) {
  const pct = max ? Math.min(100, val/max*100) : 0;
  return `<div class="dist-row"><span class="lbl" style="width:170px;white-space:normal">${label}</span>
    <div class="dist-bar"><span style="width:${pct}%${green?';background:var(--green)':''}"></span></div>
    <span class="val">${val}/${max}</span></div>`;
}
function scaleRow(label, v, green) {
  return `<div class="dist-row"><span class="lbl" style="width:200px;white-space:normal">${label}</span>
    <div class="dist-bar"><span style="width:${v/5*100}%${green?';background:var(--green)':''}"></span></div>
    <span class="val">${v?v.toFixed(1):'–'}</span></div>`;
}
/* ---------- HR-Matchmaker: Personen paaren (volle Sandbox) ---------- */
/* Alle ungematchten Personen: Dummy-Pool + reales Profil (id 'me') */
function openPersons() {
  const taken = takenIds();
  const list = PERSON_POOL.filter(p => !taken.has(p.id));
  if (state.profile && profileFilled() && !state.tandem) {
    list.unshift(Object.assign({ id:'me', dept: state.profile.department }, state.profile));
  }
  return list;
}
function mmBlock(person, cands) {
  const isMe = person.id === 'me';
  return `<div class="mm-block">
    <div class="mm-head"><b>${esc(person.name)}</b> ${sideBadges(person)} <span class="meta">${esc(person.dept||'')}${isMe?' · echtes Profil':''}</span></div>
    <div class="mm-cands">
      ${cands.slice(0,3).map(c=>`<div class="mm-cand">
        <div><b>${esc(c.p.name)}</b> ${sideBadges(c.p)} ${c.wish?'<span class="pill" style="background:#dbeeff;color:#1c6aa8">Wunsch</span>':''}
          <div class="meta">${esc(c.p.position||'')} · ${esc(c.p.dept||'')}${c.mutual?' · ↔ gegenseitig':''}</div></div>
        <div style="display:flex;align-items:center;gap:12px"><span class="mm-score">${c.score}%</span>
          <button class="btn btn-primary btn-sm" onclick="hrAssign('${person.id}','${c.p.id}')">Zuweisen</button></div>
      </div>`).join('')}
    </div>
  </div>`;
}
function renderMatchmaker() {
  const box = $('#matchmaker'); if (!box) return;
  const open = openPersons();
  const blocks = open.map(person => {
    const cands = open.filter(o => o.id !== person.id)
      .map(o => {
        const s = pairScore(person, o);
        const w = state.wishIds || [];
        return { p: o, score: s.score, mutual: s.get.length && s.give.length,
          wish: (person.id === 'me' && w.includes(o.id)) || (o.id === 'me' && w.includes(person.id)) };
      })
      .sort((a, b) => b.score - a.score);
    return cands.length ? mmBlock(person, cands) : '';
  }).filter(Boolean);
  box.innerHTML = blocks.length ? blocks.join('')
    : '<p class="meta">Keine offenen Zuordnungen – alle registrierten Personen sind in einem Tandem.</p>';
  renderMmActive();
}
window.hrAssign = (aId, bId) => {
  if (aId === 'me' || bId === 'me') {
    const partnerId = aId === 'me' ? bId : aId;
    state.tandem = { partnerId, by: 'hr', date: new Date().toISOString() };
    state.wishIds = [];
    const nm = (personById(partnerId)||{}).name || 'deine Tandem-Partner:in';
    addNotice('user', 'match', `Neues Tandem: Du wurdest ${nm} zugeordnet. Details im Match-Tab.`);
  } else {
    state.demoTandems.push({ id: uid(), aId, bId, date: new Date().toISOString() });
  }
  save();
  toast('Tandem zugewiesen – die Beteiligten wurden benachrichtigt.');
};
/* Aktive Tandems (inkl. Lösen) – Sandbox für HR */
function renderMmActive() {
  const el = $('#mmActive'); if (!el) return;
  const rows = [];
  if (state.tandem) {
    const partner = personById(state.tandem.partnerId);
    rows.push(`<div class="mm-cand"><div><b>${esc((state.profile||{}).name||'Du')} ↔ ${esc(partner?partner.name:'?')}</b>
      <div class="meta">echtes Tandem · seit ${fmtDate(state.tandem.date)}</div></div>
      <button class="btn btn-ghost btn-sm" onclick="hrDissolve('me')">Lösen</button></div>`);
  }
  state.demoTandems.forEach(t => {
    const a = personById(t.aId), b = personById(t.bId);
    rows.push(`<div class="mm-cand"><div><b>${esc(a?a.name:'?')} ↔ ${esc(b?b.name:'?')}</b>
      <div class="meta">seit ${fmtDate(t.date)}</div></div>
      <button class="btn btn-ghost btn-sm" onclick="hrDissolve('${t.id}')">Lösen</button></div>`);
  });
  el.innerHTML = rows.length ? `<div class="mm-cands">${rows.join('')}</div>` : '<p class="meta">Noch keine Tandems zugeordnet.</p>';
}
window.hrDissolve = id => {
  if (id === 'me') {
    state.tandem = null;
    addNotice('user', 'dissolve', 'Dein Tandem wurde von HR aufgelöst. Du erhältst bald eine neue Zuordnung.');
  } else {
    state.demoTandems = state.demoTandems.filter(t => t.id !== id);
  }
  save();
  toast('Tandem gelöst.');
};
function renderDissolved() {
  const el = $('#dissolvedList'); if (!el) return;
  if (!state.dissolved.length) { el.innerHTML = '<p class="meta">Keine aufgelösten Matches.</p>'; return; }
  el.innerHTML = [...state.dissolved].reverse().map(d=>`<div class="list-item" style="align-items:flex-start">
    <div class="body"><b>${esc(d.by)}</b> · Partner: ${esc(d.partnerName)}
      <div class="t-date">${fmtDate(d.date)}</div>
      <div class="meta" style="margin-top:6px">📝 Grund: ${esc(d.reason)}</div>
    </div></div>`).join('');
}

/* Ampel-Ton nach Schwellenwert – für Akzentstreifen der Kacheln */
function toneOf(pct) { return pct >= 70 ? 'success' : pct >= 50 ? 'warning' : 'danger'; }

function renderHRDashboard() {
  if (!isHR()) return;
  renderMatchmaker();
  renderDissolved();
  const lt = localTandem();
  const tandems = lt ? [...DEMO_TANDEMS, lt] : DEMO_TANDEMS.slice();
  const sum = k => tandems.reduce((a,t)=>a+(t[k]||0),0);
  const meanOf = k => { const v = tandems.map(t=>t[k]).filter(x=>x>0); return v.length?avg(v):0; };

  const planned = sum('meetingsPlanned'), done = sum('meetingsDone');
  const goalsT = sum('goalsTotal'), goalsA = sum('goalsAchieved');
  const results = sum('results');
  const doneRate = planned ? Math.round(done/planned*100) : 0;
  const goalRate = goalsT ? Math.round(goalsA/goalsT*100) : 0;
  const avgProg = meanOf('progress'), avgConf = meanOf('confidence');
  const recRate = Math.round(tandems.filter(t=>t.recommend).length/tandems.length*100);

  // Registrierungs-/Match-Zahlen direkt aus dem Personen-Pool (+ echtes Profil)
  const persons = [...PERSON_POOL];
  if (state.profile && profileFilled()) persons.push(Object.assign({ id:'me', dept: state.profile.department }, state.profile));
  const mentees = persons.filter(hasWantSide).length;
  const mentors = persons.filter(hasTeachSide).length;
  const taken = takenIds();
  const inTandem = persons.filter(p => taken.has(p.id)).length;
  const tandemCount = state.demoTandems.length + (state.tandem ? 1 : 0);
  const waiting = persons.length - inTandem;
  const matchRate = persons.length ? Math.round(inTandem / persons.length * 100) : 0;

  // Hero: Match-Quote + Verlauf (illustrativer Trend – als Demo-Daten wie der Rest des Programm-Pools)
  const trendShape = [.42, .5, .58, .55, .7, .8, 1];
  $('#hrHero').innerHTML = `
    <div class="hr-hero-row">
      <div>
        <div class="hr-hero-num">${matchRate}<span>%</span></div>
        <div class="hr-hero-sub">${inTandem} von ${persons.length} Personen im Tandem &middot; ${waiting} wartend</div>
      </div>
      <div class="hr-spark">${trendShape.map((f,i)=>`<span class="${i===trendShape.length-1?'hi':''}" style="height:${Math.round(f*40)}px"></span>`).join('')}</div>
    </div>`;

  // KPI-Reihe – Ampelfarben statt einheitlichem Blau
  $('#hrKpiRow').innerHTML = `
    <div class="stat tone-accent"><div class="big">${tandems.length}</div><div class="lbl">Aktive Tandems</div></div>
    <div class="stat tone-${toneOf(doneRate)}"><div class="big">${doneRate}%</div><div class="lbl">Durchführungsquote Treffen</div></div>
    <div class="stat tone-${toneOf(goalRate)}"><div class="big">${goalRate}%</div><div class="lbl">Zielerreichungsquote</div></div>
    <div class="stat tone-accent"><div class="big">${results}</div><div class="lbl">Dokumentierte Ergebnisse</div></div>`;

  // Durchführung & Zielerreichung
  $('#hrProgress').innerHTML =
    barRow('Treffen durchgeführt', done, planned, false) +
    barRow('Lernziele erreicht', goalsA, goalsT, false) +
    barRow('Tandems mit dokumentierten Ergebnissen', tandems.filter(t=>t.results>0).length, tandems.length, false);

  // Kompetenzzuwachs
  $('#hrCompetence').innerHTML =
    `<div class="big-score" style="margin-bottom:16px"><span class="n">${avgConf?avgConf.toFixed(1):'–'}</span><span class="o">/ 5 Ø Sicherheit</span></div>` +
    scaleRow('Ø wahrgenommener Fortschritt', avgProg, false) +
    scaleRow('Ø Sicherheit mit dem Gelernten', avgConf, true) +
    `<div class="dist-row"><span class="lbl" style="width:200px;white-space:normal">Weiterempfehlung (eNPS-Indikator)</span>
      <div class="dist-bar"><span style="width:${recRate}%;background:var(--green)"></span></div>
      <span class="val">${recRate}%</span></div>`;

  // Strategische HR-Handlungsfelder
  $('#hrFields').innerHTML = [
    ['Wissensmanagement', `${goalRate}% der Lernziele erreicht – Digital- und Erfahrungswissen wird in beide Richtungen geteilt.`],
    ['Digitale Transformation', `Ø Sicherheit ${avgConf.toFixed(1)}/5 – Beschäftigte nutzen digitale Tools zunehmend souverän.`],
    ['Mitarbeitendenbindung', `${recRate}% Weiterempfehlung – Zusammenarbeit auf Augenhöhe stärkt die Bindung.`],
    ['Inklusion', `${tandems.length} aktive Tandems über Bereiche & Erfahrungsstufen hinweg (3i-Framework).`]
  ].map(([h,p])=>`<div class="hrfield"><h4>${esc(h)}</h4><p>${esc(p)}</p></div>`).join('');

  // Nachgefragte Lernthemen
  const tc = {};
  tandems.forEach(t => (t.topics||[]).forEach(tp => tc[tp]=(tc[tp]||0)+1));
  const topTopics = Object.entries(tc).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxT = Math.max(...topTopics.map(t=>t[1]), 1);
  $('#hrTopics').innerHTML = topTopics.length
    ? topTopics.map(([t,c])=>`<div class="dist-row"><span class="lbl" style="width:175px;white-space:normal">${esc(t)}</span>
        <div class="dist-bar"><span style="width:${c/maxT*100}%"></span></div><span class="val">${c}</span></div>`).join('')
    : '<p class="meta">Keine Daten.</p>';

  // Beteiligung nach Bereich – als Status-Liste (Punkt + Quote) statt gleichförmiger Balken,
  // damit schwache Abteilungen (z. B. Einkauf) sofort auffallen statt in der Balkenreihe unterzugehen
  const deptAgg = {};
  tandems.forEach(t => {
    const d = deptAgg[t.dept] || (deptAgg[t.dept] = { planned: 0, done: 0 });
    d.planned += t.meetingsPlanned; d.done += t.meetingsDone;
  });
  const deptRows = Object.entries(deptAgg)
    .map(([dept, v]) => ({ dept, planned: v.planned, done: v.done, rate: v.planned ? Math.round(v.done/v.planned*100) : 0 }))
    .sort((a,b) => a.rate - b.rate);
  $('#hrDepts').innerHTML = `<div class="dept-list">${deptRows.map(r => `
    <div class="dept-row">
      <span class="dept-dot ${toneOf(r.rate)}"></span>
      <span class="dept-name">${esc(r.dept)}</span>
      <span class="dept-meta">${r.done}/${r.planned} Treffen</span>
      <span class="dept-rate">${r.rate}%</span>
    </div>`).join('')}</div>`;

  // Skills, Lernbedarfe & Beteiligung (anonymisiert) – aggregiert aus dem Personen-Pool + echtem Profil
  $('#hrPeopleRow').innerHTML = `
    <div class="stat tone-accent"><div class="big">${mentees}</div><div class="lbl">Personen mit Mentee-Profil</div></div>
    <div class="stat tone-accent"><div class="big">${mentors}</div><div class="lbl">Personen mit Mentor:innen-Profil</div></div>
    <div class="stat tone-success"><div class="big">${tandemCount}</div><div class="lbl">Aktive Tandems</div></div>
    <div class="stat ${waiting>0?'tone-warning':'tone-accent'}"><div class="big">${waiting}</div><div class="lbl">Wartend (ohne Match)</div></div>`;

  const skills = {};
  persons.forEach(pr => (pr.strengths||[]).forEach(s => skills[s] = (skills[s]||0)+1));
  const topSkills = Object.entries(skills).sort((a,b)=>b[1]-a[1]).slice(0,7);
  $('#hrSkills').innerHTML = `<div class="skill-tags">${topSkills.map(([s,c])=>`<span class="skill-pill">${esc(s)} <b>${c}</b></span>`).join('')}</div>`;

  const levels = Object.assign({}, DEMO_SKILL_LEVELS);
  if (state.profile && state.profile.skillLevel) levels[state.profile.skillLevel] = (levels[state.profile.skillLevel]||0)+1;
  const maxLv = Math.max(...[1,2,3,4,5].map(l=>levels[l]||0), 1);
  $('#hrSkillLevels').innerHTML = [5,4,3,2,1].map(l=>`<div class="dist-row"><span class="lbl">${l} ★</span>
    <div class="dist-bar"><span style="width:${(levels[l]||0)/maxLv*100}%;background:var(--green)"></span></div><span class="val">${levels[l]||0}</span></div>`).join('');

  renderEventEditor();
}

/* ---------- Onboarding-Event (HR pflegt, Startseite zeigt) ---------- */
$('#eventForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  state.event = {
    title: f.title.value.trim(), date: f.date.value, time: f.time.value,
    location: f.location.value.trim(), audience: f.audience.value, desc: f.desc.value.trim()
  };
  save();
  toast('Event gespeichert – Startseite aktualisiert ✓');
});
function renderEventEditor() {
  const ev = state.event || {}; const f = $('#eventForm'); if (!f) return;
  f.title.value = ev.title || ''; f.date.value = ev.date || ''; f.time.value = ev.time || '';
  f.location.value = ev.location || ''; if (ev.audience) f.audience.value = ev.audience;
  f.desc.value = ev.desc || '';
  $('#eventPreview').innerHTML = ev.title
    ? `<div class="meta" style="padding:10px 12px;background:var(--green-light);border-radius:10px">
        Aktuell auf der Startseite: <b>${esc(ev.title)}</b> · ${ev.date?fmtDate(ev.date):'–'}${ev.time?', '+ev.time+' Uhr':''}
        · ${esc(ev.location||'')} · Zielgruppe: ${esc(ev.audience||'–')}</div>`
    : '';
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
  const confVals = state.feedback.map(f=>f.confidence||0).filter(Boolean);
  const avgConf = confVals.length ? avg(confVals).toFixed(1) : '–';
  $('#statRow').innerHTML = `
    <div class="stat"><div class="big">${state.meetings.filter(m=>m.done).length}/${state.meetings.length}</div><div class="lbl">Treffen abgeschlossen</div></div>
    <div class="stat"><div class="big">${achieved}/${totalTopics||0}</div><div class="lbl">Lernziele erreicht</div></div>
    <div class="stat"><div class="big">${avgConf}${avgConf!=='–'?' / 5':''}</div><div class="lbl">Ø Sicherheit (Selbsteinschätzung)</div></div>`;

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
  renderIntake();
  renderMatching();
  renderMeetings();
  renderTopics();
  renderFeedback();
  renderFeedbackEval();
  renderResults();
  renderHRDashboard();
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
