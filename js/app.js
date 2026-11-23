/* NetTrail - app */
(() => {
'use strict';
const C = window.NT_CONTENT;
const KEY = 'nettrail_v1';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clone = o => JSON.parse(JSON.stringify(o));

/* ---------- dates ---------- */
const fmt = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = () => fmt(new Date());
const dayDiff = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
const weekKey = () => { const d = new Date(); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return fmt(d); };

/* ---------- state ---------- */
const DEF = {
  v: 1, lang: 'pt', onboarded: false, section: 1, xp: 0, streak: 0, best: 0, last: null,
  lessons: {}, unlocked: ['u1'], unitDone: {}, mistakes: {},
  st: { ans: 0, cor: 0, perfect: 0, lessons: 0, subnet: 0, en: 0, practice: 0, bestCombo: 0, quests: 0, weeks: 0, jumps: 0, night: 0, early: 0 },
  xpDay: {}, daily: null, weekly: null, ach: {}, sound: true, hint: true, goal: 50, theme: 'auto',
  bytes: null, av: null, owned: [], dogName: 'Patch'
};
function load() {
  try {
    const r = JSON.parse(localStorage.getItem(KEY));
    if (r && r.v) return Object.assign(clone(DEF), r, { st: Object.assign({}, DEF.st, r.st || {}) });
  } catch (e) { }
  return clone(DEF);
}
let S = load();
const A = window.NTAvatar, M = window.NTMascot;
let welcomeBytes = 0;
function migrate() {
  if (S.bytes == null) { welcomeBytes = Math.floor(S.xp / 10) + 15 * Object.keys(S.ach || {}).length; S.bytes = welcomeBytes; }
  if (!S.av) S.av = Object.assign({}, A.DEFAULT);
  if (!Array.isArray(S.owned)) S.owned = [];
  A.ITEMS.filter(i => i.price === 0 && !i.ach).forEach(i => { if (!S.owned.includes(i.id)) S.owned.push(i.id); });
  if (!S.dogName) S.dogName = 'Patch';
}
migrate();
const addBytes = n => { S.bytes = (S.bytes || 0) + n; };
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

/* ---------- i18n ---------- */
const T = x => x == null ? '' : Array.isArray(x) ? x[S.lang === 'pt' ? 0 : 1] : String(x);
const TO = x => Array.isArray(x) ? x[S.lang === 'pt' ? 1 : 0] : '';
const UI = {
  avatar: ['Avatar', 'Avatar'], learn: ['Aprender', 'Learn'], practice: ['Praticar', 'Practice'], missions: ['Missões', 'Quests'], profile: ['Perfil', 'Profile'],
  start: ['Começar', 'Start'], continue: ['Continuar', 'Continue'], check: ['Verificar', 'Check'], skip: ['Pular', 'Skip'],
  guide: ['Guia', 'Guide'], unit: ['Unidade', 'Unit'], lesson: ['Lição', 'Lesson'], checkpoint: ['Teste da unidade', 'Unit test'],
  locked: ['Bloqueado', 'Locked'], jumpHere: ['Pular para cá', 'Jump here'], practiceAgain: ['Praticar de novo', 'Practice again'],
  correct: ['Correto!', 'Correct!'], wrong: ['Não foi dessa vez', 'Not quite'], answer: ['Resposta correta:', 'Correct answer:'],
  praise: [['Mandou bem!', 'Excelente!', 'Isso aí!', 'Perfeito!', 'Muito bem!'], ['Nice!', 'Excellent!', 'You got it!', 'Perfect!', 'Great job!']],
  pMc: ['Escolha a resposta correta', 'Choose the correct answer'], pTf: ['Verdadeiro ou falso?', 'True or false?'],
  pOrder: ['Coloque na ordem correta', 'Put in the correct order'], pMatch: ['Toque nos pares correspondentes', 'Tap the matching pairs'],
  pFill: ['Digite a resposta', 'Type the answer'], true: ['Verdadeiro', 'True'], false: ['Falso', 'False'],
  typeHere: ['Digite aqui...', 'Type here...'], tapItems: ['Toque nos itens abaixo na ordem certa', 'Tap the items below in the right order'],
  lessonDone: ['Lição concluída!', 'Lesson complete!'], unitDoneT: ['Unidade concluída!', 'Unit complete!'], practiceDone: ['Treino concluído!', 'Practice complete!'],
  totalXp: ['XP ganho', 'XP earned'], accuracy: ['Precisão', 'Accuracy'], time: ['Tempo', 'Time'], combo: ['Combo máx.', 'Max combo'],
  quitTitle: ['Sair da lição?', 'Quit lesson?'], quitText: ['O progresso desta lição será perdido.', 'Progress in this lesson will be lost.'],
  quit: ['Sair', 'Quit'], keep: ['Continuar estudando', 'Keep learning'], cancel: ['Cancelar', 'Cancel'],
  dayStreak: ['dias seguidos', 'day streak'], dailyGoal: ['Meta diária', 'Daily goal'], dailyQuests: ['Missões do dia', 'Daily quests'],
  weeklyQuest: ['Missão da semana', 'Weekly quest'], achievements: ['Conquistas', 'Achievements'], stats: ['Estatísticas', 'Statistics'],
  settings: ['Configurações', 'Settings'], language: ['Idioma', 'Language'], level: ['Nível', 'Level'], sound: ['Sons', 'Sounds'],
  showHint: ['Mostrar tradução nas questões', 'Show translation in questions'], theme: ['Tema', 'Theme'],
  auto: ['Automático', 'Automatic'], light: ['Claro', 'Light'], dark: ['Escuro', 'Dark'],
  backup: ['Backup do progresso', 'Progress backup'], export: ['Exportar', 'Export'], import: ['Importar', 'Import'],
  reset: ['Apagar todo o progresso', 'Reset all progress'], on: ['Ligado', 'On'], off: ['Desligado', 'Off'],
  xpTotal: ['XP total', 'Total XP'], lessonsDone: ['Lições feitas', 'Lessons done'], bestStreak: ['Maior sequência', 'Best streak'],
  accTotal: ['Precisão geral', 'Overall accuracy'], last7: ['XP nos últimos 7 dias', 'XP in the last 7 days'], playerLevel: ['Nível', 'Level'],
  welcome: ['Bem-vindo ao NetTrail!', 'Welcome to NetTrail!'], welcomeSub: ['Aprenda redes, cabeamento, rack e troubleshooting em lições rápidas.', 'Learn networking, cabling, racks and troubleshooting in quick lessons.'],
  chooseLang: ['Escolha o idioma', 'Choose your language'], chooseLevel: ['Qual o seu nível?', "What's your level?"], chooseGoal: ['Meta diária', 'Daily goal'],
  goalCasual: ['Leve', 'Casual'], goalRegular: ['Regular', 'Regular'], goalSerious: ['Intenso', 'Serious'],
  letsGo: ['Vamos lá!', "Let's go!"], changeAnytime: ['Você pode mudar o nível quando quiser e também pular para qualquer unidade.', 'You can change your level anytime and also jump to any unit.'],
  jumpTitle: ['Pular para esta unidade?', 'Jump to this unit?'],
  jumpText: ['Faça um teste rápido (acerte 80%) ou desbloqueie direto se você já domina o conteúdo anterior.', 'Take a quick test (score 80%) or unlock it directly if you already know the earlier content.'],
  jumpTest: ['Fazer teste de salto', 'Take jump test'], unlockDirect: ['Desbloquear sem teste', 'Unlock without test'],
  jumpPass: ['Você passou! Unidade desbloqueada.', 'You passed! Unit unlocked.'], jumpFail: ['Quase! Precisa de 80% para pular. Tente de novo quando quiser.', 'Almost! You need 80% to jump. Try again anytime.'],
  lockedLesson: ['Lição bloqueada', 'Locked lesson'], lockedLessonText: ['Quer fazer esta lição antes das anteriores?', 'Do you want to take this lesson before the previous ones?'],
  doAnyway: ['Fazer mesmo assim', 'Start anyway'],
  pr_mistakes: ['Revisar erros', 'Review mistakes'], pr_mistakesD: ['Questões que você errou voltam aqui até você acertar.', 'Questions you missed come back here until you get them right.'],
  pr_random: ['Treino rápido', 'Quick practice'], pr_randomD: ['10 questões aleatórias das unidades liberadas.', '10 random questions from unlocked units.'],
  pr_subnet: ['Treino de subnetting', 'Subnetting drill'], pr_subnetD: ['Questões geradas na hora: máscaras, hosts, redes e binário. Infinito!', 'Freshly generated questions: masks, hosts, networks and binary. Endless!'],
  pr_ports: ['Portas e protocolos', 'Ports & protocols'], pr_portsD: ['Decore as portas mais cobradas.', 'Memorize the most common ports.'],
  pr_vocab: ['Vocabulário PT ↔ EN', 'Vocabulary PT ↔ EN'], pr_vocabD: ['Termos técnicos em português e inglês.', 'Technical terms in Portuguese and English.'],
  pr_howto: ['Como calcular sub-redes', 'How to calculate subnets'], pr_howtoD: ['Passo a passo de cada tipo de questão, com exemplos novos a cada toque.', 'Step by step for each question type, with fresh examples on every tap.'],
  pr_subtable: ['Tabela de sub-redes', 'Subnet table'], pr_subtableD: ['Prefixo, máscara, bloco e hosts lado a lado, mais os blocos de rede/broadcast.', 'Prefix, mask, block and hosts side by side, plus network/broadcast blocks.'],
  pr_bintable: ['Tabela binária', 'Binary table'], pr_bintableD: ['Abra a tabela de potências de 2 (2048 … 1) e preencha com 0 e 1 para converter números.', 'Open the powers-of-2 table (2048 … 1) and fill in 0s and 1s to convert numbers.'],
  pr_cmd: ['Comandos', 'Commands'], pr_cmdD: ['ping, ipconfig, tracert, show... digite os comandos.', 'ping, ipconfig, tracert, show... type the commands.'],
  noMistakes: ['Nenhum erro para revisar. Continue assim!', 'No mistakes to review. Keep it up!'],
  pending: ['pendentes', 'pending'], exportText: ['Copie este código e cole em "Importar" no outro aparelho (ou baixe o arquivo).', 'Copy this code and paste it into "Import" on the other device (or download the file).'],
  copy: ['Copiar', 'Copy'], copied: ['Copiado!', 'Copied!'], download: ['Baixar arquivo', 'Download file'],
  importText: ['Cole aqui o código exportado ou escolha o arquivo de backup. Isso substitui o progresso deste aparelho.', 'Paste the exported code or choose the backup file. This replaces the progress on this device.'],
  importOk: ['Progresso importado!', 'Progress imported!'], importBad: ['Código inválido.', 'Invalid code.'], chooseFile: ['Escolher arquivo', 'Choose file'],
  resetConfirm: ['Tem certeza? Todo o progresso deste aparelho será apagado.', 'Are you sure? All progress on this device will be erased.'], yesReset: ['Sim, apagar', 'Yes, erase'],
  questDone: ['Missão concluída!', 'Quest complete!'], achUnlocked: ['Conquista desbloqueada!', 'Achievement unlocked!'],
  completeStreak: ['Faça uma lição hoje para manter a sequência!', 'Do a lesson today to keep your streak!'], streakSafe: ['Sequência garantida hoje 🔥', 'Streak secured today 🔥'],
  section: ['Seção', 'Section'], jumpSection: ['Ir para este nível', 'Go to this level'], current: ['Nível atual', 'Current level'],
  install: ['Instalar no aparelho', 'Install on device'], resetsIn: ['Renova à meia-noite', 'Resets at midnight'],
  generated: ['questão gerada', 'generated question'], combo2: ['seguidas!', 'in a row!']
};
const u = k => T(UI[k]);

/* ---------- content index ---------- */
const UNITS = C.units;
const QIDX = {};
UNITS.forEach(un => un.q.forEach((q, i) => { q.id = un.id + '_' + i; q.uid = un.id; QIDX[q.id] = q; }));
const unitIdx = id => UNITS.findIndex(x => x.id === id);
const LPU = 3; // lessons per unit (+1 checkpoint)
const lid = (un, k) => k === LPU ? un.id + '-CP' : un.id + '-L' + k;

/* ---------- question generators (subnetting etc.) ---------- */
const bin8 = n => n.toString(2).padStart(8, '0');
const maskStr = n => { const m = n === 0 ? 0 : (0xFFFFFFFF << (32 - n)) >>> 0; return [24, 16, 8, 0].map(s => (m >>> s) & 255).join('.'); };
const prefixIP = () => Math.random() < .5 ? '192.168.' + rnd(0, 254) : '10.' + rnd(0, 255) + '.' + rnd(0, 255);
function mcOf(q, correct, wrongs, e) {
  const o = [correct]; for (const w of wrongs) { if (!o.some(x => String(x) === String(w))) o.push(w); if (o.length === 4) break; }
  return { t: 'mc', q, o, a: 0, e, gen: true, sub: true };
}
function netBlock() { const n = rnd(24, 30), block = 2 ** (32 - n), net = rnd(0, 256 / block - 1) * block, host = net + rnd(1, block - 2), p = prefixIP(); return { n, block, net, bc: net + block - 1, host, p }; }
const GEN = {
  bin() {
    const n = rnd(1, 255);
    const sum = [128, 64, 32, 16, 8, 4, 2, 1].filter(v => n & v).join(' + ');
    if (Math.random() < .5) return { t: 'fill', gen: true, sub: true, q: [`Converta o binário ${bin8(n)} para decimal: ___`, `Convert binary ${bin8(n)} to decimal: ___`], a: [String(n)], e: [`${sum} = ${n}`, `${sum} = ${n}`] };
    return { t: 'fill', gen: true, sub: true, q: [`Converta ${n} para binário (8 bits): ___`, `Convert ${n} to binary (8 bits): ___`], a: [bin8(n), n.toString(2)], e: [`${n} = ${sum} → ${bin8(n)}`, `${n} = ${sum} → ${bin8(n)}`] };
  },
  hosts() {
    const n = rnd(20, 30), h = 2 ** (32 - n) - 2;
    return mcOf([`Quantos hosts utilizáveis tem uma rede /${n}?`, `How many usable hosts does a /${n} have?`], h, [h + 2, 2 ** (33 - n) - 2, 2 ** (31 - n) - 2, h + 1].filter(x => x > 0),
      [`2^(32−${n}) − 2 = 2^${32 - n} − 2 = ${h}`, `2^(32−${n}) − 2 = 2^${32 - n} − 2 = ${h}`]);
  },
  mask() {
    const n = rnd(17, 30);
    return mcOf([`Qual a máscara decimal de /${n}?`, `What is the dotted-decimal mask for /${n}?`], maskStr(n), [maskStr(n + 1 > 30 ? n - 2 : n + 1), maskStr(n - 1), maskStr(n + 2 > 30 ? n - 3 : n + 2)],
      [`/${n} = ${n} bits 1 → ${maskStr(n)}`, `/${n} = ${n} one-bits → ${maskStr(n)}`]);
  },
  cidr() {
    const n = rnd(17, 30);
    return { t: 'fill', gen: true, sub: true, q: [`A máscara ${maskStr(n)} equivale a qual prefixo? /___`, `Mask ${maskStr(n)} equals which prefix? /___`], a: [String(n), '/' + n],
      e: [`Conte os bits 1 da máscara: ${n}.`, `Count the one-bits in the mask: ${n}.`] };
  },
  network() {
    const b = netBlock(), mask = 256 - b.block;
    return mcOf([`Qual o endereço de rede de ${b.p}.${b.host}/${b.n}?`, `What is the network address of ${b.p}.${b.host}/${b.n}?`], `${b.p}.${b.net}`,
      [`${b.p}.${b.bc}`, `${b.p}.${b.host}`, `${b.p}.${b.net + b.block <= 255 ? b.net + b.block : b.net - b.block}`, `${b.p}.0`],
      [`Bloco = 256 − ${mask} = ${b.block}. ${b.host} está no bloco ${b.net}–${b.bc}.`, `Block = 256 − ${mask} = ${b.block}. ${b.host} is in block ${b.net}–${b.bc}.`]);
  },
  broadcast() {
    const b = netBlock(), mask = 256 - b.block;
    return mcOf([`Qual o broadcast de ${b.p}.${b.host}/${b.n}?`, `What is the broadcast address of ${b.p}.${b.host}/${b.n}?`], `${b.p}.${b.bc}`,
      [`${b.p}.${b.net}`, `${b.p}.255`, `${b.p}.${b.bc + 1 <= 255 ? b.bc + 1 : b.bc - 1}`, `${b.p}.${b.host}`],
      [`Bloco = 256 − ${mask} = ${b.block}. Rede ${b.net}, broadcast ${b.net} + ${b.block} − 1 = ${b.bc}.`, `Block = 256 − ${mask} = ${b.block}. Network ${b.net}, broadcast ${b.net} + ${b.block} − 1 = ${b.bc}.`]);
  },
  need() {
    const h = rnd(3, 1000); let n = 30; while (2 ** (32 - n) - 2 < h) n--;
    return mcOf([`Você precisa de ${h} hosts. Qual o menor prefixo que atende?`, `You need ${h} hosts. What is the smallest subnet that fits?`], '/' + n, ['/' + (n + 1), '/' + (n - 1), '/' + (n - 2), '/' + (n + 2)],
      [`/${n} → 2^${32 - n} − 2 = ${2 ** (32 - n) - 2} hosts (≥ ${h}). /${n + 1} teria só ${2 ** (31 - n) - 2}.`, `/${n} → 2^${32 - n} − 2 = ${2 ** (32 - n) - 2} hosts (≥ ${h}). /${n + 1} would only have ${2 ** (31 - n) - 2}.`]);
  }
};
function genQ(types, count) { const out = []; for (let i = 0; i < count; i++) { const t = types[rnd(0, types.length - 1)]; const q = GEN[t](); q.id = 'gen_' + t; out.push(q); } return out; }

/* ---------- unlock logic ---------- */
const unitComplete = i => !!S.unitDone[UNITS[i].id];
const unitUnlocked = i => i === 0 || S.unlocked.includes(UNITS[i].id) || unitComplete(i - 1);
const nodeDone = (un, k) => !!S.lessons[lid(un, k)];
function nodeAvail(i, k) { const un = UNITS[i]; if (!unitUnlocked(i)) return false; return k === 0 || nodeDone(un, k - 1) || nodeDone(un, k) || !!S.unitDone[un.id]; }
function currentNode() {
  const scan = skipDone => { for (let i = 0; i < UNITS.length; i++) { if (skipDone && S.unitDone[UNITS[i].id]) continue; for (let k = 0; k <= LPU; k++) if (nodeAvail(i, k) && !nodeDone(UNITS[i], k)) return [i, k]; } return null; };
  return scan(true) || scan(false);
}
function unlockSectionStart(sec) { const un = UNITS.find(x => x.sec === sec); if (un && !S.unlocked.includes(un.id)) S.unlocked.push(un.id); }

/* ---------- streak / xp / missions ---------- */
const curStreak = () => S.last && (S.last === today() || dayDiff(S.last, today()) === 1) ? S.streak : 0;
const xpToday = () => S.xpDay[today()] || 0;
const playerLevel = () => Math.floor(Math.sqrt(S.xp / 40)) + 1;
const lvlXp = l => 40 * (l - 1) ** 2;
const QUESTS = {
  xp: { tg: [30, 50, 80], tx: ['Ganhe {n} XP', 'Earn {n} XP'], ic: '⚡' },
  lessons: { tg: [2, 3], tx: ['Complete {n} lições', 'Complete {n} lessons'], ic: '📘' },
  perfect: { tg: [1, 2], tx: ['Termine {n} lição(ões) sem errar', 'Finish {n} lesson(s) with no mistakes'], ic: '💎' },
  correct: { tg: [15, 25], tx: ['Acerte {n} questões', 'Answer {n} questions correctly'], ic: '✅' },
  combo: { tg: [5, 8], tx: ['Acerte {n} seguidas', 'Get {n} correct in a row'], ic: '🔥' },
  practice: { tg: [1], tx: ['Complete 1 treino da aba Praticar', 'Complete 1 practice session'], ic: '🏋️' }
};
function seeded(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }
function ensureQuests() {
  const d = today();
  if (!S.daily || S.daily.date !== d) {
    const r = seeded(d), keys = Object.keys(QUESTS), pick = [];
    while (pick.length < 3) { const k = keys[Math.floor(r() * keys.length)]; if (!pick.includes(k)) pick.push(k); }
    S.daily = { date: d, list: pick.map(k => ({ k, n: QUESTS[k].tg[Math.floor(r() * QUESTS[k].tg.length)], p: 0, done: false })) };
  }
  const w = weekKey();
  if (!S.weekly || S.weekly.key !== w) S.weekly = { key: w, xp: 0, target: 250, done: false };
}
function addXP(n, fromQuest) {
  S.xp += n; const d = today(); S.xpDay[d] = (S.xpDay[d] || 0) + n;
  ensureQuests(); S.weekly.xp += n;
  if (!S.weekly.done && S.weekly.xp >= S.weekly.target) { S.weekly.done = true; S.st.weeks = (S.st.weeks || 0) + 1; toast('🏆 ' + u('weeklyQuest') + ' +50 XP · 🪙+25'); addBytes(25); addXP(50, true); }
  if (!fromQuest) quest('xp', n);
}
function quest(k, amount, isMax) {
  ensureQuests();
  for (const q of S.daily.list) {
    if (q.k !== k || q.done) continue;
    q.p = isMax ? Math.max(q.p, amount) : q.p + amount;
    if (q.p >= q.n) { q.p = q.n; q.done = true; S.st.quests = (S.st.quests || 0) + 1; toast(QUESTS[k].ic + ' ' + u('questDone') + ' +10 XP · 🪙+5'); sfx('quest'); addBytes(5); addXP(10, true); }
  }
}
function prune() { const ks = Object.keys(S.xpDay).sort(); while (ks.length > 60) delete S.xpDay[ks.shift()]; }

/* ---------- achievements ---------- */
const ACH = [
  { id: 'first', ic: '🎓', n: ['Primeiro passo', 'First step'], d: ['Complete sua primeira lição', 'Complete your first lesson'], ok: () => S.st.lessons >= 1 },
  { id: 's3', ic: '🔥', n: ['Aquecendo', 'Warming up'], d: ['Sequência de 3 dias', '3-day streak'], ok: () => S.best >= 3 },
  { id: 's7', ic: '🔥', n: ['Semana cheia', 'Full week'], d: ['Sequência de 7 dias', '7-day streak'], ok: () => S.best >= 7 },
  { id: 's30', ic: '🌋', n: ['Imparável', 'Unstoppable'], d: ['Sequência de 30 dias', '30-day streak'], ok: () => S.best >= 30 },
  { id: 'x500', ic: '⚡', n: ['Energizado', 'Energized'], d: ['Ganhe 500 XP', 'Earn 500 XP'], ok: () => S.xp >= 500 },
  { id: 'x2000', ic: '⚡', n: ['Alta tensão', 'High voltage'], d: ['Ganhe 2000 XP', 'Earn 2000 XP'], ok: () => S.xp >= 2000 },
  { id: 'c100', ic: '✅', n: ['Cem acertos', 'Hundred right'], d: ['Acerte 100 questões', 'Answer 100 questions correctly'], ok: () => S.st.cor >= 100 },
  { id: 'c500', ic: '🎯', n: ['Atirador de elite', 'Sharpshooter'], d: ['Acerte 500 questões', 'Answer 500 questions correctly'], ok: () => S.st.cor >= 500 },
  { id: 'p5', ic: '💎', n: ['Perfeccionista', 'Perfectionist'], d: ['5 lições sem errar', '5 flawless lessons'], ok: () => S.st.perfect >= 5 },
  { id: 'unit', ic: '🏅', n: ['Unidade dominada', 'Unit mastered'], d: ['Conclua o teste de uma unidade', 'Pass a unit test'], ok: () => UNITS.some(x => S.unitDone[x.id] === true) },
  ...C.sections.map(s => ({ id: 'sec' + s.id, ic: s.achIc || '🏆', n: s.ach || s.name, d: [`Conclua todas as unidades de ${s.name[0]}`, `Finish all ${s.name[1]} units`], ok: () => UNITS.filter(x => x.sec === s.id).every(x => S.unitDone[x.id]) })),
  { id: 'sub', ic: '🧮', n: ['Mestre do subnetting', 'Subnetting master'], d: ['Acerte 50 questões de subnetting', 'Answer 50 subnetting questions correctly'], ok: () => S.st.subnet >= 50 },
  { id: 'en', ic: '🌎', n: ['Bilíngue', 'Bilingual'], d: ['Complete 5 lições em inglês', 'Complete 5 lessons in English'], ok: () => S.st.en >= 5 },
  { id: 'gym', ic: '🏋️', n: ['Dedicado', 'Dedicated'], d: ['Complete 10 treinos', 'Complete 10 practice sessions'], ok: () => S.st.practice >= 10 },
  // ---- conquistas extras ----
  { id: 's14', ic: '🔥', n: ['Duas semanas', 'Two weeks'], d: ['Sequência de 14 dias', '14-day streak'], ok: () => S.best >= 14 },
  { id: 's60', ic: '☄️', n: ['Dois meses on-line', 'Two months up'], d: ['Sequência de 60 dias', '60-day streak'], ok: () => S.best >= 60 },
  { id: 's100', ic: '💯', n: ['Uptime 100', 'Uptime 100'], d: ['Sequência de 100 dias', '100-day streak'], ok: () => S.best >= 100 },
  { id: 's365', ic: '👑', n: ['Disponibilidade 99,999%', 'Five nines'], d: ['Sequência de 365 dias', '365-day streak'], ok: () => S.best >= 365 },
  { id: 'x5000', ic: '🔋', n: ['Banco de baterias', 'Battery bank'], d: ['Ganhe 5.000 XP', 'Earn 5,000 XP'], ok: () => S.xp >= 5000 },
  { id: 'x10000', ic: '🏭', n: ['Usina de XP', 'XP power plant'], d: ['Ganhe 10.000 XP', 'Earn 10,000 XP'], ok: () => S.xp >= 10000 },
  { id: 'x25000', ic: '🌩️', n: ['Raio em garrafa', 'Lightning in a bottle'], d: ['Ganhe 25.000 XP', 'Earn 25,000 XP'], ok: () => S.xp >= 25000 },
  { id: 'c1000', ic: '🎯', n: ['Mil acertos', 'Thousand right'], d: ['Acerte 1.000 questões', 'Answer 1,000 questions correctly'], ok: () => S.st.cor >= 1000 },
  { id: 'c2500', ic: '🏹', n: ['Precisão cirúrgica', 'Surgical precision'], d: ['Acerte 2.500 questões', 'Answer 2,500 questions correctly'], ok: () => S.st.cor >= 2500 },
  { id: 'c5000', ic: '🧠', n: ['Enciclopédia de TI', 'IT encyclopedia'], d: ['Acerte 5.000 questões', 'Answer 5,000 questions correctly'], ok: () => S.st.cor >= 5000 },
  { id: 'p25', ic: '💎', n: ['Zero defeitos', 'Zero defects'], d: ['25 lições sem errar', '25 flawless lessons'], ok: () => S.st.perfect >= 25 },
  { id: 'p100', ic: '💠', n: ['Cristal puro', 'Flawless crystal'], d: ['100 lições sem errar', '100 flawless lessons'], ok: () => S.st.perfect >= 100 },
  { id: 'l50', ic: '📚', n: ['Estudante dedicado', 'Dedicated student'], d: ['Complete 50 lições', 'Complete 50 lessons'], ok: () => S.st.lessons >= 50 },
  { id: 'l200', ic: '🎓', n: ['Formado em redes', 'Network graduate'], d: ['Complete 200 lições', 'Complete 200 lessons'], ok: () => S.st.lessons >= 200 },
  { id: 'k15', ic: '🔥', n: ['Em chamas', 'On fire'], d: ['Acerte 15 seguidas numa lição', 'Get 15 right in a row in a lesson'], ok: () => (S.st.bestCombo || 0) >= 15 },
  { id: 'k30', ic: '🌟', n: ['Imbatível', 'Unbeatable'], d: ['Acerte 30 seguidas', 'Get 30 right in a row'], ok: () => (S.st.bestCombo || 0) >= 30 },
  { id: 'q10', ic: '📋', n: ['Caçador de missões', 'Quest hunter'], d: ['Complete 10 missões diárias', 'Complete 10 daily quests'], ok: () => (S.st.quests || 0) >= 10 },
  { id: 'q50', ic: '🗂️', n: ['Colecionador de missões', 'Quest collector'], d: ['Complete 50 missões diárias', 'Complete 50 daily quests'], ok: () => (S.st.quests || 0) >= 50 },
  { id: 'w4', ic: '🏆', n: ['Mês campeão', 'Champion month'], d: ['Complete 4 missões semanais', 'Complete 4 weekly quests'], ok: () => (S.st.weeks || 0) >= 4 },
  { id: 'g7', ic: '📅', n: ['Meta batida', 'Goal crusher'], d: ['Bata a meta diária em 7 dias', 'Hit your daily goal on 7 days'], ok: () => Object.values(S.xpDay).filter(v => v >= S.goal).length >= 7 },
  { id: 'g30', ic: '🗓️', n: ['Disciplina de ferro', 'Iron discipline'], d: ['Bata a meta diária em 30 dias', 'Hit your daily goal on 30 days'], ok: () => Object.values(S.xpDay).filter(v => v >= S.goal).length >= 30 },
  { id: 'u10', ic: '🧱', n: ['Dez unidades', 'Ten units'], d: ['Passe no teste de 10 unidades', 'Pass 10 unit tests'], ok: () => UNITS.filter(x => S.unitDone[x.id] === true).length >= 10 },
  { id: 'u20', ic: '🏗️', n: ['Vinte unidades', 'Twenty units'], d: ['Passe no teste de 20 unidades', 'Pass 20 unit tests'], ok: () => UNITS.filter(x => S.unitDone[x.id] === true).length >= 20 },
  { id: 'uall', ic: '🌐', n: ['Arquiteto completo', 'Full-stack architect'], d: ['Conclua todas as unidades do app', 'Finish every unit in the app'], ok: () => UNITS.every(x => S.unitDone[x.id]) },
  { id: 'jump', ic: '⏩', n: ['Atalho merecido', 'Earned shortcut'], d: ['Passe em um teste de salto', 'Pass a jump test'], ok: () => (S.st.jumps || 0) >= 1 },
  { id: 'sub200', ic: '🧮', n: ['Calculadora humana', 'Human calculator'], d: ['Acerte 200 questões de subnetting', 'Answer 200 subnetting questions correctly'], ok: () => S.st.subnet >= 200 },
  { id: 'en25', ic: '🗽', n: ['Fluente em TI', 'Fluent in IT'], d: ['Complete 25 lições em inglês', 'Complete 25 lessons in English'], ok: () => S.st.en >= 25 },
  { id: 'gym50', ic: '🥋', n: ['Faixa preta', 'Black belt'], d: ['Complete 50 treinos', 'Complete 50 practice sessions'], ok: () => S.st.practice >= 50 },
  { id: 'style', ic: '🛍️', n: ['Estiloso', 'Stylish'], d: ['Compre seu primeiro item na loja', 'Buy your first shop item'], ok: () => boughtCount() >= 1 },
  { id: 'ward10', ic: '👔', n: ['Guarda-roupa', 'Wardrobe'], d: ['Tenha 10 itens comprados', 'Own 10 bought items'], ok: () => boughtCount() >= 10 },
  { id: 'ward25', ic: '🧥', n: ['Closet de TI', 'IT closet'], d: ['Tenha 25 itens comprados', 'Own 25 bought items'], ok: () => boughtCount() >= 25 },
  { id: 'night', ic: '🦉', n: ['Plantão noturno', 'Night shift'], d: ['Complete uma lição entre 0h e 5h', 'Finish a lesson between midnight and 5 am'], ok: () => !!S.st.night },
  { id: 'early', ic: '🌅', n: ['Primeiro turno', 'Early shift'], d: ['Complete uma lição entre 5h e 7h', 'Finish a lesson between 5 and 7 am'], ok: () => !!S.st.early }
];
function boughtCount() { return A.ITEMS.filter(i => i.price > 0 && S.owned.includes(i.id)).length; }
function checkAch() { for (const a of ACH) if (!S.ach[a.id] && a.ok()) { S.ach[a.id] = today(); addBytes(15); setTimeout(() => { toast(a.ic + ' ' + u('achUnlocked') + ' ' + T(a.n) + ' · 🪙+15'); sfx('quest'); }, 900); } }

/* ---------- sound ---------- */
let AC = null;
function sfx(type) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seq = { ok: [[660, 0, .09], [880, .09, .14]], bad: [[220, 0, .18], [180, .12, .22]], done: [[523, 0, .12], [659, .12, .12], [784, .24, .12], [1047, .36, .3]], quest: [[784, 0, .1], [1175, .1, .2]], tap: [[500, 0, .04]] }[type] || [];
    const t0 = AC.currentTime;
    for (const [f, st, d] of seq) {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t0 + st); g.gain.exponentialRampToValueAtTime(type === 'bad' ? .06 : .14, t0 + st + .01); g.gain.exponentialRampToValueAtTime(.0001, t0 + st + d);
      o.connect(g); g.connect(AC.destination); o.start(t0 + st); o.stop(t0 + st + d + .02);
    }
  } catch (e) { }
}

