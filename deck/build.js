const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "DigitalTogether";
pres.title = "Relational Mentoring als Teil der HR-Strategie";

/* ---- Palette (DigitalTogether brand) ---- */
const NAVY = "042C58";   // große Elemente
const NAVY2 = "063E78";
const BLUE = "6AB2E7";   // kleine Elemente / Akzent
const BLUE_DK = "1C6AA8";
const ICE = "E7F2FB";    // helle Box
const INK = "042C58";
const TEXT = "2B3A45";
const MUTED = "64748B";
const WHITE = "FFFFFF";
const LINE = "DDE6EF";

const HF = "Trebuchet MS"; // Headlines
const BF = "Calibri";      // Body

const W = 13.33, H = 7.5, MX = 0.7;
const shadow = () => ({ type: "outer", color: "0A2540", blur: 10, offset: 3, angle: 90, opacity: 0.12 });

/* ---- Helpers ---- */
function pageTitle(slide, kicker, title) {
  slide.addShape(pres.shapes.OVAL, { x: MX, y: 0.62, w: 0.16, h: 0.16, fill: { color: BLUE } });
  slide.addText(kicker.toUpperCase(), { x: MX + 0.28, y: 0.5, w: 10, h: 0.4, fontFace: BF, fontSize: 12, color: BLUE_DK, bold: true, charSpacing: 3, margin: 0 });
  slide.addText(title, { x: MX, y: 0.9, w: W - 2 * MX, h: 0.9, fontFace: HF, fontSize: 30, color: INK, bold: true, margin: 0 });
}
function card(slide, x, y, w, h, fill = WHITE) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: LINE, width: 1 }, rectRadius: 0.1, shadow: shadow() });
}
function numCircle(slide, x, y, n, color = NAVY) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: 0.62, h: 0.62, fill: { color } });
  slide.addText(String(n), { x, y, w: 0.62, h: 0.62, align: "center", valign: "middle", fontFace: HF, fontSize: 22, color: WHITE, bold: true, margin: 0 });
}

/* ============================================================ */
/* 1 — TITLE                                                    */
/* ============================================================ */
let s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: 9.7, y: -2.2, w: 6.2, h: 6.2, fill: { color: NAVY2 } });
s.addShape(pres.shapes.OVAL, { x: 11.4, y: 3.6, w: 4.6, h: 4.6, fill: { color: BLUE_DK, transparency: 55 } });
s.addText("DigitalTogether", { x: MX, y: 0.7, w: 6, h: 0.4, fontFace: HF, fontSize: 16, color: BLUE, bold: true, margin: 0 });
s.addText("Wissen verbindet.", { x: MX, y: 1.05, w: 6, h: 0.3, fontFace: BF, fontSize: 12, color: ICE, margin: 0 });

s.addText("Relational Mentoring", { x: MX, y: 2.35, w: 11, h: 1.0, fontFace: HF, fontSize: 52, color: WHITE, bold: true, margin: 0 });
s.addText("als Baustein der HR-Strategie", { x: MX, y: 3.4, w: 11, h: 0.9, fontFace: HF, fontSize: 32, color: BLUE, bold: true, margin: 0 });
s.addText("Generationen verbinden, digitale Kompetenz aufbauen und Mitarbeitende langfristig binden – über eine strukturierte Matching- und Lernplattform.",
  { x: MX, y: 4.45, w: 9.2, h: 1.0, fontFace: BF, fontSize: 16, color: ICE, lineSpacingMultiple: 1.2, margin: 0 });

s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 6.25, w: 0.07, h: 0.55, fill: { color: BLUE } });
s.addText([
  { text: "Strategie-Vorlage People & Culture", options: { breakLine: true, color: WHITE, bold: true, fontSize: 13 } },
  { text: "Vorbereitet für die Geschäftsleitung · Vertraulich", options: { color: ICE, fontSize: 11 } },
], { x: MX + 0.25, y: 6.2, w: 8, h: 0.7, fontFace: BF, valign: "middle", margin: 0 });

