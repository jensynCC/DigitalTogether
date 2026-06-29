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

/* Demo-Mentor:innen-Pool für das Matching (Oldie-Sicht).
   teaches = digitale Themen (Mentor → Oldie), expTopics = Erfahrungswissen, das der Mentor lernen möchte (Oldie → Mentor) */
const MENTOR_POOL = [
  { id:'m1', name:'Jonas Becker',  position:'Werkstudent IT', dept:'IT',
    teaches:['Videokonferenzen','Team-Chat & Messenger','KI-Tools','Online-Sicherheit'],
    expTopics:['Branchen- & Fachwissen','Kundenbeziehungen & Netzwerk'],
    strengths:['Digitale Affinität','Geduld'], format:'Video-Call', availability:'Nachmittags',
    workStyle:'Flexibel & spontan', commStyle:'Direkt & sachlich' },
  { id:'m2', name:'Lena Vogt', position:'Junior Marketing', dept:'Marketing',
    teaches:['Social Media','Smartphone-Apps','Cloud & Dateien teilen','KI-Tools'],
    expTopics:['Verhandlung & Gesprächsführung','Unternehmensgeschichte & Kultur'],
    strengths:['Kreativität','Digitale Affinität'], format:'Persönlich vor Ort', availability:'Vormittags',
    workStyle:'Teamorientiert', commStyle:'Persönlich & einfühlsam' },
  { id:'m3', name:'Ali Demir', position:'Auszubildender', dept:'Vertrieb',
    teaches:['E-Mail & Kalender','Office / Tabellen','Digitale Signaturen','Cloud & Dateien teilen'],
    expTopics:['Strukturierte Arbeitsweise','Berufliche Orientierung'],
    strengths:['Geduld','Strukturierte Arbeitsweise'], format:'Flexibel', availability:'Flexibel',
    workStyle:'Strukturiert & planvoll', commStyle:'Ausführlich & erklärend' },
  { id:'m4', name:'Sophie Klein', position:'Trainee', dept:'HR',
    teaches:['Online-Sicherheit','E-Mail & Kalender','Smartphone-Apps','Videokonferenzen'],
    expTopics:['Konfliktlösung','Entscheidungsfindung','Gelassenheit & Resilienz'],
    strengths:['Geduld','Mentoring-Erfahrung'], format:'Video-Call', availability:'Vormittags',
    workStyle:'Detailorientiert', commStyle:'Persönlich & einfühlsam' }
];

/* Demo-Mentees für die Mentor-Sicht.
   topics = digitale Lernwünsche (Mentor → Oldie), expTopics = Erfahrungswissen, das der Oldie weitergibt (Oldie → Mentor) */