/* ---------- toast / modal ---------- */
function toast(msg) {
  const root = $('#toast-root'), el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg; root.appendChild(el);
  setTimeout(() => el.classList.add('out'), 2600); setTimeout(() => el.remove(), 3000);
}
function modal(html, onMount) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  root.classList.add('open');
  $('.modal-bg', root).addEventListener('click', e => { if (e.target.classList.contains('modal-bg')) closeModal(); });
  $$('[data-close]', root).forEach(b => b.addEventListener('click', closeModal));
  if (onMount) onMount($('.modal', root));
}
function closeModal() { const r = $('#modal-root'); r.classList.remove('open'); r.innerHTML = ''; }

/* ---------- theme ---------- */
function applyTheme() {
  const r = document.documentElement;
  if (S.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', S.theme);
  r.lang = S.lang === 'pt' ? 'pt-BR' : 'en';
}

/* =========================================================
   MAIN RENDER
   ========================================================= */
let tab = 'learn', viewSec = S.section, scrolledOnce = false;
function render() {
  applyTheme(); ensureQuests();
  if (!S.onboarded) return renderOnboarding();
  const app = $('#app');
  const st = curStreak();
  app.innerHTML = `
  <div class="shell">
    <nav class="side">
      <div class="brand">${logo()}<span>NetTrail</span></div>
      ${navItems()}
    </nav>
    <header class="topbar">
      <button class="chip lang" data-act="lang" title="${u('language')}">${S.lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}</button>
      <span class="chip ${st ? 'fire' : 'cold'}" title="${u('dayStreak')}">🔥 ${st}</span>
      <span class="chip xp" title="XP">⚡ ${S.xp}</span>
      <button class="chip bytes" data-tab="avatar" title="Bytes">🪙 ${S.bytes}</button>
      <span class="chip goal" title="${u('dailyGoal')}">${ring(Math.min(1, xpToday() / S.goal), 22)} ${xpToday()}/${S.goal}</span>
    </header>
    <main class="main" id="main">${tab === 'learn' ? viewLearn() : tab === 'practice' ? viewPractice() : tab === 'missions' ? viewMissions() : tab === 'avatar' ? viewAvatar() : viewProfile()}</main>
    <aside class="rail">${railPanel()}</aside>
    <nav class="bottom">${navItems()}</nav>
  </div>`;
  bindMain();
  if (tab === 'learn' && !scrolledOnce) {
    scrolledOnce = true;
    const cur = $('.node.current'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
  }
}
const NAV = [['learn', '🏠'], ['practice', '🏋️'], ['missions', '🎯'], ['avatar', '🐶'], ['profile', '👤']];
const navItems = () => NAV.map(([k, ic]) => `<button class="nav ${tab === k ? 'on' : ''}" data-tab="${k}"><span class="ic">${ic}</span><span class="lb">${u(k)}</span></button>`).join('');
const logo = () => `<svg class="logo" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="var(--primary)"/><path d="M20 22h24M20 32h24M20 42h24" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/><circle cx="20" cy="22" r="5" fill="#fff"/><circle cx="44" cy="32" r="5" fill="#fff"/><circle cx="20" cy="42" r="5" fill="#fff"/><path d="M20 22L44 32L20 42" stroke="#fff" stroke-width="4" fill="none" stroke-linejoin="round"/></svg>`;
function ring(p, size) {
  const r = size / 2 - 3, c = 2 * Math.PI * r;
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="var(--track)" stroke-width="4" fill="none"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
}
const bar = (p, cls = '') => `<div class="bar ${cls}"><i style="width:${Math.round(Math.min(1, p) * 100)}%"></i></div>`;

/* ---------- learn ---------- */
function viewLearn() {
  const sec = C.sections.find(s => s.id === viewSec);
  const cur = currentNode();
  let html = `<div class="sec-tabs">${C.sections.map(s => `<button class="sec-tab ${s.id === viewSec ? 'on' : ''}" data-sec="${s.id}" style="--c:${s.color}">${T(s.name)}${s.id === S.section ? ' ★' : ''}</button>`).join('')}</div>
  <div class="sec-head" style="--c:${sec.color}"><div><div class="eyebrow">${u('section')} ${sec.id}</div><h2>${T(sec.name)}</h2><p>${T(sec.desc)}</p></div>
  ${sec.id !== S.section ? `<button class="btn sm ghost-w" data-setsec="${sec.id}">${u('jumpSection')}</button>` : `<span class="badge-w">${u('current')}</span>`}</div>`;
  UNITS.forEach((un, i) => {
    if (un.sec !== viewSec) return;
    const open = unitUnlocked(i), done = unitComplete(i);
    html += `<section class="unit ${open ? '' : 'locked'}" style="--c:${un.color}">
      <div class="unit-banner">
        <div><div class="eyebrow">${u('unit')} ${i + 1}${done ? ' · ✓' : ''}</div><h3>${un.icon} ${esc(T(un.title))}</h3>${S.hint ? `<div class="alt">${esc(TO(un.title))}</div>` : ''}</div>
        <div class="unit-actions">
          <button class="btn sm ghost-w" data-guide="${i}">📖 ${u('guide')}</button>
          ${un.gen ? `<button class="btn sm ghost-w" data-howto="${un.id === 'u4' ? 'bin' : ''}">📐 ${S.lang === 'pt' ? 'Como calcular' : 'How to solve'}</button>` : ''}
          ${open ? '' : `<button class="btn sm ghost-w" data-jump="${i}">⏩ ${u('jumpHere')}</button>`}
        </div>
      </div>
      <div class="path">`;
    for (let k = 0; k <= LPU; k++) {
      const av = nodeAvail(i, k), dn = nodeDone(un, k), isCur = cur && cur[0] === i && cur[1] === k;
      const off = (i % 2 ? 1 : -1) * [0, 52, 72, 40][k];
      const ic = k === LPU ? '🏆' : dn ? '✓' : av ? '★' : '🔒';
      html += `<div class="node-wrap" style="transform:translateX(${off}px)">
        ${isCur ? `<div class="bubble">${u('start')}</div><div class="path-dog ${off > 0 ? 'left' : 'right'}">${M.render(k === LPU ? 'think' : 'neutral', 120)}</div>` : ''}
        <button class="node ${k === LPU ? 'cp' : ''} ${dn ? 'done' : av ? 'avail' : 'lock'} ${isCur ? 'current' : ''}" data-node="${i}:${k}" aria-label="${k === LPU ? u('checkpoint') : u('lesson') + ' ' + (k + 1)}">${ic}</button>
      </div>`;
    }
    html += `</div></section>`;
  });
  const nextSec = C.sections.find(s => s.id === viewSec + 1);
  if (nextSec) html += `<button class="btn wide outline next-sec" data-sec="${nextSec.id}">${u('section')} ${nextSec.id}: ${T(nextSec.name)} →</button>`;
  return html;
}

/* ---------- practice ---------- */
function viewPractice() {
  const nm = Object.keys(S.mistakes).filter(k => QIDX[k]).length;
  const cards = [
    ['mistakes', '🔁', nm ? `${nm} ${u('pending')}` : ''],
    ['random', '🎲', ''], ['subnet', '🧮', ''], ['howto', '📐', ''], ['subtable', '📋', ''], ['bintable', '🔢', ''], ['ports', '🚪', ''], ['cmd', '⌨️', ''], ['vocab', '🗣️', '']
  ];
  return `<h2 class="page-title">${u('practice')}</h2>
  <div class="grid-cards">${cards.map(([k, ic, extra]) => `
    <button class="pcard" data-practice="${k}"><span class="pic">${ic}</span><span class="ptxt"><b>${u('pr_' + k)}</b><small>${u('pr_' + k + 'D')}</small>${extra ? `<em>${extra}</em>` : ''}</span></button>`).join('')}
  </div>`;
}

/* ---------- missions ---------- */
function questsBlock() {
  ensureQuests();
  return `<div class="card"><div class="card-h"><h3>${u('dailyQuests')}</h3><small>${u('resetsIn')}</small></div>
  ${S.daily.list.map(q => `<div class="quest ${q.done ? 'done' : ''}"><span class="qic">${QUESTS[q.k].ic}</span><div class="qbody"><div class="qt">${esc(T(QUESTS[q.k].tx).replace('{n}', q.n))}</div>${bar(q.p / q.n, 'gold')}<small>${q.p}/${q.n}</small></div><span class="qrw">${q.done ? '✓' : '+10'}</span></div>`).join('')}
  </div>`;
}
function weeklyBlock() {
  return `<div class="card"><div class="card-h"><h3>${u('weeklyQuest')}</h3></div>
  <div class="quest ${S.weekly.done ? 'done' : ''}"><span class="qic">🏆</span><div class="qbody"><div class="qt">${S.lang === 'pt' ? 'Ganhe' : 'Earn'} ${S.weekly.target} XP</div>${bar(S.weekly.xp / S.weekly.target, 'purple')}<small>${Math.min(S.weekly.xp, S.weekly.target)}/${S.weekly.target}</small></div><span class="qrw">${S.weekly.done ? '✓' : '+50'}</span></div></div>`;
}
function goalBlock() {
  const st = curStreak(), safe = S.last === today();
  return `<div class="card goal-card"><div class="goal-row">${ring(Math.min(1, xpToday() / S.goal), 64)}<div><h3>${u('dailyGoal')}</h3><p>${xpToday()} / ${S.goal} XP</p></div></div>
  <div class="streak-line ${safe ? 'safe' : ''}">🔥 <b>${st}</b> ${u('dayStreak')} · ${safe ? u('streakSafe') : u('completeStreak')}</div></div>`;
}
function viewMissions() {
  return `<h2 class="page-title">${u('missions')}</h2>${goalBlock()}${questsBlock()}${weeklyBlock()}
  <div class="card"><div class="card-h"><h3>${u('achievements')}</h3><small>${Object.keys(S.ach).length}/${ACH.length}</small></div>
  <div class="ach-grid">${ACH.map(a => `<div class="ach ${S.ach[a.id] ? 'got' : ''}"><span>${a.ic}</span><b>${esc(T(a.n))}</b><small>${esc(T(a.d))}</small></div>`).join('')}</div></div>`;
}
function railPanel() { return goalBlock() + questsBlock(); }

/* ---------- profile ---------- */
function viewProfile() {
  const lv = playerLevel(), acc = S.st.ans ? Math.round(S.st.cor / S.st.ans * 100) : 0;
  const days = []; for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(fmt(d)); }
  const mx = Math.max(S.goal, ...days.map(d => S.xpDay[d] || 0));
  const wd = S.lang === 'pt' ? ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const opt = (k, v, label) => `<button class="seg ${S[k] === v ? 'on' : ''}" data-set="${k}" data-val="${v}">${label}</button>`;
  return `<h2 class="page-title">${u('profile')}</h2>
  <div class="card av-card">${A.render(S.av, { size: 92, mood: 'happy' })}<div class="grow"><b>${S.lang === 'pt' ? 'Seu avatar' : 'Your avatar'}</b><small>🪙 ${S.bytes} Bytes</small><button class="btn sm primary" data-tab="avatar">✏️ ${S.lang === 'pt' ? 'Personalizar' : 'Customize'}</button></div>${M.render('happy', 120)}</div>
  <div class="card lvl-card"><div class="lvl-badge">${lv}</div><div class="grow"><b>${u('playerLevel')} ${lv}</b>${bar((S.xp - lvlXp(lv)) / (lvlXp(lv + 1) - lvlXp(lv)))}<small>${S.xp} / ${lvlXp(lv + 1)} XP</small></div></div>
  <div class="stats">
    <div class="stat"><span>🔥</span><b>${curStreak()}</b><small>${u('dayStreak')}</small></div>
    <div class="stat"><span>🏅</span><b>${S.best}</b><small>${u('bestStreak')}</small></div>
    <div class="stat"><span>⚡</span><b>${S.xp}</b><small>${u('xpTotal')}</small></div>
    <div class="stat"><span>📘</span><b>${S.st.lessons}</b><small>${u('lessonsDone')}</small></div>
    <div class="stat"><span>🎯</span><b>${acc}%</b><small>${u('accTotal')}</small></div>
    <div class="stat"><span>🏆</span><b>${Object.keys(S.ach).length}</b><small>${u('achievements')}</small></div>
  </div>
  <div class="card"><div class="card-h"><h3>${u('last7')}</h3></div>
    <div class="chart">${days.map(d => { const v = S.xpDay[d] || 0; return `<div class="col" title="${d}: ${v} XP"><small>${v || ''}</small><i style="height:${Math.max(3, v / mx * 100)}%" class="${v >= S.goal ? 'hit' : ''}"></i><span>${wd[new Date(d + 'T12:00:00').getDay()]}</span></div>`; }).join('')}
    <div class="goal-line" style="bottom:calc(${S.goal / mx * 100}% * .78 + 22px)"></div></div>
  </div>
  <div class="card settings"><div class="card-h"><h3>${u('settings')}</h3></div>
    <div class="set-row"><label>${u('language')}</label><div class="segs">${opt('lang', 'pt', '🇧🇷 Português')}${opt('lang', 'en', '🇺🇸 English')}</div></div>
    <div class="set-row"><label>${u('level')}</label><div class="segs">${C.sections.map(s => `<button class="seg ${S.section === s.id ? 'on' : ''}" data-setsec="${s.id}">${T(s.name)}</button>`).join('')}</div></div>
    <div class="set-row"><label>${u('dailyGoal')}</label><div class="segs">${opt('goal', 20, '20 XP')}${opt('goal', 50, '50 XP')}${opt('goal', 100, '100 XP')}</div></div>
    <div class="set-row"><label>${u('sound')}</label><div class="segs">${opt('sound', true, u('on'))}${opt('sound', false, u('off'))}</div></div>
    <div class="set-row"><label>${u('showHint')}</label><div class="segs">${opt('hint', true, u('on'))}${opt('hint', false, u('off'))}</div></div>
    <div class="set-row"><label>${u('theme')}</label><div class="segs">${opt('theme', 'auto', u('auto'))}${opt('theme', 'light', u('light'))}${opt('theme', 'dark', u('dark'))}</div></div>
    <div class="set-row"><label>${u('backup')}</label><div class="segs"><button class="seg" data-act="export">⬆️ ${u('export')}</button><button class="seg" data-act="import">⬇️ ${u('import')}</button></div></div>
    <div class="set-row"><button class="btn danger-o wide" data-act="reset">${u('reset')}</button></div>
  </div>
  <p class="foot">NetTrail · ${UNITS.length} ${S.lang === 'pt' ? 'unidades' : 'units'} · ${Object.keys(QIDX).length} ${S.lang === 'pt' ? 'questões + geradas' : 'questions + generated'}</p>`;
}

/* ---------- avatar & loja ---------- */
let avCat = 'look';
const AV_CATS = [['look', '🎨', ['Visual', 'Look']], ['top', '👕', ['Roupas', 'Outfits']], ['hat', '🎩', ['Chapéus', 'Hats']], ['acc', '🕶️', ['Acessórios', 'Accessories']], ['hand', '🧰', ['Na mão', 'In hand']], ['bg', '🖼️', ['Fundos', 'Backgrounds']]];
const itemOwned = it => (it.price === 0 && !it.ach) || S.owned.includes(it.id) || (it.ach && S.ach[it.ach]);
const achName = id => { const a = ACH.find(x => x.id === id); return a ? a.ic + ' ' + T(a.n) : id; };
function viewAvatar() {
  const pt = S.lang === 'pt';
  let body = '';
  if (avCat === 'look') {
    const idx = k => k === 'skin' || k === 'hairColor';
    const sw = (k, vals, draw) => vals.map((v, i) => { const val = idx(k) ? i : v; return `<button class="look ${S.av[k] === val ? 'on' : ''}" data-look="${k}" data-v="${val}">${draw(v, i)}</button>`; }).join('');
    body = `
      <h4>${pt ? 'Tom de pele' : 'Skin tone'}</h4><div class="looks">${sw('skin', A.SKINS, c => `<span class="sw" style="background:${c}"></span>`)}</div>
      <h4>${pt ? 'Cabelo' : 'Hair'}</h4><div class="looks">${sw('hair', A.HAIRS, h => A.render(Object.assign({}, S.av, { hair: h, hat: null, hand: null, acc: null }), { size: 64, noBg: true }))}</div>
      <h4>${pt ? 'Cor do cabelo' : 'Hair color'}</h4><div class="looks">${sw('hairColor', A.HAIR_COLORS, c => `<span class="sw" style="background:${c}"></span>`)}</div>
      <h4>${pt ? 'Olhos' : 'Eyes'}</h4><div class="looks">${sw('eyes', A.EYES, e => A.render(Object.assign({}, S.av, { eyes: e }), { size: 64, noBg: true }))}</div>
      <h4>${pt ? 'Nome do mascote' : 'Mascot name'}</h4><div class="dog-name"><input id="dogName" maxlength="16" value="${esc(S.dogName)}"><button class="btn sm primary" id="saveDog">${pt ? 'Salvar' : 'Save'}</button></div>`;
  } else {
    const items = A.ITEMS.filter(i => i.cat === avCat);
    const optional = ['hat', 'acc', 'hand'].includes(avCat);
    const card = it => {
      const owned = itemOwned(it), on = S.av[avCat] === it.id;
      const status = on ? `<em class="ist on">✓ ${pt ? 'Usando' : 'Wearing'}</em>` : owned ? `<em class="ist own">${pt ? 'Usar' : 'Wear'}</em>` : it.ach ? `<em class="ist lock">🔒 ${esc(achName(it.ach))}</em>` : `<em class="ist price ${S.bytes >= it.price ? '' : 'short'}">🪙 ${it.price}</em>`;
      return `<button class="item ${on ? 'on' : ''} ${owned ? '' : 'locked'}" data-item="${it.id}">${A.render(Object.assign({}, S.av, { [avCat]: it.id }), { size: 92, mood: 'happy' })}<b>${esc(T(it.n))}</b>${status}</button>`;
    };
    body = `<div class="items">${optional ? `<button class="item ${!S.av[avCat] ? 'on' : ''}" data-item="">${A.render(Object.assign({}, S.av, { [avCat]: null }), { size: 92 })}<b>${pt ? 'Nenhum' : 'None'}</b>${!S.av[avCat] ? `<em class="ist on">✓</em>` : '<em class="ist own">—</em>'}</button>` : ''}${items.map(card).join('')}</div>`;
  }
  return `<h2 class="page-title">${pt ? 'Avatar e loja' : 'Avatar & shop'}</h2>
  <div class="av-top">
    <div class="av-stage">${A.render(S.av, { size: 190, mood: 'happy' })}<div class="av-dog">${M.render('happy', 170)}<small>${esc(S.dogName)}</small></div></div>
    <div class="av-bal"><div>🪙 <b>${S.bytes}</b> Bytes</div><small>${pt ? 'Ganhe Bytes: lição +5 (perfeita +10) · teste da unidade +15 · treino +3 · missão diária +5 · missão semanal +25 · conquista +15' : 'Earn Bytes: lesson +5 (perfect +10) · unit test +15 · practice +3 · daily quest +5 · weekly quest +25 · achievement +15'}</small></div>
  </div>
  <div class="av-tabs">${AV_CATS.map(([k, ic, n]) => `<button class="seg ${avCat === k ? 'on' : ''}" data-avcat="${k}">${ic} ${T(n)}</button>`).join('')}</div>
  <div class="card av-body">${body}</div>`;
}
function bindAvatar() {
  const pt = S.lang === 'pt';
  $$('[data-avcat]').forEach(b => b.onclick = () => { avCat = b.dataset.avcat; render(); });
  $$('[data-look]').forEach(b => b.onclick = () => { const k = b.dataset.look, v = b.dataset.v; S.av[k] = (k === 'skin' || k === 'hairColor') ? +v : v; save(); sfx('tap'); render(); });
  const sd = $('#saveDog'); if (sd) sd.onclick = () => { const v = $('#dogName').value.trim(); if (v) { S.dogName = v; save(); toast('🐶 ' + v + '!'); render(); } };
  $$('[data-item]').forEach(b => b.onclick = () => {
    const id = b.dataset.item;
    if (!id) { S.av[avCat] = null; save(); render(); return; }
    const it = A.ITEMS.find(x => x.id === id);
    if (itemOwned(it)) { S.av[it.cat] = (S.av[it.cat] === id && ['hat', 'acc', 'hand'].includes(it.cat)) ? null : id; save(); sfx('tap'); render(); return; }
    if (it.ach) return toast(`🔒 ${pt ? 'Desbloqueie a conquista' : 'Unlock the achievement'} ${achName(it.ach)}`);
    if (S.bytes < it.price) return toast(`🪙 ${pt ? 'Faltam' : 'You need'} ${it.price - S.bytes} Bytes`);
    modal(`<div class="buy-prev">${A.render(Object.assign({}, S.av, { [it.cat]: it.id }), { size: 150, mood: 'celebrate' })}</div><h3>${esc(T(it.n))}</h3><p>${pt ? 'Comprar por' : 'Buy for'} 🪙 <b>${it.price}</b> Bytes? (${pt ? 'você tem' : 'you have'} ${S.bytes})</p>
      <div class="mbtns"><button class="btn ghost" data-close>${u('cancel')}</button><button class="btn primary" id="buy">${pt ? 'Comprar' : 'Buy'}</button></div>`, m => {
      $('#buy', m).onclick = () => { S.bytes -= it.price; S.owned.push(it.id); S.av[it.cat] = it.id; checkAch(); save(); closeModal(); sfx('quest'); toast('🛍️ ' + T(it.n)); render(); };
    });
  });
}

/* ---------- bindings ---------- */
function bindMain() {
  if (tab === 'avatar') bindAvatar();
  $$('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; if (tab === 'learn') scrolledOnce = false; render(); window.scrollTo(0, 0); });
  $$('[data-act="lang"]').forEach(b => b.onclick = () => { S.lang = S.lang === 'pt' ? 'en' : 'pt'; save(); render(); });
  $$('[data-sec]').forEach(b => b.onclick = () => { viewSec = +b.dataset.sec; render(); window.scrollTo(0, 0); });
  $$('[data-setsec]').forEach(b => b.onclick = () => { S.section = +b.dataset.setsec; viewSec = S.section; unlockSectionStart(S.section); save(); scrolledOnce = false; render(); });
  $$('[data-guide]').forEach(b => b.onclick = () => showGuide(+b.dataset.guide));
  $$('[data-jump]').forEach(b => b.onclick = () => showJump(+b.dataset.jump));
  $$('[data-howto]').forEach(b => b.onclick = () => showHowTo(b.dataset.howto || null));
  $$('[data-node]').forEach(b => b.onclick = () => { const [i, k] = b.dataset.node.split(':').map(Number); nodeClick(i, k, b); });
  $$('[data-practice]').forEach(b => b.onclick = () => startPractice(b.dataset.practice));
  $$('[data-set]').forEach(b => b.onclick = () => {
    const k = b.dataset.set; let v = b.dataset.val;
    if (v === 'true') v = true; else if (v === 'false') v = false; else if (/^\d+$/.test(v)) v = +v;
    S[k] = v; save(); render();
  });
  $$('[data-act="export"]').forEach(b => b.onclick = showExport);
  $$('[data-act="import"]').forEach(b => b.onclick = showImport);
  $$('[data-act="reset"]').forEach(b => b.onclick = () => modal(`<h3>${u('reset')}</h3><p>${u('resetConfirm')}</p><div class="mbtns"><button class="btn ghost" data-close>${u('cancel')}</button><button class="btn danger" id="doReset">${u('yesReset')}</button></div>`,
    m => $('#doReset', m).onclick = () => { const lang = S.lang; S = clone(DEF); S.lang = lang; save(); closeModal(); tab = 'learn'; render(); }));
}

function nodeClick(i, k, el) {
  const un = UNITS[i], av = nodeAvail(i, k), dn = nodeDone(un, k);
  const name = k === LPU ? u('checkpoint') : `${u('lesson')} ${k + 1}/${LPU}`;
  if (!unitUnlocked(i)) return showJump(i);
  if (!av) {
    return modal(`<div class="m-ic">🔒</div><h3>${u('lockedLesson')}</h3><p>${u('lockedLessonText')}</p><div class="mbtns"><button class="btn ghost" data-close>${u('cancel')}</button><button class="btn primary" id="go">${u('doAnyway')}</button></div>`,
      m => $('#go', m).onclick = () => { closeModal(); startLesson(i, k); });
  }
  modal(`<div class="m-unit" style="--c:${un.color}"><div class="eyebrow">${esc(T(un.title))}</div><h3>${name}</h3>
    <p>${k === LPU ? (S.lang === 'pt' ? 'Revise toda a unidade para concluí-la.' : 'Review the whole unit to complete it.') : (S.lang === 'pt' ? 'Lição rápida, sem limite de vidas.' : 'Quick lesson, no lives limit.')}</p>
    <button class="btn white wide" id="go">${dn ? u('practiceAgain') + ' +XP' : u('start') + (k === LPU ? ' +20 XP' : ' +10 XP')}</button></div>`,
    m => $('#go', m).onclick = () => { closeModal(); startLesson(i, k); });
}
function showGuide(i) {
  const un = UNITS[i];
  modal(`<div class="guide-h" style="--c:${un.color}"><span>${un.icon}</span><div><div class="eyebrow">${u('guide')} · ${u('unit')} ${i + 1}</div><h3>${esc(T(un.title))}</h3></div></div>
  <ul class="guide">${un.guide.map(g => `<li>${esc(T(g))}${S.hint ? `<div class="alt">${esc(TO(g))}</div>` : ''}</li>`).join('')}</ul>
  <div class="mbtns"><button class="btn primary wide" data-close>OK</button></div>`);
}
function showJump(i) {
  const un = UNITS[i];
  modal(`<div class="m-ic">⏩</div><h3>${u('jumpTitle')}</h3><p><b>${un.icon} ${esc(T(un.title))}</b></p><p>${u('jumpText')}</p>
  <div class="mbtns col"><button class="btn primary wide" id="jt">${u('jumpTest')}</button><button class="btn ghost wide" id="jd">${u('unlockDirect')}</button><button class="btn link" data-close>${u('cancel')}</button></div>`,
    m => {
      $('#jt', m).onclick = () => { closeModal(); startJump(i); };
      $('#jd', m).onclick = () => { if (!S.unlocked.includes(un.id)) S.unlocked.push(un.id); save(); closeModal(); render(); toast('🔓 ' + T(un.title)); };
    });
}
function showExport() {
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  modal(`<h3>${u('export')}</h3><p>${u('exportText')}</p><textarea class="code" readonly>${code}</textarea>
  <div class="mbtns"><button class="btn ghost" id="dl">${u('download')}</button><button class="btn primary" id="cp">${u('copy')}</button></div>`, m => {
    const ta = $('textarea', m);
    $('#cp', m).onclick = async () => { try { await navigator.clipboard.writeText(code); } catch (e) { ta.select(); document.execCommand('copy'); } toast(u('copied')); };
    $('#dl', m).onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = `nettrail-backup-${today()}.json`; a.click(); };
  });
}
function showImport() {
  modal(`<h3>${u('import')}</h3><p>${u('importText')}</p><textarea class="code" id="imp" placeholder="..."></textarea>
  <label class="btn ghost wide file">${u('chooseFile')}<input type="file" accept=".json,application/json,text/plain" hidden></label>
  <div class="mbtns"><button class="btn ghost" data-close>${u('cancel')}</button><button class="btn primary" id="doimp">${u('import')}</button></div>`, m => {
    $('input[type=file]', m).onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { $('#imp', m).value = r.result; }; r.readAsText(f); };
    $('#doimp', m).onclick = () => {
      const raw = $('#imp', m).value.trim(); let data = null;
      try { data = JSON.parse(raw); } catch (e) { try { data = JSON.parse(decodeURIComponent(escape(atob(raw)))); } catch (e2) { } }
      if (!data || !data.v) return toast(u('importBad'));
      S = Object.assign(clone(DEF), data, { st: Object.assign({}, DEF.st, data.st || {}) }); save(); closeModal(); viewSec = S.section; render(); toast(u('importOk'));
    };
  });
}