/* ============================================================ */
/* 2 — AUSGANGSLAGE                                             */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Ausgangslage", "Warum jetzt handeln?");

const facts = [
  ["≈ 30%", "der Belegschaft geht in vielen\nUnternehmen bis 2035 in Rente", NAVY],
  ["Digital", "Tools & Prozesse verändern\nsich schneller als die Weiterbildung", BLUE_DK],
  ["Wissen", "wertvolles Erfahrungswissen\ndroht ungenutzt verloren zu gehen", NAVY],
  ["Bindung", "Wertschätzung & Lernen sind\nzentrale Faktoren der Mitarbeiterbindung", BLUE_DK],
];
let fx = MX, fw = 2.92, gap = 0.18;
facts.forEach((f, i) => {
  const x = MX + i * (fw + gap);
  card(s, x, 2.1, fw, 2.5);
  s.addShape(pres.shapes.RECTANGLE, { x: x, y: 2.1, w: fw, h: 0.12, fill: { color: f[2] } });
  s.addText(f[0], { x: x + 0.2, y: 2.45, w: fw - 0.4, h: 0.8, fontFace: HF, fontSize: 30, color: f[2], bold: true, margin: 0 });
  s.addText(f[1], { x: x + 0.2, y: 3.35, w: fw - 0.4, h: 1.1, fontFace: BF, fontSize: 13, color: TEXT, lineSpacingMultiple: 1.05, margin: 0 });
});

card(s, MX, 5.0, W - 2 * MX, 1.55, ICE);
s.addText("Die Kernfrage", { x: MX + 0.35, y: 5.18, w: 4, h: 0.4, fontFace: HF, fontSize: 14, color: BLUE_DK, bold: true, margin: 0 });
s.addText("Wie verbinden wir die digitale Affinität digital affiner Mitarbeitender mit dem Erfahrungswissen arbeitserfahrener Kolleg:innen – strukturiert, freiwillig und messbar?",
  { x: MX + 0.35, y: 5.55, w: W - 2 * MX - 0.7, h: 0.9, fontFace: BF, fontSize: 16, color: INK, italic: true, lineSpacingMultiple: 1.1, margin: 0 });

/* ============================================================ */
/* 3 — STRATEGISCHE EINORDNUNG                                  */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Strategische Einordnung", "Einzahlung auf fünf HR-Handlungsfelder");

const fields = [
  ["Wissensmanagement", "Erfahrungswissen sichern und systematisch weitergeben"],
  ["Digitale Transformation", "Digitale Selbstwirksamkeit über alle Altersgruppen stärken"],
  ["Mitarbeiterbindung", "Wertschätzung & Entwicklung erhöhen die Retention"],
  ["Diversity & Inklusion", "Generationenübergreifende Zusammenarbeit auf Augenhöhe"],
  ["Employer Branding", "Moderne Lernkultur als Argument im Recruiting"],
];
fields.forEach((f, i) => {
  const y = 2.05 + i * 0.92;
  card(s, MX, y, 7.4, 0.8);
  numCircle(s, MX + 0.16, y + 0.09, i + 1, i % 2 ? BLUE_DK : NAVY);
  s.addText(f[0], { x: MX + 0.95, y: y + 0.08, w: 2.9, h: 0.64, fontFace: HF, fontSize: 15, color: INK, bold: true, valign: "middle", margin: 0 });
  s.addText(f[1], { x: MX + 3.75, y: y + 0.08, w: 3.55, h: 0.64, fontFace: BF, fontSize: 12, color: TEXT, valign: "middle", margin: 0 });
});

card(s, 8.55, 2.05, 4.08, 4.5, NAVY);
s.addText("Strategischer Kern", { x: 8.85, y: 2.35, w: 3.5, h: 0.4, fontFace: HF, fontSize: 14, color: BLUE, bold: true, margin: 0 });
s.addText("Relational Mentoring ist kein Einzelprojekt, sondern ein Hebel, der gleichzeitig auf mehrere strategische People-Ziele einzahlt.",
  { x: 8.85, y: 2.8, w: 3.5, h: 1.4, fontFace: BF, fontSize: 15, color: WHITE, lineSpacingMultiple: 1.2, margin: 0 });
