/* NetTrail - avatar em SVG (camadas) + catálogo de itens da loja */
(() => {
'use strict';
const SKINS = ['#ffe0c7', '#f5c9a0', '#d9a273', '#b47a4c', '#8a5533', '#5c3a22'];
const HAIR_COLORS = ['#2b2118', '#6b3e1f', '#e8b84a', '#b4441f', '#9ca3af', '#3b82f6', '#ec4899', '#22c55e'];
const HAIRS = ['short', 'long', 'curly', 'bun', 'mohawk', 'side', 'bald'];
const EYES = ['dot', 'big', 'lash'];

/* ---------- catálogo ----------
   cat: hat | top | acc | hand | bg     price: Bytes     ach: conquista necessária (em vez de preço) */
const ITEMS = [
  // roupas
  { id: 'tee_teal', cat: 'top', n: ['Camiseta turquesa', 'Teal tee'], price: 0 },
  { id: 'tee_black', cat: 'top', n: ['Camiseta preta', 'Black tee'], price: 20 },
  { id: 'tee_red', cat: 'top', n: ['Camiseta vermelha', 'Red tee'], price: 20 },
  { id: 'tee_logo', cat: 'top', n: ['Camiseta NetTrail', 'NetTrail tee'], price: 60 },
  { id: 'hoodie', cat: 'top', n: ['Moletom dev', 'Dev hoodie'], price: 120 },
  { id: 'vest', cat: 'top', n: ['Colete refletivo', 'Hi-vis vest'], price: 150 },
  { id: 'polo_noc', cat: 'top', n: ['Polo do NOC', 'NOC polo'], price: 100 },
  { id: 'shirt_tie', cat: 'top', n: ['Camisa e gravata', 'Shirt and tie'], price: 180 },
  { id: 'coat', cat: 'top', n: ['Jaleco de laboratório', 'Lab coat'], price: 200 },
  { id: 'jacket', cat: 'top', n: ['Jaqueta jeans', 'Denim jacket'], price: 160 },
  { id: 'suit', cat: 'top', n: ['Terno de CTO', 'CTO suit'], price: 0, ach: 'sec3' },
  // chapéus
  { id: 'cap', cat: 'hat', n: ['Boné', 'Cap'], price: 40 },
  { id: 'beanie', cat: 'hat', n: ['Gorro', 'Beanie'], price: 60 },
  { id: 'hardhat', cat: 'hat', n: ['Capacete de obra', 'Hard hat'], price: 120 },
  { id: 'headset', cat: 'hat', n: ['Headset de suporte', 'Support headset'], price: 0, ach: 'sec4' },
  { id: 'hardhat_w', cat: 'hat', n: ['Capacete de engenheiro', 'Engineer hard hat'], price: 0, ach: 'sec5' },
  { id: 'grad', cat: 'hat', n: ['Capelo de formatura', 'Graduation cap'], price: 0, ach: 'sec2' },
  { id: 'wizard', cat: 'hat', n: ['Chapéu de mago do subnetting', 'Subnetting wizard hat'], price: 0, ach: 'sub' },
  { id: 'crown', cat: 'hat', n: ['Coroa', 'Crown'], price: 0, ach: 's30' },
  { id: 'cloud_hat', cat: 'hat', n: ['Nuvenzinha', 'Little cloud'], price: 0, ach: 'sec7' },
  // acessórios
  { id: 'glasses', cat: 'acc', n: ['Óculos', 'Glasses'], price: 50 },
  { id: 'shades', cat: 'acc', n: ['Óculos escuros', 'Sunglasses'], price: 80 },
  { id: 'goggles', cat: 'acc', n: ['Óculos de proteção', 'Safety goggles'], price: 90 },
  { id: 'badge', cat: 'acc', n: ['Crachá de acesso', 'Access badge'], price: 70 },
  { id: 'cable', cat: 'acc', n: ['Cabo de rede no pescoço', 'Network cable necklace'], price: 100 },
  { id: 'esd', cat: 'acc', n: ['Pulseira antiestática', 'ESD wrist strap'], price: 0, ach: 'unit' },
  // na mão
  { id: 'coffee', cat: 'hand', n: ['Café', 'Coffee'], price: 30 },
  { id: 'crimper', cat: 'hand', n: ['Alicate de crimpar', 'Crimper'], price: 90 },
  { id: 'laptop', cat: 'hand', n: ['Notebook', 'Laptop'], price: 150 },
  { id: 'flashlight', cat: 'hand', n: ['Lanterna', 'Flashlight'], price: 70 },
  { id: 'tester', cat: 'hand', n: ['Testador de cabo', 'Cable tester'], price: 110 },
  { id: 'console', cat: 'hand', n: ['Cabo de console', 'Console cable'], price: 0, ach: 'sec6' },
  // fundos
  { id: 'bg_teal', cat: 'bg', n: ['Turquesa', 'Teal'], price: 0 },
  { id: 'bg_purple', cat: 'bg', n: ['Roxo', 'Purple'], price: 0 },
  { id: 'bg_orange', cat: 'bg', n: ['Laranja', 'Orange'], price: 0 },
  { id: 'bg_rack', cat: 'bg', n: ['Rack', 'Rack'], price: 80 },
  { id: 'bg_dc', cat: 'bg', n: ['Corredor do data center', 'Data center aisle'], price: 150 },
  { id: 'bg_noc', cat: 'bg', n: ['Sala do NOC', 'NOC room'], price: 150 },
  { id: 'bg_cloud', cat: 'bg', n: ['Céu de nuvens', 'Cloudy sky'], price: 120 },
  { id: 'bg_night', cat: 'bg', n: ['Cidade à noite', 'City at night'], price: 200 },
  { id: 'bg_gold', cat: 'bg', n: ['Dourado lendário', 'Legendary gold'], price: 0, ach: 'uall' }
];
const DEFAULT = { skin: 1, hair: 'short', hairColor: 0, eyes: 'dot', top: 'tee_teal', hat: null, acc: null, hand: null, bg: 'bg_teal' };

const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const t = f < 0 ? 0 : 255, p = Math.abs(f); r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b); return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); };