/* ---------- onboarding ---------- */
function renderOnboarding() {
  const sel = renderOnboarding.sel || (renderOnboarding.sel = { sec: 1, goal: 50 });
  $('#app').innerHTML = `<div class="onb">
    <div class="onb-card">
      <div class="onb-mascot"><div class="speech">${S.lang === 'pt' ? `Oi! Eu sou o ${esc(S.dogName)}, seu parceiro de estudos. Bora aprender redes juntos?` : `Hi! I'm ${esc(S.dogName)}, your study buddy. Let's learn networking together!`}</div>${M.render('happy', 210)}</div>
      <h1>${u('welcome')}</h1><p class="sub">${u('welcomeSub')}</p>
      <h4>${u('chooseLang')}</h4>
      <div class="segs big"><button class="seg ${S.lang === 'pt' ? 'on' : ''}" data-l="pt">🇧🇷 Português</button><button class="seg ${S.lang === 'en' ? 'on' : ''}" data-l="en">🇺🇸 English</button></div>
      <h4>${u('chooseLevel')}</h4>
      <div class="lvl-pick">${C.sections.map(s => `<button class="lvl-opt ${sel.sec === s.id ? 'on' : ''}" data-s="${s.id}" style="--c:${s.color}"><b>${s.icon || '⭐'} ${T(s.name)}</b><small>${T(s.desc)}</small></button>`).join('')}</div>
      <h4>${u('chooseGoal')}</h4>
      <div class="segs big">${[[20, 'goalCasual'], [50, 'goalRegular'], [100, 'goalSerious']].map(([g, k]) => `<button class="seg ${sel.goal === g ? 'on' : ''}" data-g="${g}">${u(k)}<small>${g} XP</small></button>`).join('')}</div>
      <p class="note">${u('changeAnytime')}</p>
      <button class="btn primary wide big" id="go">${u('letsGo')}</button>
    </div></div>`;
  $$('[data-l]').forEach(b => b.onclick = () => { S.lang = b.dataset.l; applyTheme(); renderOnboarding(); });
  $$('[data-s]').forEach(b => b.onclick = () => { sel.sec = +b.dataset.s; renderOnboarding(); });
  $$('[data-g]').forEach(b => b.onclick = () => { sel.goal = +b.dataset.g; renderOnboarding(); });
  $('#go').onclick = () => { S.section = sel.sec; S.goal = sel.goal; unlockSectionStart(sel.sec); S.onboarded = true; viewSec = sel.sec; save(); render(); };
}