s.addShape(pres.shapes.LINE, { x: 8.85, y: 4.35, w: 3.45, h: 0, line: { color: BLUE_DK, width: 1 } });
s.addText([
  { text: "Ein Programm.", options: { breakLine: true, bold: true, color: WHITE, fontSize: 15 } },
  { text: "Fünf Wirkungsfelder.", options: { color: BLUE, fontSize: 15, bold: true } },
], { x: 8.85, y: 4.6, w: 3.5, h: 0.9, fontFace: HF, margin: 0 });
s.addText("Miteinander. Füreinander.", { x: 8.85, y: 5.85, w: 3.5, h: 0.4, fontFace: BF, fontSize: 12, color: ICE, italic: true, margin: 0 });

/* ============================================================ */
/* 4 — LÖSUNG: RELATIONAL MENTORING                            */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Lösungsansatz", "Zwei Perspektiven, ein gemeinsames Ziel");

// left card – Oldie
card(s, MX, 2.05, 5.85, 4.5);
s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 2.05, w: 5.85, h: 0.14, fill: { color: NAVY } });
s.addText("Erfahrene Mitarbeitende  ·  „Mentees“", { x: MX + 0.35, y: 2.35, w: 5.2, h: 0.5, fontFace: HF, fontSize: 17, color: INK, bold: true, margin: 0 });
s.addText([
  { text: "Bringen ein", options: { bold: true, color: BLUE_DK, breakLine: true, fontSize: 12 } },
  { text: "Erfahrung & Branchenwissen", options: { bullet: true, breakLine: true } },
  { text: "Strukturierte, verlässliche Arbeitsweise", options: { bullet: true, breakLine: true } },
  { text: "Weitblick & Problemlösungskompetenz", options: { bullet: true, breakLine: true } },
  { text: "Lernen", options: { bold: true, color: BLUE_DK, breakLine: true, fontSize: 12 } },
  { text: "Digitale Tools souverän einsetzen", options: { bullet: true, breakLine: true } },
  { text: "Sicherheit im digitalen Arbeitsalltag", options: { bullet: true } },
], { x: MX + 0.35, y: 2.95, w: 5.2, h: 3.4, fontFace: BF, fontSize: 13, color: TEXT, paraSpaceAfter: 6, margin: 0 });

// right card – Mentor
card(s, 6.95, 2.05, 5.68, 4.5);
s.addShape(pres.shapes.RECTANGLE, { x: 6.95, y: 2.05, w: 5.68, h: 0.14, fill: { color: BLUE } });
s.addText("Digital-affine Mitarbeitende  ·  Mentor:innen", { x: 7.3, y: 2.35, w: 5.1, h: 0.5, fontFace: HF, fontSize: 17, color: INK, bold: true, margin: 0 });
s.addText([
  { text: "Bringen ein", options: { bold: true, color: BLUE_DK, breakLine: true, fontSize: 12 } },
  { text: "Digitale Affinität & Lernfreude", options: { bullet: true, breakLine: true } },
  { text: "Neugier für neue Tools & Trends", options: { bullet: true, breakLine: true } },
  { text: "Kreative Lösungsansätze", options: { bullet: true, breakLine: true } },
  { text: "Lernen", options: { bold: true, color: BLUE_DK, breakLine: true, fontSize: 12 } },
  { text: "Branchen- & Prozesswissen", options: { bullet: true, breakLine: true } },
  { text: "Umgang mit Strukturen & Hierarchien", options: { bullet: true } },
], { x: 7.3, y: 2.95, w: 5.1, h: 3.4, fontFace: BF, fontSize: 13, color: TEXT, paraSpaceAfter: 6, margin: 0 });