/* ---------- camadas ---------- */
function bg(id, uid) {
  const solid = { bg_teal: '#99f6e4', bg_purple: '#ddd6fe', bg_orange: '#fed7aa' }[id];
  if (solid) return `<rect width="200" height="200" fill="${solid}"/>`;
  if (id === 'bg_rack') return `<rect width="200" height="200" fill="#cbd5e1"/><rect x="20" y="10" width="160" height="190" rx="6" fill="#1f2937"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="30" y="${20 + i * 22}" width="140" height="16" rx="2" fill="#374151"/><circle cx="40" cy="${28 + i * 22}" r="2.5" fill="${i % 3 ? '#22c55e' : '#f59e0b'}"/><rect x="150" y="${25 + i * 22}" width="12" height="6" fill="#111827"/>`).join('')}`;
  if (id === 'bg_dc') return `<rect width="200" height="200" fill="#0f172a"/><polygon points="0,200 70,90 130,90 200,200" fill="#1e293b"/><rect x="70" y="40" width="60" height="50" fill="#334155"/>${[0, 1, 2].map(i => `<polygon points="${-10 + i * 22},${60 + i * 12} ${10 + i * 22},${70 + i * 8} ${10 + i * 22},${200} ${-10 + i * 22},200" fill="#1f2937" stroke="#475569"/><polygon points="${210 - i * 22},${60 + i * 12} ${190 - i * 22},${70 + i * 8} ${190 - i * 22},200 ${210 - i * 22},200" fill="#1f2937" stroke="#475569"/>`).join('')}${Array.from({ length: 14 }, (_, i) => `<circle cx="${i % 2 ? 4 + (i % 3) * 22 : 196 - (i % 3) * 22}" cy="${80 + i * 8}" r="1.6" fill="${i % 4 ? '#38bdf8' : '#4ade80'}"/>`).join('')}`;
  if (id === 'bg_noc') return `<rect width="200" height="200" fill="#1e1b4b"/>${[[10, 14], [72, 14], [134, 14], [10, 62], [134, 62]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="56" height="40" rx="4" fill="#0f172a" stroke="#6366f1" stroke-width="2"/><polyline points="${x + 6},${y + 30} ${x + 18},${y + 18} ${x + 30},${y + 26} ${x + 42},${y + 10} ${x + 50},${y + 20}" fill="none" stroke="${['#22c55e', '#f59e0b', '#38bdf8', '#f472b6', '#a3e635'][i]}" stroke-width="2.5"/>`).join('')}`;
  if (id === 'bg_cloud') return `<defs><linearGradient id="sky${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#bfdbfe"/></linearGradient></defs><rect width="200" height="200" fill="url(#sky${uid})"/>${[[30, 40, 1], [160, 30, .8], [150, 120, 1.1], [25, 140, .9]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9"><circle cx="0" cy="0" r="14"/><circle cx="16" cy="-6" r="16"/><circle cx="32" cy="2" r="12"/><rect x="0" y="0" width="32" height="12"/></g>`).join('')}`;
  if (id === 'bg_night') return `<rect width="200" height="200" fill="#111827"/><circle cx="160" cy="36" r="14" fill="#fef3c7"/><circle cx="166" cy="31" r="12" fill="#111827"/>${Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 47) % 200}" cy="${(i * 29) % 80}" r="1.2" fill="#fff" opacity=".7"/>`).join('')}${[[0, 110, 34], [30, 80, 28], [56, 120, 30], [124, 90, 32], [154, 70, 26], [178, 115, 30]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${200 - y}" fill="#1f2937"/>${Array.from({ length: 8 }, (_, j) => `<rect x="${x + 5 + (j % 3) * 9}" y="${y + 8 + Math.floor(j / 3) * 14}" width="5" height="7" fill="${(j + x) % 3 ? '#fbbf24' : '#374151'}"/>`).join('')}`).join('')}`;
  if (id === 'bg_gold') return `<defs><radialGradient id="gold${uid}" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#fef3c7"/><stop offset=".6" stop-color="#fbbf24"/><stop offset="1" stop-color="#b45309"/></radialGradient></defs><rect width="200" height="200" fill="url(#gold${uid})"/>${Array.from({ length: 12 }, (_, i) => `<path d="M100 100 L${100 + 140 * Math.cos(i * Math.PI / 6)} ${100 + 140 * Math.sin(i * Math.PI / 6)} L${100 + 140 * Math.cos(i * Math.PI / 6 + .2)} ${100 + 140 * Math.sin(i * Math.PI / 6 + .2)} Z" fill="#fff" opacity=".18"/>`).join('')}`;
  return `<rect width="200" height="200" fill="#e2e8f0"/>`;
}
function hairBack(style, c) {
  if (style === 'long') return `<path d="M56 80 C52 30 148 30 144 80 L150 152 C132 162 68 162 50 152 Z" fill="${c}"/>`;
  if (style === 'curly') return `<g fill="${c}">${[[58, 70], [56, 92], [60, 112], [142, 70], [144, 92], [140, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13"/>`).join('')}</g>`;
  return '';
}
function hairFront(style, c) {
  const d = shade(c, -0.25);
  switch (style) {
    case 'short': return `<path d="M58 82 C50 22 150 22 142 82 C138 64 124 52 104 54 C96 60 80 62 66 60 C62 66 59 74 58 82 Z" fill="${c}"/><path d="M76 46 C90 40 112 40 124 48" stroke="${d}" stroke-width="3" fill="none" opacity=".5"/>`;
    case 'long': return `<path d="M58 84 C50 22 150 22 142 84 C136 62 120 50 100 50 C80 50 64 62 58 84 Z" fill="${c}"/><path d="M100 50 C92 58 84 62 74 64" stroke="${d}" stroke-width="3" fill="none" opacity=".5"/>`;
    case 'curly': return `<g fill="${c}">${[[64, 54], [78, 42], [94, 36], [110, 36], [124, 42], [136, 54], [70, 66], [130, 66], [100, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14"/>`).join('')}</g>`;
    case 'bun': return `<circle cx="100" cy="30" r="15" fill="${c}"/><path d="M58 82 C52 26 148 26 142 82 C136 60 120 50 100 50 C80 50 64 60 58 82 Z" fill="${c}"/>`;
    case 'mohawk': return `<path d="M86 60 C84 30 92 14 100 10 C108 14 116 30 114 60 C106 54 94 54 86 60 Z" fill="${c}"/>`;
    case 'side': return `<path d="M58 84 C50 20 152 18 142 80 C126 58 104 58 82 52 C74 60 64 70 58 84 Z" fill="${c}"/><path d="M58 84 C56 96 58 104 62 110 C60 98 62 90 66 82 Z" fill="${c}"/>`;
    default: return `<ellipse cx="86" cy="50" rx="10" ry="5" fill="#fff" opacity=".25"/>`;
  }
}
function face(av, mood, skin) {
  const ink = '#1f2937';
  let eyes, mouth, brows = '';
  const L = 86, R = 114, Y = 82;
  if (mood === 'happy' || mood === 'celebrate') eyes = `<path d="M${L - 6} ${Y + 2} Q${L} ${Y - 6} ${L + 6} ${Y + 2}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${R - 6} ${Y + 2} Q${R} ${Y - 6} ${R + 6} ${Y + 2}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  else if (av.eyes === 'big') eyes = [L, R].map(x => `<ellipse cx="${x}" cy="${Y}" rx="7" ry="8" fill="#fff"/><circle cx="${x + 1}" cy="${Y + 1}" r="4.5" fill="${ink}"/><circle cx="${x + 2.5}" cy="${Y - 1}" r="1.5" fill="#fff"/>`).join('');
  else if (av.eyes === 'lash') eyes = [L, R].map((x, i) => `<circle cx="${x}" cy="${Y}" r="4.5" fill="${ink}"/><path d="M${x + (i ? 3 : -3)} ${Y - 4} l${i ? 4 : -4} -4" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>`).join('');
  else eyes = [L, R].map(x => `<circle cx="${x}" cy="${Y}" r="4.5" fill="${ink}"/><circle cx="${x + 1.5}" cy="${Y - 1.5}" r="1.3" fill="#fff"/>`).join('');
  if (mood === 'sad') {
    brows = `<path d="M${L - 8} ${Y - 10} L${L + 5} ${Y - 14}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M${R + 8} ${Y - 10} L${R - 5} ${Y - 14}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
    mouth = `<path d="M90 106 Q100 98 110 106" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  } else if (mood === 'celebrate') mouth = `<path d="M88 98 Q100 116 112 98 Z" fill="#7f1d1d"/><path d="M93 104 Q100 110 107 104" fill="#f87171"/>`;
  else if (mood === 'happy') mouth = `<path d="M89 99 Q100 112 111 99" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  else mouth = `<path d="M91 100 Q100 108 109 100" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const cheeks = `<circle cx="73" cy="95" r="6" fill="#fb7185" opacity=".3"/><circle cx="127" cy="95" r="6" fill="#fb7185" opacity=".3"/>`;
  return cheeks + brows + eyes + mouth;
}
const TOPCOL = { tee_teal: '#14b8a6', tee_black: '#27272a', tee_red: '#dc2626', tee_logo: '#0d9488', hoodie: '#4b5563', vest: '#64748b', polo_noc: '#1e3a8a', shirt_tie: '#f8fafc', coat: '#f8fafc', jacket: '#3b6ea5', suit: '#1f2937' };
function torso(top) {
  const c = TOPCOL[top] || '#14b8a6', d = shade(c, -0.18);
  let s = `<path d="M44 200 C44 156 66 134 100 134 C134 134 156 156 156 200 Z" fill="${c}"/>`;
  if (top === 'tee_logo') s += `<g transform="translate(88 156) scale(.38)"><rect width="64" height="64" rx="16" fill="#fff"/><path d="M20 22L44 32L20 42" stroke="#0d9488" stroke-width="5" fill="none"/><circle cx="20" cy="22" r="5" fill="#0d9488"/><circle cx="44" cy="32" r="5" fill="#0d9488"/><circle cx="20" cy="42" r="5" fill="#0d9488"/></g>`;
  if (top === 'hoodie') s += `<path d="M70 138 C80 152 120 152 130 138 C124 132 76 132 70 138 Z" fill="${d}"/><path d="M92 150 L90 172 M108 150 L110 172" stroke="#e5e7eb" stroke-width="2.5" stroke-linecap="round"/><rect x="78" y="178" width="44" height="18" rx="6" fill="${d}"/>`;
  if (top === 'vest') s += `<path d="M58 200 L62 150 C70 140 84 136 90 136 L96 200 Z M142 200 L138 150 C130 140 116 136 110 136 L104 200 Z" fill="#f97316"/><rect x="60" y="168" width="35" height="6" fill="#e5e7eb"/><rect x="105" y="168" width="35" height="6" fill="#e5e7eb"/><rect x="59" y="182" width="36" height="6" fill="#e5e7eb"/><rect x="105" y="182" width="36" height="6" fill="#e5e7eb"/>`;
  if (top === 'polo_noc') s += `<path d="M86 134 L100 152 L114 134 L108 132 L100 142 L92 132 Z" fill="#f8fafc"/><circle cx="124" cy="160" r="5" fill="#38bdf8"/><path d="M100 152 L100 172" stroke="${d}" stroke-width="2"/>`;
  if (top === 'shirt_tie') s += `<path d="M86 134 L100 148 L114 134" fill="none" stroke="#cbd5e1" stroke-width="3"/><path d="M96 146 L104 146 L106 152 L102 190 L98 190 L94 152 Z" fill="#dc2626"/><path d="M95 146 L105 146 L103 152 L97 152 Z" fill="#b91c1c"/>`;
  if (top === 'coat') s += `<path d="M100 140 L100 200" stroke="#cbd5e1" stroke-width="2"/><path d="M86 136 L100 168 L82 156 Z M114 136 L100 168 L118 156 Z" fill="#e2e8f0"/><rect x="112" y="170" width="18" height="16" rx="2" fill="none" stroke="#cbd5e1" stroke-width="2"/><rect x="116" y="162" width="3" height="14" fill="#2563eb"/><path d="M92 136 Q100 144 108 136" fill="#14b8a6"/>`;
  if (top === 'jacket') s += `<path d="M100 138 L100 200" stroke="${d}" stroke-width="3"/><path d="M86 136 L98 160 L80 158 Z M114 136 L102 160 L120 158 Z" fill="${d}"/><path d="M92 136 Q100 146 108 136" fill="#f8fafc"/><circle cx="108" cy="172" r="2" fill="#fbbf24"/><circle cx="108" cy="186" r="2" fill="#fbbf24"/>`;
  if (top === 'suit') s += `<path d="M90 134 L100 150 L110 134 Z" fill="#f8fafc"/><path d="M97 146 L103 146 L105 180 L100 186 L95 180 Z" fill="#7c3aed"/><path d="M86 134 L100 176 L80 160 Z M114 134 L100 176 L120 160 Z" fill="#111827"/><rect x="118" y="164" width="12" height="4" fill="#fbbf24"/>`;
  if (top.startsWith('tee')) s += `<path d="M90 134 Q100 142 110 134" fill="none" stroke="${d}" stroke-width="3"/>`;
  return s;
}
function arms(top, skin, mood) {
  const c = TOPCOL[top] || '#14b8a6';
  if (mood === 'celebrate') return `<path d="M58 146 L34 96" stroke="${c}" stroke-width="18" stroke-linecap="round"/><circle cx="32" cy="90" r="10" fill="${skin}"/><path d="M142 146 L166 96" stroke="${c}" stroke-width="18" stroke-linecap="round"/><circle cx="168" cy="90" r="10" fill="${skin}"/>`;
  return `<path d="M56 150 L46 182" stroke="${c}" stroke-width="18" stroke-linecap="round"/><circle cx="45" cy="188" r="10" fill="${skin}"/><path d="M144 150 L154 182" stroke="${c}" stroke-width="18" stroke-linecap="round"/><circle cx="155" cy="188" r="10" fill="${skin}"/>`;
}
function hat(id) {
  switch (id) {
    case 'cap': return `<path d="M58 70 C58 30 142 30 142 70 Z" fill="#2563eb"/><path d="M130 66 C150 64 168 68 172 74 C160 76 140 74 128 72 Z" fill="#1d4ed8"/><circle cx="100" cy="36" r="4" fill="#1d4ed8"/>`;
    case 'beanie': return `<path d="M58 72 C56 24 144 24 142 72 Z" fill="#dc2626"/><rect x="54" y="62" width="92" height="16" rx="8" fill="#b91c1c"/><circle cx="100" cy="24" r="9" fill="#fca5a5"/>`;
    case 'hardhat': case 'hardhat_w': { const c = id === 'hardhat' ? '#facc15' : '#f8fafc', d = id === 'hardhat' ? '#ca8a04' : '#cbd5e1'; return `<path d="M60 66 C60 22 140 22 140 66 Z" fill="${c}"/><rect x="48" y="62" width="104" height="10" rx="5" fill="${d}"/><rect x="95" y="26" width="10" height="38" rx="4" fill="${d}"/>${id === 'hardhat_w' ? '<circle cx="80" cy="50" r="5" fill="#0d9488"/>' : ''}`; }
    case 'headset': return `<path d="M56 86 C52 20 148 20 144 86" stroke="#111827" stroke-width="7" fill="none"/><rect x="46" y="74" width="16" height="26" rx="7" fill="#111827"/><rect x="138" y="74" width="16" height="26" rx="7" fill="#111827"/><path d="M52 98 C52 116 66 118 80 112" stroke="#111827" stroke-width="4" fill="none"/><circle cx="82" cy="111" r="4.5" fill="#ef4444"/>`;
    case 'grad': return `<polygon points="100,22 158,40 100,58 42,40" fill="#111827"/><path d="M70 48 L70 64 C84 72 116 72 130 64 L130 48 L100 58 Z" fill="#1f2937"/><path d="M150 42 L152 70" stroke="#fbbf24" stroke-width="3"/><circle cx="152" cy="72" r="4" fill="#fbbf24"/>`;
    case 'wizard': return `<path d="M100 -6 L136 66 L64 66 Z" fill="#6d28d9"/><rect x="52" y="60" width="96" height="12" rx="6" fill="#5b21b6"/><text x="92" y="44" font-size="14" fill="#fde047">★</text><text x="104" y="26" font-size="9" fill="#fde047">/24</text>`;
    case 'crown': return `<path d="M64 56 L70 22 L86 42 L100 16 L114 42 L130 22 L136 56 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><circle cx="100" cy="44" r="5" fill="#ef4444"/><circle cx="80" cy="48" r="3.5" fill="#3b82f6"/><circle cx="120" cy="48" r="3.5" fill="#22c55e"/>`;
    case 'cloud_hat': return `<g fill="#fff" stroke="#93c5fd" stroke-width="2"><circle cx="82" cy="34" r="16"/><circle cx="104" cy="26" r="20"/><circle cx="124" cy="36" r="14"/><rect x="72" y="34" width="60" height="16" rx="8" stroke="none"/></g><text x="94" y="42" font-size="12" fill="#2563eb" font-weight="bold">OCI</text>`;
    default: return '';
  }
}
function acc(id, skin) {
  switch (id) {
    case 'glasses': return `<g fill="none" stroke="#1f2937" stroke-width="3"><circle cx="86" cy="82" r="11"/><circle cx="114" cy="82" r="11"/><path d="M97 82 L103 82 M75 80 L62 76 M125 80 L138 76"/></g>`;
    case 'shades': return `<path d="M72 74 L98 74 L96 90 C92 94 78 94 75 88 Z M102 74 L128 74 L125 88 C122 94 108 94 104 90 Z" fill="#111827"/><path d="M98 77 L102 77 M72 76 L60 72 M128 76 L140 72" stroke="#111827" stroke-width="3"/><path d="M78 78 L84 78" stroke="#fff" stroke-width="2" opacity=".6"/>`;
    case 'goggles': return `<rect x="66" y="70" width="68" height="24" rx="10" fill="#bae6fd" opacity=".75" stroke="#0369a1" stroke-width="3"/><path d="M66 80 L56 78 M134 80 L144 78" stroke="#0369a1" stroke-width="4"/>`;
    case 'badge': return `<path d="M84 136 L100 170 L116 136" stroke="#2563eb" stroke-width="3" fill="none"/><rect x="88" y="168" width="24" height="30" rx="3" fill="#f8fafc" stroke="#94a3b8"/><rect x="92" y="172" width="16" height="12" rx="2" fill="${skin}"/><rect x="92" y="188" width="16" height="3" fill="#94a3b8"/>`;
    case 'cable': return `<path d="M72 140 C80 166 120 166 128 140" stroke="#2563eb" stroke-width="5" fill="none"/><path d="M128 140 C134 156 132 170 126 182" stroke="#2563eb" stroke-width="5" fill="none"/><rect x="119" y="180" width="14" height="14" rx="2" fill="#e0f2fe" stroke="#94a3b8"/><path d="M122 192 v-4 M125 192 v-4 M128 192 v-4 M131 192 v-4" stroke="#f59e0b" stroke-width="1.2"/>`;
    case 'esd': return `<rect x="35" y="174" width="20" height="7" rx="3" fill="#111827"/><path d="M45 180 C40 196 30 198 22 200" stroke="#16a34a" stroke-width="3" fill="none"/>`;
    default: return '';
  }
}
function hand(id, mood) {
  const x = mood === 'celebrate' ? 168 : 155, y = mood === 'celebrate' ? 90 : 188;
  const g = s => `<g transform="translate(${x} ${y})">${s}</g>`;
  switch (id) {
    case 'coffee': return g(`<rect x="-10" y="-24" width="20" height="24" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M10 -18 C18 -18 18 -6 10 -6" stroke="#94a3b8" stroke-width="3" fill="none"/><rect x="-7" y="-20" width="14" height="4" fill="#78350f"/><path d="M-4 -30 C-6 -36 -2 -38 -4 -44 M3 -30 C1 -36 5 -38 3 -44" stroke="#cbd5e1" stroke-width="2" fill="none"/>`);
    case 'crimper': return g(`<path d="M-4 -2 L-12 -40 L-4 -44 L4 -6 Z" fill="#dc2626"/><path d="M4 -2 L14 -38 L6 -42 L-2 -6 Z" fill="#2563eb"/><path d="M-12 -40 L-6 -56 L2 -54 L-4 -44 Z M14 -38 L10 -54 L2 -54 L6 -42 Z" fill="#6b7280"/>`);
    case 'laptop': return g(`<rect x="-30" y="-34" width="40" height="28" rx="3" fill="#334155" transform="skewX(-6)"/><rect x="-26" y="-30" width="32" height="20" rx="2" fill="#38bdf8" transform="skewX(-6)"/><rect x="-34" y="-6" width="46" height="6" rx="2" fill="#475569"/><path d="M-22 -24 h12 M-22 -19 h18 M-22 -14 h8" stroke="#0f172a" stroke-width="2" transform="skewX(-6)"/>`);
    case 'flashlight': return g(`<rect x="-5" y="-40" width="10" height="36" rx="3" fill="#374151"/><path d="M-8 -40 L8 -40 L6 -48 L-6 -48 Z" fill="#6b7280"/><path d="M-6 -48 L-22 -80 L22 -80 L6 -48 Z" fill="#fde68a" opacity=".55"/>`);
    case 'tester': return g(`<rect x="-12" y="-44" width="24" height="40" rx="5" fill="#f59e0b"/><rect x="-8" y="-40" width="16" height="10" rx="2" fill="#0f172a"/>${[0, 1, 2, 3].map(i => `<circle cx="${-6 + i * 4}" cy="-22" r="1.5" fill="#22c55e"/>`).join('')}<rect x="-4" y="-14" width="8" height="6" rx="1" fill="#111827"/>`);
    case 'console': return g(`<path d="M0 -6 C0 -30 -30 -30 -24 -54" stroke="#60a5fa" stroke-width="5" fill="none"/><rect x="-32" y="-66" width="18" height="12" rx="2" fill="#93c5fd" stroke="#1d4ed8"/><rect x="-6" y="-10" width="12" height="10" rx="2" fill="#1d4ed8"/>`);
    default: return '';
  }
}
let uidN = 0;
function render(avIn, opts = {}) {
  const av = Object.assign({}, DEFAULT, avIn || {});
  const mood = opts.mood || 'neutral', size = opts.size || 120, uid = ++uidN;
  const skin = SKINS[av.skin] || SKINS[1], hc = HAIR_COLORS[av.hairColor] || HAIR_COLORS[0];
  const hatOn = !!av.hat, hidesHair = ['hardhat', 'hardhat_w', 'beanie', 'cap', 'grad', 'wizard'].includes(av.hat);
  const body = [
    opts.noBg ? '' : bg(av.bg, uid),
    hairBack(av.hair, hc),
    torso(av.top),
    `<rect x="90" y="112" width="20" height="26" rx="8" fill="${shade(skin, -0.08)}"/>`,
    arms(av.top, skin, mood),
    `<circle cx="60" cy="84" r="8" fill="${skin}"/><circle cx="140" cy="84" r="8" fill="${skin}"/>`,
    `<circle cx="100" cy="78" r="41" fill="${skin}"/>`,
    face(av, mood, skin),
    hidesHair && av.hair !== 'long' && av.hair !== 'curly' ? '' : hairFront(av.hair, hc),
    hatOn ? hat(av.hat) : '',
    acc(av.acc, skin),
    hand(av.hand, mood)
  ].join('');
  const cls = 'avatar' + (opts.cls ? ' ' + opts.cls : '');
  return `<svg class="${cls}" viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="avatar"><defs><clipPath id="clip${uid}"><rect width="200" height="200" rx="${opts.round === false ? 0 : 40}"/></clipPath></defs><g clip-path="url(#clip${uid})">${body}</g></svg>`;
}
window.NTAvatar = { render, ITEMS, DEFAULT, SKINS, HAIR_COLORS, HAIRS, EYES };