/* =========================================================
   LESSON ENGINE
   ========================================================= */
let L = null;
function prep(q) { return Object.assign({}, q, { _k: Math.random().toString(36).slice(2) }); }
function startLesson(i, k) {
  const un = UNITS[i], pool = un.q.slice();
  let qs;
  const nGen = un.gen ? (un.q.length < 10 ? 5 : 3) : 0;
  if (k === LPU) qs = shuffle(pool).slice(0, 10).concat(un.gen ? genQ(un.gen, 3) : []);
  else {
    const part = pool.filter((_, j) => j % LPU === k), rest = pool.filter((_, j) => j % LPU !== k);
    qs = part.concat(shuffle(rest).slice(0, 2)).concat(un.gen ? genQ(un.gen, nGen) : []);
  }
  begin({ mode: k === LPU ? 'checkpoint' : 'lesson', unit: i, k, qs: shuffle(qs), color: un.color });
}
function startJump(i) {
  const pool = []; for (let j = 0; j <= i; j++) if (!unitComplete(j) && (j === i || !unitUnlocked(j) || j >= i - 2)) pool.push(...UNITS[j].q);
  const src = pool.length >= 10 ? pool : UNITS.slice(0, i + 1).flatMap(x => x.q);
  begin({ mode: 'jump', unit: i, qs: shuffle(src).slice(0, 10), color: UNITS[i].color });
}
function startPractice(kind) {
  if (kind === 'howto') return showHowTo();
  if (kind === 'subtable') return modal(`<h3>📋 ${u('pr_subtable')}</h3><div class="bintool" id="subtoolM"></div><div class="mbtns"><button class="btn ghost" id="howB">📐 ${u('pr_howto')}</button><button class="btn primary" data-close>OK</button></div>`, m => { m.classList.add('wide-m'); subTool($('#subtoolM', m)); $('#howB', m).onclick = () => showHowTo(); });
  if (kind === 'bintable') return modal(`<h3>🔢 ${u('pr_bintable')}</h3><div class="bintool" id="bintoolM"></div><div class="mbtns"><button class="btn primary wide" data-close>OK</button></div>`, m => { m.classList.add('wide-m'); binTool($('#bintoolM', m)); });
  let qs = [];
  const open = UNITS.filter((_, i) => unitUnlocked(i));
  if (kind === 'mistakes') {
    const ids = Object.keys(S.mistakes).filter(k => QIDX[k]).sort((a, b) => S.mistakes[b] - S.mistakes[a]);
    if (!ids.length) return toast(u('noMistakes'));
    qs = shuffle(ids.slice(0, 10).map(id => QIDX[id]));
  } else if (kind === 'random') qs = shuffle(open.flatMap(x => x.q)).slice(0, 10).concat(genQ(['bin', 'hosts'], 1));
  else if (kind === 'subnet') qs = genQ(['hosts', 'mask', 'network', 'broadcast', 'cidr', 'need', 'bin'], 10);
  else if (kind === 'ports') qs = shuffle(UNITS[unitIdx('u7')].q).slice(0, 10);
  else if (kind === 'cmd') qs = shuffle(UNITS.flatMap(x => x.q).filter(q => q.t === 'fill' && /[_]{3}/.test(T(q.q)) && /[a-z]/i.test(q.a[0]) && !/^\d+$/.test(q.a[0]))).slice(0, 10);
  else if (kind === 'vocab') {
    const pairs = shuffle(UNITS.flatMap(x => x.q).filter(q => q.vocab).flatMap(q => q.pairs));
    for (let j = 0; j < 4 && j * 4 < pairs.length; j++) qs.push({ t: 'match', id: 'gen_vocab', gen: true, q: ['Vocabulário: ligue o termo em português ao inglês', 'Vocabulary: match Portuguese to English'], pairs: pairs.slice(j * 4, j * 4 + 4) });
  }
  if (!qs.length) return;
  begin({ mode: 'practice', kind, qs: shuffle(qs), color: '#0ea5a4' });
}
function begin(o) {
  L = Object.assign(o, { queue: o.qs.map(prep), total: o.qs.length, pos: 0, solved: 0, missed: new Set(), firstOk: 0, combo: 0, maxCombo: 0, t0: Date.now(), cur: null, checked: false });
  $('#overlay').classList.add('open'); document.body.classList.add('locked');
  renderQ();
}