s.addText("Relational Mentoring verbindet beide Perspektiven auf Augenhöhe – Lernen findet in beide Richtungen statt.",
  { x: MX, y: 6.75, w: W - 2 * MX, h: 0.4, fontFace: BF, fontSize: 13, color: MUTED, italic: true, align: "center", margin: 0 });

/* ============================================================ */
/* 5 — SO FUNKTIONIERT DIE PLATTFORM                           */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Die Plattform", "Vom Profil zum messbaren Ergebnis");

const steps = [
  ["Profil & Login", "An- und Abmeldung als Mentee oder Mentor, Stärken und Lernwünsche erfassen"],
  ["Matching", "Algorithmus schlägt passende Tandems mit Match-Score vor"],
  ["Treffen", "Einzel- oder Regeltermine vereinbaren – wöchentlich bis monatlich"],
  ["Austausch", "Lernthemen gemeinsam bearbeiten, beide Seiten profitieren"],
  ["Feedback & Tracking", "Bewertungen auswerten, Ergebnisse und Fortschritt festhalten"],
];
const cw = 2.28, cg = 0.14;
steps.forEach((st, i) => {
  const x = MX + i * (cw + cg);
  card(s, x, 2.35, cw, 3.6);
  numCircle(s, x + (cw - 0.62) / 2, 2.65, i + 1, i % 2 ? BLUE_DK : NAVY);
  s.addText(st[0], { x: x + 0.12, y: 3.45, w: cw - 0.24, h: 0.7, fontFace: HF, fontSize: 15, color: INK, bold: true, align: "center", valign: "top", margin: 0 });
  s.addText(st[1], { x: x + 0.18, y: 4.15, w: cw - 0.36, h: 1.6, fontFace: BF, fontSize: 12, color: TEXT, align: "center", lineSpacingMultiple: 1.1, margin: 0 });
  if (i < steps.length - 1) {
    s.addText("→", { x: x + cw - 0.05, y: 3.65, w: 0.3, h: 0.5, fontFace: BF, fontSize: 22, color: BLUE, align: "center", margin: 0 });
  }
});
card(s, MX, 6.25, W - 2 * MX, 0.85, ICE);
s.addText([
  { text: "Self-Service & DSGVO-konform:  ", options: { bold: true, color: INK } },
  { text: "Die Web-Plattform läuft im Browser, Daten bleiben im Unternehmen – kein zusätzliches Tool-Onboarding nötig.", options: { color: TEXT } },
], { x: MX + 0.35, y: 6.25, w: W - 2 * MX - 0.7, h: 0.85, fontFace: BF, fontSize: 13.5, valign: "middle", margin: 0 });

/* ============================================================ */
/* 6 — ROLLEN & GOVERNANCE                                      */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Governance", "Rollen & Verantwortlichkeiten");

const rows = [
  ["HR / People & Culture", "Programm-Owner: Konzept, Kommunikation, Matching-Qualität, Auswertung"],
  ["Führungskräfte", "Ermöglichen Zeit, fördern Teilnahme, wirken als Vorbilder"],
  ["Mentor:innen", "Geben digitales Wissen weiter, dokumentieren Lernthemen"],
  ["Mentees", "Bringen Lernwünsche ein, gestalten Treffen aktiv mit"],
  ["Betriebsrat / Datenschutz", "Begleitung von Freiwilligkeit, Vertraulichkeit & Datenschutz"],
];
const tbl = [[
  { text: "Rolle", options: { fill: { color: NAVY }, color: WHITE, bold: true, fontFace: HF, fontSize: 14, align: "left", valign: "middle" } },
  { text: "Verantwortung im Programm", options: { fill: { color: NAVY }, color: WHITE, bold: true, fontFace: HF, fontSize: 14, align: "left", valign: "middle" } },
]];
rows.forEach((r, i) => {
  const f = i % 2 ? "F4F8FC" : WHITE;
  tbl.push([
    { text: r[0], options: { fill: { color: f }, color: INK, bold: true, fontFace: BF, fontSize: 13.5, valign: "middle" } },
    { text: r[1], options: { fill: { color: f }, color: TEXT, fontFace: BF, fontSize: 13, valign: "middle" } },
  ]);
});
s.addTable(tbl, { x: MX, y: 2.1, w: W - 2 * MX, colW: [3.5, 8.43], rowH: 0.7, border: { type: "solid", pt: 1, color: LINE }, align: "left", margin: [4, 10, 4, 10] });
s.addText("Erfolgsprinzip: Freiwilligkeit, Augenhöhe und Wertschätzung – HR schafft den Rahmen, die Tandems gestalten den Inhalt.",
  { x: MX, y: 6.7, w: W - 2 * MX, h: 0.4, fontFace: BF, fontSize: 13, color: MUTED, italic: true, margin: 0 });