/* ---------- mascote: basset hound ("Patch") ----------
   moods: neutral | happy | sad | celebrate | think */
function dog(mood = 'neutral', size = 160, extra = '') {
  const tan = '#c8864a', tanD = '#9a5f2c', earC = '#7a4520', black = '#2b2420', white = '#fbf7f2', ink = '#1f1a17';
  const happy = mood === 'happy' || mood === 'celebrate';
  const earRot = mood === 'sad' ? 8 : happy ? -6 : 0;
  const eye = happy
    ? `<path d="M184 66 Q190 59 196 66" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : mood === 'sad'
      ? `<ellipse cx="190" cy="67" rx="5" ry="6" fill="${ink}"/><circle cx="191.5" cy="65" r="1.6" fill="#fff"/><path d="M182 58 L197 62" stroke="${tanD}" stroke-width="3.5" stroke-linecap="round"/><path d="M187 74 C186 80 186 84 188 86" stroke="#60a5fa" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="190" cy="67" rx="5" ry="6" fill="${ink}"/><circle cx="191.5" cy="65" r="1.6" fill="#fff"/><path d="M183 62 Q190 58 197 62" stroke="${tanD}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const mouth = happy
    ? `<path d="M206 92 Q214 100 224 92" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M211 95 Q213 110 218 108 Q222 106 220 95 Z" fill="#f87171" stroke="#dc2626" stroke-width="1.5"/>`
    : mood === 'sad'
      ? `<path d="M207 98 Q215 92 223 98" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path d="M208 94 Q215 99 222 94" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const think = mood === 'think' ? `<g fill="#fff" stroke="#cbd5e1" stroke-width="2"><circle cx="150" cy="30" r="5"/><circle cx="160" cy="18" r="7"/><ellipse cx="186" cy="8" rx="20" ry="12"/></g><text x="178" y="13" font-size="13" font-weight="bold" fill="#0d9488">?</text>` : '';
  const sparkle = mood === 'celebrate' ? `<g fill="#fbbf24"><path d="M30 20 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z"/><path d="M120 12 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/><path d="M230 28 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z"/></g>` : '';
  return `<svg class="dog ${mood}" viewBox="0 0 240 170" width="${size}" height="${Math.round(size * 170 / 240)}" role="img" aria-label="Patch, o basset">
    ${sparkle}${think}
    <ellipse cx="120" cy="160" rx="96" ry="7" fill="#000" opacity=".12"/>
    <g class="dog-body">
      <g class="dog-tail"><path d="M44 96 C26 84 20 62 28 46" stroke="${tan}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M28 46 C26 52 27 56 30 58" stroke="${white}" stroke-width="10" fill="none" stroke-linecap="round"/></g>
      <rect x="66" y="118" width="18" height="34" rx="8" fill="${tanD}"/><rect x="146" y="118" width="18" height="34" rx="8" fill="${tanD}"/>
      <rect x="40" y="78" width="146" height="58" rx="29" fill="${tan}"/>
      <path d="M66 82 C90 70 140 70 166 84 C150 98 92 100 66 82 Z" fill="${black}"/>
      <path d="M60 124 C90 140 140 140 170 124 L170 132 C140 144 90 144 60 132 Z" fill="${white}"/>
      <rect x="54" y="118" width="20" height="36" rx="9" fill="${tan}"/><rect x="132" y="118" width="20" height="36" rx="9" fill="${tan}"/>
      <ellipse cx="62" cy="153" rx="13" ry="6" fill="${white}"/><ellipse cx="140" cy="153" rx="13" ry="6" fill="${white}"/>
      <path d="M160 96 C168 112 176 118 188 118" stroke="#0d9488" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="168" y="112" width="11" height="13" rx="2" fill="#fde68a" stroke="#ca8a04" stroke-width="1.5"/><path d="M170.5 121 v-3 M173.5 121 v-3 M176.5 121 v-3" stroke="#ca8a04" stroke-width="1.2"/>
      <g class="dog-head" transform="translate(196 84) scale(1.18) translate(-196 -84)">
        <path d="M168 70 C168 46 188 38 202 44 C214 50 218 62 218 74 L228 80 C236 86 234 100 222 102 L196 104 C178 104 166 90 168 70 Z" fill="${tan}"/>
        <path d="M196 44 C200 58 202 70 206 80 L226 82 C234 88 232 100 222 102 L200 104 C196 92 192 70 192 48 Z" fill="${white}"/>
        <ellipse cx="229" cy="83" rx="7" ry="6" fill="${ink}"/><ellipse cx="227" cy="81" rx="2.5" ry="1.6" fill="#fff" opacity=".6"/>
        ${eye}${mouth}
        <g transform="rotate(${earRot} 178 56)"><path d="M178 54 C162 56 156 80 158 104 C160 122 172 126 180 118 C186 104 188 76 182 56 Z" fill="${earC}"/><path d="M174 66 C168 82 168 100 172 112" stroke="#5c3317" stroke-width="2" fill="none" opacity=".5"/></g>
      </g>
    </g>${extra}
  </svg>`;
}
window.NTMascot = { render: dog, name: 'Patch' };
})();