function renderQ() {
  const q = L.queue[L.pos]; L.cur = { q, sel: null, picked: [], m: { left: null, done: new Set(), err: 0 } }; L.checked = false;
  const ov = $('#overlay');
  const prompt = { mc: 'pMc', tf: 'pTf', order: 'pOrder', match: 'pMatch', fill: 'pFill' }[q.t];
  const retry = L.missed.has(q._k);
  ov.innerHTML = `<div class="lesson" style="--c:${L.color}">
    <div class="l-top"><button class="x" id="quit" aria-label="${u('quit')}">✕</button>${bar(L.solved / L.total, 'lp')}<span class="combo ${L.combo >= 3 ? 'show' : ''}">🔥 ${L.combo}</span></div>
    <div class="l-body">
      <div class="l-kind">${retry ? '🔁 ' : ''}${q.gen ? '✨ ' : ''}${u(prompt)}</div>
      <h2 class="l-q">${fmtQ(T(q.q))}</h2>
      ${S.hint && TO(q.q) ? `<div class="l-alt">${esc(TO(q.q))}</div>` : ''}
      <div class="l-area" id="area"></div>
      ${q.sub ? '<div class="toolbar" id="toolbar"></div><div class="bintool" id="subtool"></div><div class="bintool" id="bintool"></div>' : ''}
    </div>
    <div class="l-foot" id="foot"><div class="foot-in"><div class="fb" id="fb"></div><button class="btn primary big" id="chk" disabled>${u('check')}</button></div></div>
  </div>`;
  $('#quit').onclick = () => modal(`<div class="m-ic">😢</div><h3>${u('quitTitle')}</h3><p>${u('quitText')}</p><div class="mbtns col"><button class="btn primary wide" data-close>${u('keep')}</button><button class="btn link danger-t" id="q">${u('quit')}</button></div>`,
    m => $('#q', m).onclick = () => { closeModal(); endOverlay(); });
  $('#chk').onclick = () => L.checked ? next() : check();
  ({ mc: rMc, tf: rTf, order: rOrder, match: rMatch, fill: rFill })[q.t](q, $('#area'));
  if (q.sub) mountLessonTools(q);
}
function mountLessonTools(q) {
  const wantsBits = q.t === 'fill' && /^[01]{8}$/.test(q.a[0]);
  const m = T(q.q).match(/\/(\d{1,2})\b/), pre = m ? +m[1] : null;
  const pt = S.lang === 'pt';
  // binário -> só tabela binária; demais (sub-rede) -> só tabela de sub-redes
  const isBin = howKeyFor(q) === 'bin', useSub = !isBin, useBin = isBin;
  const drawBar = () => {
    $('#toolbar').innerHTML = `
      ${useSub ? `<button class="btn sm ghost tb ${S.subOpen ? 'on' : ''}" data-tb="sub">📋 ${pt ? 'Tabela de sub-redes' : 'Subnet table'}</button>` : ''}
      ${useBin ? `<button class="btn sm ghost tb ${S.binOpen ? 'on' : ''}" data-tb="bin">🧮 ${pt ? 'Tabela binária' : 'Binary table'}</button>` : ''}
      <button class="btn sm ghost tb" data-tb="how">📐 ${pt ? 'Como calcular' : 'How to solve'}</button>`;
    $$('[data-tb]').forEach(b => b.onclick = () => {
      const k = b.dataset.tb;
      if (k === 'how') return showHowTo(howKeyFor(q));
      if (k === 'sub') S.subOpen = !S.subOpen; else S.binOpen = !S.binOpen;
      save(); drawBar(); drawPanels();
    });
  };
  const drawPanels = () => {
    const st = $('#subtool'), bt = $('#bintool');
    if (useSub && S.subOpen) { if (!st.dataset.on) { st.dataset.on = 1; subTool(st, { prefix: pre }); } } else { st.innerHTML = ''; delete st.dataset.on; }
    if (useBin && S.binOpen) {
      if (!bt.dataset.on) {
        bt.dataset.on = 1;
        binTool(bt, { onUse: q.t === 'fill' ? row => { const inp = $('#fill'); if (!inp || L.checked) return; inp.value = wantsBits ? row.bits8 : String(row.sum); inp.dispatchEvent(new Event('input')); inp.focus(); } : null });
      }
    } else { bt.innerHTML = ''; delete bt.dataset.on; }
  };
  drawBar(); drawPanels();
}
const howKeyFor = q => { const m = (q.id || '').match(/^gen_(\w+)/); return m ? m[1] : null; };