const MENTEE_POOL = [
  { id:'e1', name:'Renate Hoffmann', position:'Teamleitung', dept:'Vertrieb',
    topics:['Videokonferenzen','Online-Sicherheit','Team-Chat & Messenger'],
    expTopics:['Kundenbeziehungen & Netzwerk','Verhandlung & Gesprächsführung','Branchen- & Fachwissen'],
    format:'Persönlich vor Ort', availability:'Vormittags', goal:'Sicher mit Videokonferenzen umgehen.',
    workStyle:'Strukturiert & planvoll', commStyle:'Persönlich & einfühlsam' },
  { id:'e2', name:'Werner Krause', position:'Sachbearbeiter', dept:'Buchhaltung',
    topics:['Office / Tabellen','Cloud & Dateien teilen','Digitale Signaturen'],
    expTopics:['Strukturierte Arbeitsweise','Prozess- & Abläufe-Know-how'],
    format:'Video-Call', availability:'Nachmittags', goal:'Rechnungen digital signieren und ablegen.',
    workStyle:'Detailorientiert', commStyle:'Ausführlich & erklärend' }
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

/* Anonymisierte Programm-Aggregate für die HR-Übersicht (Demo). */
const DEMO_PEOPLE = { menteesRegistered: 11, mentorsRegistered: 9, matched: 8, waiting: 3 };
/* Häufigste eingebrachte Stärken/Skills (anonymisiert, programmweit) */
const DEMO_SKILLS = {
  'Digitale Affinität': 7, 'Branchenwissen': 6, 'Geduld': 5, 'Strukturierte Arbeitsweise': 5,
  'Kundenkontakt': 4, 'Kreativität': 4, 'Mentoring-Erfahrung': 3, 'Netzwerk': 3, 'Verlässlichkeit': 3
};
/* Selbsteingeschätztes digitales Niveau der Mentees, Verteilung Level 1–5 */
const DEMO_SKILL_LEVELS = { 1: 1, 2: 3, 3: 7, 4: 6, 5: 2 };

/* ---------- State ---------- */
const blank = {
  session: null,                 // { role:'oldie'|'mentor', name }
  menteeProfile: null,           // Profil des Oldies
  mentorProfile: null,           // Profil des Mentors
  mentorId: null,                // vom Oldie gewähltes Tandem
  menteeId: null,                // vom Mentor gewähltes Tandem
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
const isOldie = () => state.session && state.session.role === 'oldie';
const isHR = () => state.session && state.session.role === 'hr';

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
const ROLE_LABEL = { oldie:'Mentee', mentor:'Mentor', hr:'HR-Personalverantwortliche' };
$('#loginBtn').addEventListener('click', () => {
  const name = $('#loginName').value.trim();
  if (!pickedRole) { toast('Bitte eine Rolle wählen.'); return; }
  if (!name) { toast('Bitte deinen Namen eingeben.'); return; }
  state.session = { role: pickedRole, name };
  // Oldie/Mentor: falls noch kein Profil existiert, Namen vorbefüllen. HR hat kein Profil.
  if (pickedRole !== 'hr' && !myProfile()) setMyProfile({ name, topics: [], strengths: [] });
  save();
  applySession();
  toast('Angemeldet als ' + ROLE_LABEL[pickedRole]);
});
$('#logoutBtn').addEventListener('click', () => {
  state.session = null; save(); applySession();
});

function applySession() {
  const s = state.session;
  $('#loginOverlay').classList.toggle('hide', !!s);
  if (!s) { pickedRole = null; $('#loginName').value=''; $$('.role-opt').forEach(o=>o.classList.remove('sel')); return; }

  const oldie = s.role === 'oldie';
  const hr = s.role === 'hr';
  const ICONS = {
    oldie: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/></svg> Mentee',
    mentor:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L3 7l9 5 9-5-9-5z"/></svg> Mentor',
    hr:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></svg> HR'
  };
  $('#roleBadge').innerHTML = `<span class="role-badge ${s.role}">${ICONS[s.role]} · ${esc(s.name)}</span>`;

  // Tabs je nach Rolle: HR sieht nur die Auswertungen, Oldie/Mentor den persönlichen Bereich
  const HR_TABS = ['hrtracking','auswertung'];
  const PERSONAL_TABS = ['profil','matching','treffen','austausch','feedback','ergebnisse'];
  $$('#tabs .tab').forEach(t => {
    const show = hr ? HR_TABS.includes(t.dataset.tab) : PERSONAL_TABS.includes(t.dataset.tab);
    t.style.display = show ? '' : 'none';
  });

  if (hr) {
    $('#pageTitle').textContent = 'HR-Auswertung';
    $('#pageSub').textContent = 'Programmweites Ergebnis-Tracking und Wirkungsmessung der Mentoring-Strategie.';
    renderAll();
    switchTab('hrtracking');
    return;
  }

  // Labels je nach Rolle anpassen
  $('#pageTitle').textContent = oldie ? 'Mein Mentoring-Bereich' : 'Mein Mentor-Bereich';
  $('#pageSub').textContent = oldie
    ? 'Profil pflegen, Match finden, Treffen planen und Fortschritt festhalten.'
    : 'Profil pflegen, Mentees begleiten, Treffen planen und Fortschritt festhalten.';
  $('#profileFormTitle').textContent = oldie ? 'Anmeldung & Profil' : 'Mein Mentor-Profil';
  $('#topicLabel').textContent = oldie
    ? 'Worüber möchtest du gern lernen? (digitale Lernwünsche)'
    : 'Welche digitalen Kompetenzen gibst du weiter?';
  $('#topicHint').textContent = oldie
    ? 'Diese Themen lernst du von deinem Mentor / deiner Mentorin.'
    : 'Diese Themen gibst du an deine Mentees weiter.';
  $('#expLabel').textContent = oldie
    ? 'Welches Erfahrungswissen gibst du weiter?'
    : 'Was möchtest du von erfahrenen Kolleg:innen lernen?';
  $('#expHint').textContent = oldie
    ? 'Branchen-, Prozess- & Erfahrungswissen – das lernt dein:e Mentor:in von dir.'
    : 'Auch du lernst im Tandem – Relational Mentoring ist gegenseitig.';
  $('#goalLabel').textContent = oldie ? 'Dein Ziel in einem Satz' : 'Womit kannst du am besten unterstützen?';
  $('#profileSubmit').textContent = oldie ? 'Profil speichern & Matching starten' : 'Profil speichern & Mentees ansehen';
  $('[data-label="matching"]').textContent = oldie ? 'Matching' : 'Meine Mentees';
  $('#matchTitle').textContent = oldie ? 'Dein Matching' : 'Meine Mentees';
  $('#matchSub').textContent = oldie
    ? 'Auf Basis deiner Lernwünsche, Stärken, Präferenzen und Verfügbarkeit.'
    : 'Diese Mentees passen zu deinen Kompetenzen und Präferenzen.';
  $('#skillLabel').textContent = oldie
    ? 'Wie sicher fühlst du dich aktuell mit digitalen Tools?'
    : 'Wie sicher fühlst du dich darin, Wissen zu vermitteln?';
  $('#needLabel').textContent = oldie
    ? 'Wie groß ist dein digitaler Lernbedarf?'
    : 'Wie groß ist dein Interesse, Erfahrungswissen zu lernen?';

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
  const prev = myProfile() || {};
  setMyProfile({
    name: f.name.value.trim(), department: f.department.value.trim(),
    position: f.position.value.trim(), email: f.email.value.trim(),
    role: state.session.role, topics, expTopics: chipValues('expChips'),
    strengths: chipValues('strengthChips'),
    format: f.format.value, availability: f.availability.value, goal: f.goal.value.trim(),
    hobbies: f.hobbies.value.trim(), workStyle: f.workStyle.value, commStyle: f.commStyle.value,
    // Einschätzung aus dem Matching-Intake erhalten
    skillLevel: prev.skillLevel || 0, learningNeed: prev.learningNeed || 0, priorities: prev.priorities || []
  });
  if (isOldie() && !state.mentorId) computeMatch(true);
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
  buildChips('topicChips', TOPICS, p ? (p.topics||[]) : []);
  buildChips('expChips', EXPERIENCE_TOPICS, p ? (p.expTopics||[]) : []);
  buildChips('strengthChips', STRENGTHS, p ? (p.strengths||[]) : []);
  fillSelect('workStyleSel', WORK_STYLES, p ? p.workStyle : null);
  fillSelect('commStyleSel', COMM_STYLES, p ? p.commStyle : null);
  const f = $('#profileForm');
  if (!p) { f.reset(); fillSelect('workStyleSel', WORK_STYLES); fillSelect('commStyleSel', COMM_STYLES); return; }
  f.name.value = p.name || ''; f.department.value = p.department || '';
  f.position.value = p.position || ''; f.email.value = p.email || '';
  f.format.value = p.format || 'Flexibel';
  f.availability.value = p.availability || 'Flexibel'; f.goal.value = p.goal || '';
  f.hobbies.value = p.hobbies || '';
  if (p.workStyle) f.workStyle.value = p.workStyle;
  if (p.commStyle) f.commStyle.value = p.commStyle;
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
      <span class="role-badge ${state.session.role}">${oldie?'Mentee':'Mentor'}</span>
    </div>
    <div class="divider"></div>
    <div class="t-date" style="margin-bottom:6px;font-weight:600;color:var(--ink)">${oldie?'Digitale Lernwünsche':'Digitale Kompetenzen'}</div>
    <div class="tag-row">${p.topics.map(t=>`<span class="mini-tag">${esc(t)}</span>`).join('')}</div>
    ${(p.expTopics&&p.expTopics.length)?`
      <div class="t-date" style="margin:14px 0 6px;font-weight:600;color:var(--ink)">${oldie?'Erfahrungswissen, das ich weitergebe':'Erfahrungswissen, das ich lernen möchte'}</div>
      <div class="tag-row">${p.expTopics.map(t=>`<span class="mini-tag" style="background:var(--green-light);color:var(--green)">${esc(t)}</span>`).join('')}</div>`:''}
    ${(p.workStyle||p.commStyle||p.hobbies)?`
      <div class="t-date" style="margin:14px 0 6px;font-weight:600;color:var(--ink)">Über mich</div>
      <div class="tag-row">
        ${p.workStyle?`<span class="mini-tag">🧭 ${esc(p.workStyle)}</span>`:''}
        ${p.commStyle?`<span class="mini-tag">💬 ${esc(p.commStyle)}</span>`:''}
      </div>
      ${p.hobbies?`<div class="sub" style="margin:8px 0 0">🎯 ${esc(p.hobbies)}</div>`:''}`:''}
    ${p.goal?`<p style="margin-top:14px;color:var(--muted)"><em>„${esc(p.goal)}"</em></p>`:''}`;
}

/* ---------- Matching ---------- */
/* gemeinsame Erfahrungsthemen: was der Oldie weitergibt ∩ was der Mentor lernen will */
function mutualTopics(oldieGives, mentorWants) {
  return (oldieGives||[]).filter(t => (mentorWants||[]).includes(t));
}
/* Gewichtung: priorisierte Faktoren zählen stärker (1.6×), sonst 1× */
function factorWeight(p, factor) { return (p.priorities||[]).includes(factor) ? 1.6 : 1; }
function formatFits(a, b) { return a === b || a === 'Flexibel' || b === 'Flexibel'; }

function scoreMentor(p, m) {
  const W = f => factorWeight(p, f);
  const fit = [];
  let s = 0;
  const overlap = m.teaches.filter(t => p.topics.includes(t)).length;
  s += overlap * 20 * W('Themen-Übereinstimmung');
  if (overlap) fit.push('Themen');
  const mutual = mutualTopics(p.expTopics, m.expTopics);
  s += mutual.length * 7;                     // beidseitiger Lerneffekt
  if (p.workStyle && p.workStyle === m.workStyle) { s += 9 * W('Arbeitsstil'); fit.push('Arbeitsstil'); }
  if (p.commStyle && p.commStyle === m.commStyle) { s += 9 * W('Kommunikationsstil'); fit.push('Kommunikation'); }
  if (formatFits(m.format, p.format)) { s += 9 * W('Verfügbarkeit & Format'); fit.push('Format'); }
  if (formatFits(m.availability, p.availability)) s += 8 * W('Verfügbarkeit & Format');
  s += m.strengths.includes('Geduld') ? 5 : 0;
  return { score: Math.min(99, Math.round(s + 8)), overlap, mutual, fit };
}
/* Mentor-Sicht: Wie gut passt ein Mentee zu meinen Kompetenzen + zu meinen Lernzielen */
function scoreMentee(myP, mentee) {
  const W = f => factorWeight(myP, f);
  const fit = [];
  const overlap = (mentee.topics||[]).filter(t => (myP.topics||[]).includes(t)).length;
  let s = overlap * 22 * W('Themen-Übereinstimmung') + 12;
  if (overlap) fit.push('Themen');
  const mutual = mutualTopics(mentee.expTopics, myP.expTopics);
  s += mutual.length * 7;
  if (myP.workStyle && myP.workStyle === mentee.workStyle) { s += 9 * W('Arbeitsstil'); fit.push('Arbeitsstil'); }
  if (myP.commStyle && myP.commStyle === mentee.commStyle) { s += 9 * W('Kommunikationsstil'); fit.push('Kommunikation'); }
  if (formatFits(mentee.format, myP.format)) { s += 9 * W('Verfügbarkeit & Format'); fit.push('Format'); }
  return { score: Math.min(99, Math.round(s)), overlap, mutual, fit };
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
    list.innerHTML = ranked.map(({ m, score, mutual, fit }) => {
      const chosen = state.mentorId === m.id;
      const shared = m.teaches.filter(t => p.topics.includes(t));
      return matchRow({
        name:m.name, sub:`${m.position} · ${m.dept} · ${m.format}`,
        tags: shared.length?shared:m.teaches.slice(0,3), score, chosen, mutual, fit,
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
      const { score, mutual, fit } = scoreMentee(p, mentee);
      const chosen = state.menteeId === mentee.id;
      const shared = (mentee.topics||[]).filter(t => (p.topics||[]).includes(t));
      return matchRow({
        name:mentee.name, sub:`${mentee.position||''} · ${mentee.dept||''}`,
        tags: shared.length?shared:(mentee.topics||[]).slice(0,3), score, chosen, mutual, fit,
        action:`pickMentee('${mentee.id}')`, label: chosen?'Ausgewählt':'Begleiten', green:true
      });
    }).join('');
  }
}
function matchRow({name, sub, tags, score, chosen, action, label, green, mutual, fit}) {
  const mut = (mutual && mutual.length)
    ? `<div class="tag-row" style="margin-top:6px"><span class="meta" style="font-size:.8rem">↔ Gegenseitig:</span> ${mutual.map(t=>`<span class="mini-tag" style="background:var(--green-light);color:var(--green)">${esc(t)}</span>`).join('')}</div>`
    : '';
  const fitRow = (fit && fit.length)
    ? `<div class="tag-row" style="margin-top:6px"><span class="meta" style="font-size:.8rem">✓ Passt bei:</span> ${fit.map(t=>`<span class="fit-tag">${esc(t)}</span>`).join('')}</div>`
    : '';
  return `<div class="match" style="${chosen?'border-color:var(--green);background:var(--green-light)':''}">
    <div class="avatar ${green?'g':''}">${initials(name)}</div>
    <div class="match-info">
      <b>${esc(name)}</b> ${chosen?'<span class="pill done" style="margin-left:6px">Tandem</span>':''}
      <div class="role">${esc(sub)}</div>
      <div class="tag-row">${tags.map(t=>`<span class="mini-tag">${esc(t)}</span>`).join('')}</div>
      ${fitRow}
      ${mut}
    </div>
    <div class="score"><div class="num">${score}%</div><div class="lbl">Match</div></div>
    <button class="btn ${chosen?'btn-ghost':'btn-primary'} btn-sm" onclick="${action}">${label}</button>
  </div>`;
}
window.pickMentor = id => { state.mentorId = id; save(); toast('Match bestätigt – jetzt Treffen vereinbaren!'); switchTab('treffen'); };
window.pickMentee = id => { state.menteeId = id; save(); toast('Mentee ausgewählt – jetzt Treffen vereinbaren!'); switchTab('treffen'); };

/* ---------- Matching-Intake: Einschätzung & Prioritäten ---------- */
$('#intakeForm').addEventListener('submit', e => {
  e.preventDefault();
  const p = myProfile();
  if (!p || !(p.topics||[]).length) { toast('Bitte zuerst dein Profil ausfüllen.'); switchTab('profil'); return; }
  p.skillLevel = +e.target.skillLevel.value || 0;
  p.learningNeed = +e.target.learningNeed.value || 0;
  p.priorities = chipValues('priorityChips');
  setMyProfile(p);
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
        <b>${esc(t.title)}</b> <span class="mini-tag">${t.direction==='mentor'?'Mentee → Mentor':'Mentor → Mentee'}</span><br>
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
    role: state.session.role, author: state.session.name,
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
        <b>${esc(fb.ref)}</b> <span class="role-badge ${fb.role||'oldie'}" style="padding:2px 9px;font-size:.72rem">${(fb.role==='mentor')?'Mentor':'Mentee'}</span>
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

  // Nach Perspektive – beide Rollen lernen (Fortschritt & Sicherheit)
  const oP = fb.filter(f=>f.role==='oldie').map(f=>f.progress||0).filter(Boolean);
  const oC = fb.filter(f=>f.role==='oldie').map(f=>f.confidence||0).filter(Boolean);
  const mP = fb.filter(f=>f.role==='mentor').map(f=>f.progress||0).filter(Boolean);
  const mC = fb.filter(f=>f.role==='mentor').map(f=>f.confidence||0).filter(Boolean);
  $('#byRole').innerHTML =
    roleBar('Mentees · Fortschritt', oP, false) +
    roleBar('Mentees · Sicherheit', oC, false) +
    roleBar('Mentor:innen · Fortschritt', mP, true) +
    roleBar('Mentor:innen · Sicherheit', mC, true);

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
  const dept = (state.menteeProfile && state.menteeProfile.department)
            || (state.mentorProfile && state.mentorProfile.department) || 'Mein Tandem';
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
    topics: ((state.menteeProfile&&state.menteeProfile.topics)||[]).slice(0,2)
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
function renderHRDashboard() {
  if (!isHR()) return;
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

  // KPI-Reihe
  $('#hrKpiRow').innerHTML = `
    <div class="stat"><div class="big">${tandems.length}</div><div class="lbl">Aktive Tandems</div></div>
    <div class="stat"><div class="big">${doneRate}%</div><div class="lbl">Durchführungsquote Treffen</div></div>
    <div class="stat"><div class="big">${goalRate}%</div><div class="lbl">Zielerreichungsquote</div></div>
    <div class="stat"><div class="big">${results}</div><div class="lbl">Dokumentierte Ergebnisse</div></div>`;

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

  // Beteiligung nach Bereich
  const dc = {};
  tandems.forEach(t => dc[t.dept]=(dc[t.dept]||0)+1);
  const depts = Object.entries(dc).sort((a,b)=>b[1]-a[1]);
  const maxD = Math.max(...depts.map(d=>d[1]), 1);
  $('#hrDepts').innerHTML = depts.map(([d,c])=>`<div class="dist-row"><span class="lbl" style="width:130px;white-space:normal">${esc(d)}</span>
    <div class="dist-bar"><span style="width:${c/maxD*100}%;background:var(--green)"></span></div><span class="val">${c}</span></div>`).join('');

  // Skills, Lernbedarfe & Beteiligung (anonymisiert) – Demo + lokales Profil
  const hasMentee = state.menteeProfile && (state.menteeProfile.topics||[]).length;
  const hasMentor = state.mentorProfile && (state.mentorProfile.topics||[]).length;
  const mentees = DEMO_PEOPLE.menteesRegistered + (hasMentee ? 1 : 0);
  const mentors = DEMO_PEOPLE.mentorsRegistered + (hasMentor ? 1 : 0);
  const matched = DEMO_PEOPLE.matched + ((state.mentorId || state.menteeId) ? 1 : 0);
  const waiting = Math.max(0, mentees - matched) + Math.max(0, mentors - matched);
  $('#hrPeopleRow').innerHTML = `
    <div class="stat"><div class="big">${mentees}</div><div class="lbl">Mentees (registriert)</div></div>
    <div class="stat"><div class="big">${mentors}</div><div class="lbl">Mentor:innen (registriert)</div></div>
    <div class="stat"><div class="big">${matched}</div><div class="lbl">Gematchte Tandems</div></div>
    <div class="stat"><div class="big">${waiting}</div><div class="lbl">Wartend (ohne Match)</div></div>`;

  const skills = Object.assign({}, DEMO_SKILLS);
  [state.menteeProfile, state.mentorProfile].forEach(pr => { if (pr) (pr.strengths||[]).forEach(s => skills[s] = (skills[s]||0)+1); });
  const topSkills = Object.entries(skills).sort((a,b)=>b[1]-a[1]).slice(0,7);
  const maxSk = Math.max(...topSkills.map(s=>s[1]), 1);
  $('#hrSkills').innerHTML = topSkills.map(([s,c])=>`<div class="dist-row"><span class="lbl" style="width:175px;white-space:normal">${esc(s)}</span>
    <div class="dist-bar"><span style="width:${c/maxSk*100}%"></span></div><span class="val">${c}</span></div>`).join('');

  const levels = Object.assign({}, DEMO_SKILL_LEVELS);
  if (hasMentee && state.menteeProfile.skillLevel) levels[state.menteeProfile.skillLevel] = (levels[state.menteeProfile.skillLevel]||0)+1;
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