/* ============================================================ */
/* 7 — ROADMAP                                                  */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Umsetzung", "Implementierungs-Roadmap");

const phases = [
  ["Phase 1", "Monat 1–2", "Konzept & Setup", ["Ziele & KPIs definieren", "Stakeholder einbinden", "Plattform aufsetzen"]],
  ["Phase 2", "Monat 3–4", "Pilot", ["10–15 Tandems starten", "Begleitung & Onboarding", "Erste Treffen"]],
  ["Phase 3", "Monat 5–7", "Evaluation", ["Feedback auswerten", "Format nachschärfen", "Erfolge sichtbar machen"]],
  ["Phase 4", "ab Monat 8", "Roll-out", ["Unternehmensweit öffnen", "In HR-Prozesse verankern", "Kontinuierlich verbessern"]],
];
const pw = 2.92, pg = 0.18;
// connecting line
s.addShape(pres.shapes.LINE, { x: MX + 0.3, y: 2.55, w: (pw + pg) * 3, h: 0, line: { color: BLUE, width: 2, dashType: "dash" } });
phases.forEach((p, i) => {
  const x = MX + i * (pw + pg);
  s.addShape(pres.shapes.OVAL, { x: x + 0.05, y: 2.3, w: 0.5, h: 0.5, fill: { color: i % 2 ? BLUE_DK : NAVY } });
  s.addText(String(i + 1), { x: x + 0.05, y: 2.3, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: HF, fontSize: 18, color: WHITE, bold: true, margin: 0 });
  card(s, x, 3.05, pw, 3.5);
  s.addText(p[0], { x: x + 0.22, y: 3.25, w: pw - 0.4, h: 0.4, fontFace: HF, fontSize: 17, color: INK, bold: true, margin: 0 });
  s.addText(p[1], { x: x + 0.22, y: 3.68, w: pw - 0.4, h: 0.35, fontFace: BF, fontSize: 12, color: BLUE_DK, bold: true, margin: 0 });
  s.addText(p[2], { x: x + 0.22, y: 4.05, w: pw - 0.4, h: 0.4, fontFace: HF, fontSize: 13, color: TEXT, bold: true, margin: 0 });
  s.addText(p[3].map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < p[3].length - 1 } })),
    { x: x + 0.22, y: 4.5, w: pw - 0.4, h: 1.9, fontFace: BF, fontSize: 12, color: TEXT, paraSpaceAfter: 6, margin: 0 });
});

/* ============================================================ */
/* 8 — KPIs                                                     */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Erfolgsmessung", "KPIs & erwartete Wirkung");

card(s, MX, 2.15, 6.55, 4.5);
s.addText("Digitale Selbstwirksamkeit der Mentees (Selbsteinschätzung)", { x: MX + 0.3, y: 2.32, w: 6, h: 0.6, fontFace: HF, fontSize: 14, color: INK, bold: true, margin: 0 });
s.addChart(pres.charts.BAR, [{ name: "Score", labels: ["Vorher", "nach Pilot", "Ziel 12 Mon."], values: [42, 63, 80] }], {
  x: MX + 0.15, y: 2.95, w: 6.2, h: 3.4, barDir: "col",
  chartColors: [BLUE, BLUE_DK, NAVY],
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontSize: 12, dataLabelFontBold: true,
  valAxisHidden: true, valGridLine: { style: "none" },
  catAxisLabelColor: TEXT, catAxisLabelFontSize: 12,
  showLegend: false, showTitle: false, barGapWidthPct: 60,
  valAxisMaxVal: 100, valAxisMinVal: 0,
});