/* ---------- tabela de sub-redes ---------- */
function subRow(n) {
  const total = 2 ** (32 - n), hosts = Math.max(total - 2, 0);
  const oct = n > 24 ? 4 : n > 16 ? 3 : 2;
  const block = oct === 4 ? 2 ** (32 - n) : oct === 3 ? 2 ** (24 - n) : 2 ** (16 - n);
  return { n, mask: maskStr(n), total, hosts, oct, block, maskVal: 256 - block };
}
function subTool(el, opts = {}) {
  const pt = S.lang === 'pt';
  let view = opts.view || 'table', sel = opts.prefix || null;
  let bp = opts.prefix && opts.prefix >= 24 && opts.prefix <= 30 ? opts.prefix : 26, num = '';
  const draw = () => {
    let body = '';
    if (view === 'table') {
      const rows = []; for (let n = 16; n <= 30; n++) rows.push(subRow(n));
      body = `<div class="bt-wrap"><table class="st">
        <thead><tr><th>${pt ? 'Prefixo' : 'Prefix'}</th><th>${pt ? 'Máscara' : 'Mask'}</th><th>${pt ? 'Bloco' : 'Block'}</th><th>${pt ? 'Endereços' : 'Addresses'}</th><th>${pt ? 'Hosts úteis' : 'Usable hosts'}</th></tr></thead>
        <tbody>${rows.map(r => `<tr class="${r.n === sel ? 'sel' : ''} ${r.n >= 24 ? 'hot' : ''}" data-n="${r.n}"><td><b>/${r.n}</b></td><td class="mono">${r.mask}</td><td>${r.block} <small>(${r.oct}º)</small></td><td>${r.total.toLocaleString(pt ? 'pt-BR' : 'en')}</td><td><b>${r.hosts.toLocaleString(pt ? 'pt-BR' : 'en')}</b></td></tr>`).join('')}</tbody>
      </table></div>
      <div class="bt-foot"><small>${pt ? 'Toque numa linha para destacar. Bloco = 256 − valor da máscara no octeto indicado (º). Hosts úteis = endereços − 2.' : 'Tap a row to highlight it. Block = 256 − mask value in the octet shown (º). Usable hosts = addresses − 2.'}</small></div>`;
    } else {
      const r = subRow(bp), b = r.block, v = num === '' ? null : Math.max(0, Math.min(255, +num));
      const chips = []; for (let s = 0; s < 256; s += b) chips.push(s);
      const hit = v == null ? null : Math.floor(v / b) * b;
      body = `<div class="blk-ctrl"><div class="segs">${[24, 25, 26, 27, 28, 29, 30].map(n => `<button class="seg ${n === bp ? 'on' : ''}" data-bp="${n}">/${n}</button>`).join('')}</div>
        <label class="blk-in">${pt ? 'Último octeto do IP:' : 'Last octet of the IP:'} <input id="blkNum" inputmode="numeric" maxlength="3" value="${num}" placeholder="0–255"></label></div>
        <div class="blk-sum">${pt ? 'Máscara' : 'Mask'} ${r.mask} → ${pt ? 'bloco' : 'block'} = 256 − ${r.maskVal} = <b>${b}</b> · ${256 / b} ${pt ? 'sub-redes' : 'subnets'} · ${r.hosts} hosts ${pt ? 'cada' : 'each'}</div>
        <div class="blk-grid ${b <= 8 ? 'dense' : ''}">${chips.map(s => `<div class="blk ${s === hit ? 'hit' : ''}"><b>.${s}</b><span>–</span><b>.${s + b - 1}</b></div>`).join('')}</div>
        ${hit != null ? `<div class="blk-res"><div><small>${pt ? 'Rede' : 'Network'}</small><b>.${hit}</b></div><div><small>${pt ? '1º host' : 'First host'}</small><b>.${hit + 1}</b></div><div><small>${pt ? 'Último host' : 'Last host'}</small><b>.${hit + b - 2}</b></div><div><small>Broadcast</small><b>.${hit + b - 1}</b></div></div>` : `<div class="bt-foot"><small>${pt ? 'Cada caixinha é uma sub-rede: o 1º número é a REDE e o último é o BROADCAST. Digite o último octeto do IP para ver em qual bloco ele cai.' : 'Each box is a subnet: the first number is the NETWORK and the last is the BROADCAST. Type the last octet of the IP to see which block it falls in.'}</small></div>`}`;
    }
    el.innerHTML = `<div class="st-tabs"><button class="seg ${view === 'table' ? 'on' : ''}" data-v="table">📋 ${pt ? 'Tabela' : 'Table'}</button><button class="seg ${view === 'blocks' ? 'on' : ''}" data-v="blocks">🧱 ${pt ? 'Blocos (rede/broadcast)' : 'Blocks (network/broadcast)'}</button></div>${body}`;
    $$('[data-v]', el).forEach(b => b.onclick = () => { view = b.dataset.v; draw(); });
    $$('tr[data-n]', el).forEach(tr => tr.onclick = () => { sel = +tr.dataset.n === sel ? null : +tr.dataset.n; sfx('tap'); draw(); });
    $$('[data-bp]', el).forEach(b => b.onclick = () => { bp = +b.dataset.bp; draw(); });
    const inp = $('#blkNum', el);
    if (inp) inp.oninput = () => { num = inp.value.replace(/\D/g, '').slice(0, 3); const pos = inp.selectionStart; draw(); const n2 = $('#blkNum', el); n2.focus(); try { n2.setSelectionRange(pos, pos); } catch (e) { } };
    const selRow = $('tr.sel', el); if (selRow && view === 'table') { const w = $('.bt-wrap', el); w.scrollTop = selRow.offsetTop - 40; }
  };
  draw();
}

/* ---------- como calcular (passo a passo) ---------- */
const HOW = [
  { k: 'hosts', ic: '👥', t: ['Quantos hosts tem uma rede?', 'How many hosts in a network?'],
    m: ['1) Bits de host = 32 − prefixo.  2) Calcule 2 elevado a esses bits.  3) Tire 2 (o endereço de rede e o de broadcast).', '1) Host bits = 32 − prefix.  2) Raise 2 to that power.  3) Subtract 2 (network and broadcast addresses).'] },
  { k: 'need', ic: '🎯', t: ['Menor sub-rede para N hosts', 'Smallest subnet for N hosts'],
    m: ['Vá dobrando as potências de 2 (4, 8, 16, 32…) até achar a primeira em que (potência − 2) ≥ N. O expoente são os bits de host; o prefixo é 32 − bits.', 'Keep doubling powers of 2 (4, 8, 16, 32…) until (power − 2) ≥ N. The exponent is the host bits; the prefix is 32 − host bits.'] },
  { k: 'mask', ic: '🎭', t: ['Prefixo → máscara', 'Prefix → mask'],
    m: ['Cada 8 bits completos viram 255. Os bits que sobram entram no próximo octeto somando a tabela da esquerda para a direita: 128, 192, 224, 240, 248, 252, 254, 255.', 'Every full 8 bits become 255. Leftover bits go into the next octet by adding the table left to right: 128, 192, 224, 240, 248, 252, 254, 255.'] },
  { k: 'cidr', ic: '🔁', t: ['Máscara → prefixo', 'Mask → prefix'],
    m: ['Some 8 para cada 255. No octeto que não é 255, conte quantos bits 1 ele tem (192 = 2, 224 = 3, 240 = 4, 248 = 5, 252 = 6, 254 = 7).', 'Add 8 for each 255. In the octet that isn\'t 255, count its one-bits (192 = 2, 224 = 3, 240 = 4, 248 = 5, 252 = 6, 254 = 7).'] },
  { k: 'network', ic: '🏠', t: ['Endereço de rede', 'Network address'],
    m: ['1) Bloco = 256 − valor da máscara no último octeto.  2) Liste os múltiplos do bloco (0, bloco, 2×bloco…).  3) A rede é o maior múltiplo que não passa do número do IP.', '1) Block = 256 − mask value in the last octet.  2) List multiples of the block (0, block, 2×block…).  3) The network is the largest multiple not greater than the IP number.'] },
  { k: 'broadcast', ic: '📣', t: ['Endereço de broadcast', 'Broadcast address'],
    m: ['Ache a rede (como acima). O broadcast é a PRÓXIMA rede menos 1, ou seja, rede + bloco − 1. Os hosts úteis ficam entre rede + 1 e broadcast − 1.', 'Find the network (as above). The broadcast is the NEXT network minus 1, i.e. network + block − 1. Usable hosts are between network + 1 and broadcast − 1.'] },
  { k: 'bin', ic: '🔢', t: ['Decimal ↔ binário', 'Decimal ↔ binary'],
    m: ['Use a tabela 128 64 32 16 8 4 2 1. Decimal → binário: da esquerda para a direita, se o valor cabe no que resta, marque 1 e subtraia; senão marque 0. Binário → decimal: some os valores das colunas com 1.', 'Use the table 128 64 32 16 8 4 2 1. Decimal → binary: left to right, if the value fits in what remains, write 1 and subtract; else write 0. Binary → decimal: add the values of the columns with a 1.'] }
];
function howExample(k) {
  const pt = S.lang === 'pt', L2 = (a, b) => pt ? a : b;
  if (k === 'hosts') {
    const n = rnd(20, 30), h = 32 - n;
    return { q: L2(`Quantos hosts úteis tem uma /${n}?`, `How many usable hosts in a /${n}?`), s: [
      L2(`Bits de host = 32 − ${n} = ${h}`, `Host bits = 32 − ${n} = ${h}`),
      `2^${h} = ${2 ** h} ${L2('endereços', 'addresses')}`,
      `${2 ** h} − 2 = ${2 ** h - 2} ${L2('hosts úteis', 'usable hosts')} ✅`] };
  }
  if (k === 'need') {
    const N = rnd(5, 900); let hb = 2; const tries = [];
    while (2 ** hb - 2 < N) { tries.push(`2^${hb} − 2 = ${2 ** hb - 2} ${L2('(não dá)', "(too small)")}`); hb++; }
    tries.push(`2^${hb} − 2 = ${2 ** hb - 2} ≥ ${N} ✔`);
    return { q: L2(`Preciso de ${N} hosts. Qual o menor prefixo?`, `I need ${N} hosts. Smallest prefix?`), s: [...tries.slice(-4), L2(`São ${hb} bits de host → prefixo = 32 − ${hb} = /${32 - hb} ✅`, `That's ${hb} host bits → prefix = 32 − ${hb} = /${32 - hb} ✅`)] };
  }
  if (k === 'mask' || k === 'cidr') {
    const n = rnd(17, 30), full = Math.floor(n / 8), rest = n % 8, vals = [128, 64, 32, 16, 8, 4, 2, 1].slice(0, rest), v = vals.reduce((a, b) => a + b, 0);
    if (k === 'mask') return { q: L2(`Qual a máscara de /${n}?`, `What is the mask for /${n}?`), s: [
      L2(`${n} = ${full} × 8 + ${rest} → ${full} octeto(s) com 255`, `${n} = ${full} × 8 + ${rest} → ${full} octet(s) of 255`),
      rest ? L2(`Sobram ${rest} bits: ${vals.join(' + ')} = ${v}`, `${rest} bits left: ${vals.join(' + ')} = ${v}`) : L2('Não sobram bits: o próximo octeto é 0', 'No bits left: the next octet is 0'),
      L2(`Máscara: ${maskStr(n)} ✅`, `Mask: ${maskStr(n)} ✅`)] };
    return { q: L2(`Qual o prefixo da máscara ${maskStr(n)}?`, `What prefix is mask ${maskStr(n)}?`), s: [
      L2(`${full} octeto(s) 255 → ${full} × 8 = ${full * 8} bits`, `${full} octet(s) of 255 → ${full} × 8 = ${full * 8} bits`),
      rest ? L2(`${v} = ${vals.join(' + ')} → ${rest} bits 1`, `${v} = ${vals.join(' + ')} → ${rest} one-bits`) : L2('O resto é 0 → 0 bits', 'The rest is 0 → 0 bits'),
      `${full * 8} + ${rest} = /${n} ✅`] };
  }
  if (k === 'network' || k === 'broadcast') {
    const b = netBlock(), mv = 256 - b.block, mult = []; for (let s = 0; s < 256 && mult.length < 8; s += b.block) mult.push(s);
    const ip = `${b.p}.${b.host}/${b.n}`;
    const s = [
      L2(`Máscara /${b.n} = ${maskStr(b.n)} → último octeto ${mv}`, `Mask /${b.n} = ${maskStr(b.n)} → last octet ${mv}`),
      L2(`Bloco = 256 − ${mv} = ${b.block}`, `Block = 256 − ${mv} = ${b.block}`),
      L2(`Múltiplos: ${mult.join(', ')}${256 / b.block > 8 ? '…' : ''}`, `Multiples: ${mult.join(', ')}${256 / b.block > 8 ? '…' : ''}`),
      L2(`${b.host} fica entre ${b.net} e ${b.net + b.block} → rede = .${b.net}`, `${b.host} is between ${b.net} and ${b.net + b.block} → network = .${b.net}`)];
    if (k === 'network') s.push(L2(`Endereço de rede: ${b.p}.${b.net} ✅`, `Network address: ${b.p}.${b.net} ✅`));
    else s.push(L2(`Broadcast = ${b.net} + ${b.block} − 1 = ${b.bc} → ${b.p}.${b.bc} ✅`, `Broadcast = ${b.net} + ${b.block} − 1 = ${b.bc} → ${b.p}.${b.bc} ✅`));
    return { q: L2(`${k === 'network' ? 'Rede' : 'Broadcast'} de ${ip}?`, `${k === 'network' ? 'Network' : 'Broadcast'} of ${ip}?`), s };
  }
  const n = rnd(1, 255); let r = n; const s = [];
  for (const v of [128, 64, 32, 16, 8, 4, 2, 1]) { if (r >= v) { s.push(L2(`${r} ≥ ${v}? sim → 1, resta ${r - v}`, `${r} ≥ ${v}? yes → 1, ${r - v} left`)); r -= v; } else s.push(L2(`${r} ≥ ${v}? não → 0`, `${r} ≥ ${v}? no → 0`)); }
  s.push(`${n} = ${bin8(n)} ✅`);
  return { q: L2(`Converter ${n} para binário`, `Convert ${n} to binary`), s };
}
function showHowTo(focus) {
  const pt = S.lang === 'pt';
  const list = focus && HOW.some(h => h.k === focus) ? [HOW.find(h => h.k === focus), ...HOW.filter(h => h.k !== focus)] : HOW;
  const card = h => { const ex = howExample(h.k); return `<div class="how-ex"><div class="how-q">📝 ${esc(ex.q)}</div><ol>${ex.s.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>`; };
  modal(`<div class="how">
    <h3>📐 ${pt ? 'Como calcular sub-redes' : 'How to calculate subnets'}</h3>
    <p>${pt ? 'Decore estas duas linhas, elas resolvem quase tudo:' : 'Memorize these two lines, they solve almost everything:'}</p>
    <div class="how-ref"><div><small>${pt ? 'Valores dos bits' : 'Bit values'}</small><b>128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</b></div><div><small>${pt ? 'Máscaras possíveis (soma acumulada)' : 'Possible masks (running sum)'}</small><b>128 · 192 · 224 · 240 · 248 · 252 · 254 · 255</b></div></div>
    ${list.map(h => `<section class="how-sec" data-k="${h.k}"><h4>${h.ic} ${esc(T(h.t))}</h4><p>${esc(T(h.m))}</p><div class="how-box">${card(h)}</div><button class="btn sm ghost" data-ex="${h.k}">🎲 ${pt ? 'Novo exemplo' : 'New example'}</button></section>`).join('')}
    <div class="mbtns"><button class="btn primary wide" data-close>OK</button></div></div>`, m => {
    m.classList.add('wide-m');
    $$('[data-ex]', m).forEach(b => b.onclick = () => { const h = HOW.find(x => x.k === b.dataset.ex); $(`[data-k="${h.k}"] .how-box`, m).innerHTML = card(h); sfx('tap'); });
  });
}

/* ---------- tabela binária (2^11 ... 2^0) ---------- */
const BIN_COLS = 12, BIN_ROWS = 4;
const SUP = n => String(n).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
function binTool(el, opts = {}) {
  if (!el) return;
  const rows = Array.from({ length: BIN_ROWS }, () => Array(BIN_COLS).fill(''));
  const pw = j => 2 ** (BIN_COLS - 1 - j);
  const rowInfo = r => {
    const sum = r.reduce((s, v, j) => s + (v === '1' ? pw(j) : 0), 0);
    const all = r.map(v => v === '1' ? '1' : '0').join('');
    const bits8 = sum < 256 ? all.slice(-8) : all.replace(/^0+/, '');
    return { sum, bits8 };
  };
  const open = () => !opts.collapsible || S.binOpen;
  let firstOpen = true;
  const draw = () => {
    const prevScroll = $('.bt-wrap', el) ? $('.bt-wrap', el).scrollLeft : null;
    const hint = S.lang === 'pt' ? 'Toque numa casa: vazio → 1 → 0. A soma aparece à direita. As 8 últimas colunas formam um octeto.' : 'Tap a cell: empty → 1 → 0. The sum shows on the right. The last 8 columns form one octet.';
    el.innerHTML = `${opts.collapsible ? `<button class="btn sm ghost bt-toggle" id="btT">🧮 ${S.lang === 'pt' ? (open() ? 'Esconder tabela binária' : 'Abrir tabela binária') : (open() ? 'Hide binary table' : 'Open binary table')}</button>` : ''}
    ${open() ? `<div class="bt-wrap"><table class="bt">
      <thead><tr>${Array.from({ length: BIN_COLS }, (_, j) => `<th class="${j >= BIN_COLS - 8 ? 'oct' : ''}"><small>2${SUP(BIN_COLS - 1 - j)}</small><b>${pw(j)}</b></th>`).join('')}<th class="sum-h">=</th>${opts.onUse ? '<th></th>' : ''}</tr></thead>
      <tbody>${rows.map((r, i) => { const inf = rowInfo(r); return `<tr>${r.map((v, j) => `<td class="${j >= BIN_COLS - 8 ? 'oct' : ''}"><button class="bc ${v === '1' ? 'one' : v === '0' ? 'zero' : ''}" data-r="${i}" data-c="${j}" aria-label="${pw(j)}">${v}</button></td>`).join('')}<td class="sum">${inf.sum || ''}</td>${opts.onUse ? `<td><button class="bt-use" data-use="${i}" ${inf.sum || r.some(v => v) ? '' : 'disabled'} title="${S.lang === 'pt' ? 'Usar na resposta' : 'Use as answer'}">↵</button></td>` : ''}</tr>`; }).join('')}</tbody>
    </table></div>
    <div class="bt-foot"><small>${hint}</small><button class="btn sm ghost" id="btClr">${S.lang === 'pt' ? 'Limpar' : 'Clear'}</button></div>` : ''}`;
    const wrap = $('.bt-wrap', el);
    if (wrap) { if (prevScroll != null && !firstOpen) wrap.scrollLeft = prevScroll; else { wrap.scrollLeft = wrap.scrollWidth; firstOpen = false; } }
    else firstOpen = true;
    const t = $('#btT', el); if (t) t.onclick = () => { S.binOpen = !S.binOpen; save(); draw(); };
    $$('.bc', el).forEach(b => b.onclick = () => { const r = rows[+b.dataset.r], c = +b.dataset.c; r[c] = r[c] === '' ? '1' : r[c] === '1' ? '0' : ''; sfx('tap'); draw(); });
    $$('[data-use]', el).forEach(b => b.onclick = () => opts.onUse(rowInfo(rows[+b.dataset.use])));
    const clr = $('#btClr', el); if (clr) clr.onclick = () => { rows.forEach(r => r.fill('')); draw(); };
  };
  draw();
}
const fmtQ = s => esc(s).replace(/_{3,}/g, '<span class="blank">____</span>').replace(/(\s{2,})/g, ' ');
const enableChk = on => { const b = $('#chk'); if (b && !L.checked) b.disabled = !on; };