const kpis = [
  ["Teilnahmequote", "≥ 60% der Zielgruppe im 1. Jahr"],
  ["Zufriedenheit", "Ø Feedback ≥ 4,2 / 5"],
  ["Abgeschlossene Treffen", "≥ 80% der geplanten Termine"],
  ["Retention Ü50", "+ messbare Wirkung auf Bindung"],
];
kpis.forEach((k, i) => {
  const y = 2.15 + i * 1.13;
  card(s, 7.5, y, 5.13, 1.0, i % 2 ? WHITE : ICE);
  s.addShape(pres.shapes.RECTANGLE, { x: 7.5, y, w: 0.1, h: 1.0, fill: { color: i % 2 ? BLUE : NAVY } });
  s.addText(k[0], { x: 7.78, y: y + 0.14, w: 4.7, h: 0.4, fontFace: HF, fontSize: 15, color: INK, bold: true, margin: 0 });
  s.addText(k[1], { x: 7.78, y: y + 0.52, w: 4.7, h: 0.4, fontFace: BF, fontSize: 12.5, color: TEXT, margin: 0 });
});

/* ============================================================ */
/* 9 — NUTZEN / BUSINESS CASE                                   */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Business Case", "Nutzen auf drei Ebenen");

const benefit = [
  ["Mitarbeitende", NAVY, ["Mehr digitale Sicherheit", "Wertschätzung & Sichtbarkeit", "Neue Netzwerke über Abteilungen"]],
  ["Unternehmen", BLUE_DK, ["Wissenstransfer gesichert", "Schnellere Tool-Adoption", "Stärkere Mitarbeiterbindung"]],
  ["Kultur", NAVY, ["Generationen auf Augenhöhe", "Gelebte Lernkultur", "Attraktives Employer Branding"]],
];
benefit.forEach((b, i) => {
  const x = MX + i * (3.92 + 0.18);
  card(s, x, 2.2, 3.92, 4.0);
  s.addShape(pres.shapes.RECTANGLE, { x, y: 2.2, w: 3.92, h: 0.85, fill: { color: b[1] } });
  s.addText(b[0], { x: x + 0.3, y: 2.2, w: 3.4, h: 0.85, fontFace: HF, fontSize: 19, color: WHITE, bold: true, valign: "middle", margin: 0 });
  s.addText(b[2].map((t, k) => ({ text: t, options: { bullet: { code: "2713" }, breakLine: true, paraSpaceAfter: 10 } })),
    { x: x + 0.3, y: 3.35, w: 3.4, h: 2.6, fontFace: BF, fontSize: 14, color: TEXT, margin: 0 });
});
s.addText("Geringe Investition, breite Wirkung: Relational Mentoring nutzt vorhandene interne Kompetenzen statt teurer externer Schulungen.",
  { x: MX, y: 6.45, w: W - 2 * MX, h: 0.5, fontFace: BF, fontSize: 13.5, color: MUTED, italic: true, align: "center", margin: 0 });

/* ============================================================ */
/* 10 — ERFOLGSFAKTOREN & RISIKEN                               */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: WHITE };
pageTitle(s, "Voraussetzungen", "Erfolgsfaktoren & Risiken im Blick");

card(s, MX, 2.15, 5.85, 4.4);
s.addText("Erfolgsfaktoren", { x: MX + 0.35, y: 2.4, w: 5, h: 0.5, fontFace: HF, fontSize: 18, color: NAVY, bold: true, margin: 0 });
s.addText([
  "Klares Commitment der Führung",
  "Freiwilligkeit & echte Augenhöhe",
  "Gutes Onboarding der Tandems",
  "Sichtbare Erfolge früh kommunizieren",
  "Verankerung in HR-Prozessen",
].map((t, k, a) => ({ text: t, options: { bullet: { code: "2713" }, breakLine: k < a.length - 1, paraSpaceAfter: 12, color: TEXT } })),
  { x: MX + 0.35, y: 3.0, w: 5.15, h: 3.3, fontFace: BF, fontSize: 14.5, margin: 0 });