function rMc(q, area) {
  L.cur.opts = shuffle(q.o.map((x, i) => ({ x, i })));
  area.innerHTML = `<div class="opts">${L.cur.opts.map((o, j) => `<button class="opt" data-j="${j}"><kbd>${j + 1}</kbd><span>${esc(T(o.x))}</span></button>`).join('')}</div>`;
  $$('.opt', area).forEach(b => b.onclick = () => { if (L.checked) return; $$('.opt', area).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); L.cur.sel = +b.dataset.j; sfx('tap'); enableChk(true); });
}
function rTf(q, area) {
  area.innerHTML = `<div class="opts tf"><button class="opt" data-v="1"><kbd>1</kbd><span>✔ ${u('true')}</span></button><button class="opt" data-v="0"><kbd>2</kbd><span>✘ ${u('false')}</span></button></div>`;
  $$('.opt', area).forEach(b => b.onclick = () => { if (L.checked) return; $$('.opt', area).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); L.cur.sel = b.dataset.v === '1'; sfx('tap'); enableChk(true); });
}
function rOrder(q, area) {
  const items = q.items.map((x, i) => ({ x, i }));
  let bank = shuffle(items); if (bank.every((b, j) => b.i === j) && bank.length > 1) bank = bank.reverse();
  L.cur.bank = bank;
  const draw = () => {
    area.innerHTML = `<div class="ans-line">${L.cur.picked.length ? L.cur.picked.map((b, j) => `<button class="chip-w in" data-p="${j}"><em>${j + 1}</em>${esc(T(b.x))}</button>`).join('') : `<span class="ph">${u('tapItems')}</span>`}</div>
    <div class="bank">${L.cur.bank.map((b, j) => `<button class="chip-w ${L.cur.picked.includes(b) ? 'used' : ''}" data-b="${j}">${esc(T(b.x))}</button>`).join('')}</div>`;
    $$('[data-p]', area).forEach(el => el.onclick = () => { if (L.checked) return; L.cur.picked.splice(+el.dataset.p, 1); sfx('tap'); draw(); });
    $$('[data-b]', area).forEach(el => el.onclick = () => { if (L.checked) return; const b = L.cur.bank[+el.dataset.b]; if (L.cur.picked.includes(b)) return; L.cur.picked.push(b); sfx('tap'); draw(); });
    enableChk(L.cur.picked.length === q.items.length);
  };
  draw();
}
function rMatch(q, area) {
  const L1 = shuffle(q.pairs.map((p, i) => ({ t: p[0], i }))), R1 = shuffle(q.pairs.map((p, i) => ({ t: p[1], i })));
  area.innerHTML = `<div class="match"><div class="mcol">${L1.map(x => `<button class="mt" data-side="l" data-i="${x.i}">${esc(T(x.t))}</button>`).join('')}</div><div class="mcol">${R1.map(x => `<button class="mt" data-side="r" data-i="${x.i}">${esc(T(x.t))}</button>`).join('')}</div></div>`;
  const m = L1.length ? L.cur.m : null; let selL = null, selR = null;
  const tryPair = () => {
    if (!selL || !selR) return;
    const a = selL, b = selR; selL = selR = null;
    if (a.dataset.i === b.dataset.i) {
      a.classList.remove('sel'); b.classList.remove('sel'); a.classList.add('ok'); b.classList.add('ok'); a.disabled = b.disabled = true; m.done.add(a.dataset.i); sfx('tap');
      if (m.done.size === q.pairs.length) { L.cur.sel = true; setTimeout(check, 250); }
    } else {
      m.err++; sfx('bad'); a.classList.add('no'); b.classList.add('no');
      setTimeout(() => { a.classList.remove('no', 'sel'); b.classList.remove('no', 'sel'); }, 450);
    }
  };
  $$('.mt', area).forEach(el => el.onclick = () => {
    if (el.disabled || L.checked) return;
    if (el.dataset.side === 'l') { if (selL) selL.classList.remove('sel'); selL = el; } else { if (selR) selR.classList.remove('sel'); selR = el; }
    el.classList.add('sel'); tryPair();
  });
  $('#chk').style.visibility = 'hidden';
}
function rFill(q, area) {
  area.innerHTML = `<input class="fill" id="fill" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${u('typeHere')}">`;
  const inp = $('#fill'); setTimeout(() => inp.focus(), 50);
  inp.oninput = () => { L.cur.sel = inp.value; enableChk(inp.value.trim().length > 0); };
}
const norm = s => String(s).toLowerCase().trim().replace(/\s+/g, ' ');

function evaluate(q) {
  const c = L.cur;
  switch (q.t) {
    case 'mc': return c.opts[c.sel].i === q.a;
    case 'tf': return c.sel === q.a;
    case 'order': return c.picked.every((b, j) => T(b.x) === T(q.items[j]));
    case 'match': return c.m.err === 0;
    case 'fill': { const v = norm(c.sel); return q.a.some(a => { const x = norm(a); return x === v || x.replace(/\s/g, '') === v.replace(/\s/g, ''); }); }
  }
}
function answerText(q) {
  switch (q.t) {
    case 'mc': return T(q.o[q.a]);
    case 'tf': return q.a ? u('true') : u('false');
    case 'order': return q.items.map(x => T(x)).join(' → ');
    case 'match': return q.pairs.map(p => T(p[0]) + ' = ' + T(p[1])).join(' · ');
    case 'fill': return q.a[0];
  }
}
function check() {
  if (L.checked) return;
  const q = L.cur.q, ok = evaluate(q); L.checked = true;
  const first = !L.missed.has(q._k);
  S.st.ans++;
  if (ok) {
    S.st.cor++; L.solved++; L.combo++; L.maxCombo = Math.max(L.maxCombo, L.combo); S.st.bestCombo = Math.max(S.st.bestCombo || 0, L.combo);
    if (first) L.firstOk++;
    if (q.sub) S.st.subnet++;
    if (S.mistakes[q.id]) { S.mistakes[q.id]--; if (S.mistakes[q.id] <= 0) delete S.mistakes[q.id]; }
    quest('correct', 1); quest('combo', L.combo, true); sfx('ok');
  } else {
    L.combo = 0; L.missed.add(q._k);
    if (!q.gen && q.id) S.mistakes[q.id] = (S.mistakes[q.id] || 0) + 1;
    if (L.mode === 'jump') L.solved++;
    else L.queue.push(q);
    sfx('bad');
  }
  save();
  // mark UI
  const area = $('#area');
  if (q.t === 'mc') { $$('.opt', area).forEach(b => { const o = L.cur.opts[+b.dataset.j]; if (o.i === q.a) b.classList.add('right'); else if (+b.dataset.j === L.cur.sel) b.classList.add('wrongo'); b.disabled = true; }); }
  if (q.t === 'tf') { $$('.opt', area).forEach(b => { const v = b.dataset.v === '1'; if (v === q.a) b.classList.add('right'); else if (v === L.cur.sel) b.classList.add('wrongo'); b.disabled = true; }); }
  if (q.t === 'fill') { const i = $('#fill'); i.disabled = true; i.classList.add(ok ? 'right' : 'wrongo'); }
  if (q.t === 'order') $('.ans-line', area).classList.add(ok ? 'right' : 'wrongo');
  const foot = $('#foot'), fb = $('#fb'), chk = $('#chk');
  foot.classList.add(ok ? 'ok' : 'bad');
  const praise = UI.praise[S.lang === 'pt' ? 0 : 1];
  const showAns = !ok || (q.t === 'match' && L.cur.m.err > 0);
  fb.innerHTML = `<div class="fb-dog">${M.render(ok ? (L.combo >= 5 ? 'celebrate' : 'happy') : 'sad', 110)}</div><div class="fb-txt"><div class="fb-t">${ok ? '✓ ' + praise[rnd(0, praise.length - 1)] : (q.t === 'match' ? '⚠ ' + (S.lang === 'pt' ? `Concluído com ${L.cur.m.err} erro(s)` : `Done with ${L.cur.m.err} mistake(s)`) : '✕ ' + u('wrong'))}</div>
    ${showAns && q.t !== 'match' ? `<div class="fb-a"><b>${u('answer')}</b> ${esc(answerText(q))}</div>` : ''}
    ${q.e ? `<div class="fb-e">💡 ${esc(T(q.e))}</div>` : ''}
    ${ok && L.combo >= 3 ? `<div class="fb-c">🔥 ${L.combo} ${u('combo2')}</div>` : ''}</div>`;
  chk.style.visibility = 'visible'; chk.disabled = false; chk.textContent = u('continue');
  chk.className = 'btn big ' + (ok ? 'good' : 'badb');
  $('.lp i').style.width = Math.round(L.solved / L.total * 100) + '%';
  $('.combo').classList.toggle('show', L.combo >= 3); $('.combo').textContent = '🔥 ' + L.combo;
  chk.focus({ preventScroll: true });
}
function next() {
  L.pos++;
  if (L.pos >= L.queue.length) return finish();
  renderQ();
}
function finish() {
  const secs = Math.round((Date.now() - L.t0) / 1000), perfect = L.missed.size === 0;
  const acc = Math.round(L.firstOk / L.total * 100);
  let xp = 0, title = u('lessonDone'), extra = '';
  const un = L.unit != null ? UNITS[L.unit] : null;
  if (L.mode === 'lesson') { xp = 10 + L.firstOk + (perfect ? 5 : 0); S.lessons[lid(un, L.k)] = (S.lessons[lid(un, L.k)] || 0) + 1; }
  else if (L.mode === 'checkpoint') {
    xp = 20 + L.firstOk + (perfect ? 5 : 0); S.lessons[lid(un, LPU)] = (S.lessons[lid(un, LPU)] || 0) + 1; S.unitDone[un.id] = true; title = u('unitDoneT');
    const nx = UNITS[L.unit + 1]; if (nx && !S.unlocked.includes(nx.id)) S.unlocked.push(nx.id);
  } else if (L.mode === 'practice') { xp = 5 + L.firstOk; S.st.practice++; quest('practice', 1); title = u('practiceDone'); }
  else if (L.mode === 'jump') {
    const pass = acc >= 80; xp = pass ? 20 : 5;
    if (pass) { S.st.jumps = (S.st.jumps || 0) + 1; for (let j = 0; j < L.unit; j++) if (!S.unitDone[UNITS[j].id]) S.unitDone[UNITS[j].id] = 'skip'; if (!S.unlocked.includes(un.id)) S.unlocked.push(un.id); }
    title = pass ? '🎉 ' + u('jumpPass') : u('jumpFail');
  }
  if (L.mode !== 'jump' || acc >= 80) { const hr = new Date().getHours(); if (hr < 5) S.st.night = 1; else if (hr < 7) S.st.early = 1; S.st.lessons++; if (perfect) { S.st.perfect++; quest('perfect', 1); } if (S.lang === 'en') S.st.en++; quest('lessons', 1); }
  // streak
  const d = today();
  if (S.last !== d) { S.streak = S.last && dayDiff(S.last, d) === 1 ? S.streak + 1 : 1; S.last = d; S.best = Math.max(S.best, S.streak); }
  const passed = L.mode !== 'jump' || acc >= 80;
  const by = L.mode === 'lesson' ? 5 + (perfect ? 5 : 0) : L.mode === 'checkpoint' ? 15 + (perfect ? 5 : 0) : L.mode === 'practice' ? 3 : passed ? 10 : 0;
  addBytes(by);
  addXP(xp); prune(); checkAch(); save();
  sfx('done');
  const mm = Math.floor(secs / 60), ss = String(secs % 60).padStart(2, '0');
  $('#overlay').innerHTML = `<div class="lesson done-screen" style="--c:${L.color}">
    <div class="confetti">${Array.from({ length: 40 }, () => `<i style="left:${rnd(0, 100)}%;animation-delay:${Math.random() * .8}s;background:hsl(${rnd(0, 360)} 85% 60%)"></i>`).join('')}</div>
    <div class="done-in">
      <div class="done-chars">${A.render(S.av, { size: 130, mood: passed ? 'celebrate' : 'sad' })}${M.render(passed ? 'celebrate' : 'sad', 190)}</div>
      <h1>${title}</h1>
      ${perfect ? `<p class="perf">${S.lang === 'pt' ? 'Lição perfeita! +5 XP' : 'Perfect lesson! +5 XP'}</p>` : ''}
      <div class="done-stats">
        <div class="ds gold"><small>${u('totalXp')}</small><b>⚡ ${xp}</b></div>
        <div class="ds green"><small>${u('accuracy')}</small><b>🎯 ${acc}%</b></div>
        <div class="ds blue"><small>${u('time')}</small><b>⏱ ${mm}:${ss}</b></div>
        <div class="ds orange"><small>${u('combo')}</small><b>🔥 ${L.maxCombo}</b></div>
      </div>
      ${by ? `<div class="bytes-earned">🪙 +${by} Bytes</div>` : ''}
      <div class="streak-big">🔥 ${S.streak} ${u('dayStreak')}</div>
      <button class="btn primary big wide" id="fin">${u('continue')}</button>
    </div></div>`;
  $('#fin').onclick = () => { endOverlay(); };
  $('#fin').focus();
}
function endOverlay() {
  L = null; const ov = $('#overlay'); ov.classList.remove('open'); ov.innerHTML = ''; document.body.classList.remove('locked');
  scrolledOnce = false; render();
}

/* ---------- keyboard ---------- */
document.addEventListener('keydown', e => {
  if ($('#modal-root').classList.contains('open')) { if (e.key === 'Escape') closeModal(); return; }
  if (!L) return;
  if (e.key === 'Enter') { const b = $('#chk'); if (b && !b.disabled && b.style.visibility !== 'hidden') { e.preventDefault(); b.click(); } else { const f = $('#fin'); if (f) { e.preventDefault(); f.click(); } } return; }
  if (L.checked || document.activeElement && document.activeElement.id === 'fill') return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 9) { const opts = $$('#area .opt'); if (opts[n - 1]) opts[n - 1].click(); else { const bank = $$('#area [data-b]:not(.used)'); if (bank[n - 1]) bank[n - 1].click(); } }
  if (e.key === 'Backspace') { const p = $$('#area [data-p]'); if (p.length) p[p.length - 1].click(); }
});

/* ---------- boot ---------- */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  let swReg = null;
  const hadController = !!navigator.serviceWorker.controller;
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => { swReg = r; r.update().catch(() => { }); }).catch(() => { }));
  // quando uma versão nova assume, recarrega uma vez (só fora de uma lição)
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return;
    const go = () => { if (reloaded) return; reloaded = true; location.reload(); };
    if (!L) go(); else { const t = setInterval(() => { if (!L) { clearInterval(t); go(); } }, 1000); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && swReg) swReg.update().catch(() => { }); });
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && !L) { ensureQuests(); render(); } });
render();
if (welcomeBytes > 0 && S.onboarded) { save(); setTimeout(() => toast(`🪙 +${welcomeBytes} Bytes ${S.lang === 'pt' ? 'de boas-vindas pelo seu progresso! Visite a aba Avatar 🐶' : 'welcome bonus for your progress! Visit the Avatar tab 🐶'}`), 600); }
})();