card(s, 6.95, 2.15, 5.68, 4.4);
s.addText("Risiken & Gegenmaßnahmen", { x: 7.3, y: 2.4, w: 5, h: 0.5, fontFace: HF, fontSize: 18, color: BLUE_DK, bold: true, margin: 0 });
const risks = [
  ["Geringe Teilnahme", "Niedrigschwellig starten, Vorbilder zeigen"],
  ["Zeit im Arbeitsalltag", "Feste Regeltermine, Rückhalt der Führung"],
  ["Datenschutz-Bedenken", "Transparenz, BR früh einbinden"],
  ["Verlust an Momentum", "Feedback-Auswertung & sichtbare Ergebnisse"],
];
risks.forEach((r, i) => {
  const y = 3.0 + i * 0.82;
  s.addShape(pres.shapes.OVAL, { x: 7.3, y: y + 0.05, w: 0.16, h: 0.16, fill: { color: BLUE } });
  s.addText([
    { text: r[0] + " — ", options: { bold: true, color: INK } },
    { text: r[1], options: { color: TEXT } },
  ], { x: 7.6, y: y - 0.05, w: 4.85, h: 0.7, fontFace: BF, fontSize: 13.5, valign: "middle", lineSpacingMultiple: 1.0, margin: 0 });
});

/* ============================================================ */
/* 11 — CLOSING / NEXT STEPS                                    */
/* ============================================================ */
s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: -1.8, y: 4.2, w: 5.4, h: 5.4, fill: { color: NAVY2 } });
s.addShape(pres.shapes.OVAL, { x: 11.2, y: -1.6, w: 4.2, h: 4.2, fill: { color: BLUE_DK, transparency: 50 } });

s.addText("Nächste Schritte", { x: MX, y: 0.95, w: 10, h: 0.9, fontFace: HF, fontSize: 38, color: WHITE, bold: true, margin: 0 });
s.addText("Für eine Arbeitswelt, in der Erfahrung und digitale Kompetenz sich gegenseitig stärken.",
  { x: MX, y: 1.85, w: 10.5, h: 0.6, fontFace: BF, fontSize: 16, color: BLUE, italic: true, margin: 0 });

const next = [
  ["Entscheidung", "Freigabe für einen 4-Monats-Pilot"],
  ["Setup", "Ziele, KPIs & Pilotbereich festlegen"],
  ["Start", "Erste 10–15 Tandems matchen"],
];
next.forEach((n, i) => {
  const x = MX + i * 4.05;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.0, w: 3.7, h: 2.3, fill: { color: NAVY2 }, line: { color: BLUE_DK, width: 1 }, rectRadius: 0.1 });
  numCircle(s, x + 0.3, 3.3, i + 1, BLUE);
  s.addText(n[0], { x: x + 0.3, y: 4.05, w: 3.1, h: 0.4, fontFace: HF, fontSize: 17, color: WHITE, bold: true, margin: 0 });
  s.addText(n[1], { x: x + 0.3, y: 4.5, w: 3.1, h: 0.7, fontFace: BF, fontSize: 13, color: ICE, lineSpacingMultiple: 1.1, margin: 0 });
});

s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 6.2, w: 0.07, h: 0.7, fill: { color: BLUE } });
s.addText([
  { text: "DigitalTogether", options: { breakLine: true, bold: true, color: WHITE, fontSize: 16, fontFace: HF } },
  { text: "Miteinander. Füreinander. Wissen verbindet.", options: { color: ICE, fontSize: 12 } },
], { x: MX + 0.27, y: 6.15, w: 8, h: 0.8, fontFace: BF, valign: "middle", margin: 0 });

pres.writeFile({ fileName: "DigitalTogether_HR-Strategie.pptx" }).then(f => console.log("Saved:", f));
