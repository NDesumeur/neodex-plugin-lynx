// Lynx : deux images presque pareilles : trouve les différences avant la fin du temps.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Lynx</span><span class="hint">Clic sur une différence, dans l’une des deux images · flèches et Entrée au clavier · H : indice · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="lxCanvas" width="240" height="124" role="img" aria-label="Lynx"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="lxStats"></div></div>
      <div class="row"><button class="btn main" id="lxNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Deux images presque pareilles : à droite, quelques objets ont changé. Un objet a disparu, a changé de couleur ou regarde de l'autre côté. Clique dessus, dans l'image de gauche ou de droite. Un clic faux coûte 5 secondes, un indice 15. Tu as une minute et demie par niveau ; plus il te reste de temps, plus tu gagnes d'étoiles. Jardin, plage et ville la nuit, et de plus en plus de différences.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,560px);width:auto;aspect-ratio:240/124;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "LYNX", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#ffd84a", "accL": "#fff4c0", "accS": "#c8a02a", "accD": "#2a2008", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#2a2008", "spark2": "#ffd84a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", ".kkkk..kkkk.", "kwwwwkkwwwwk", "kwkkwkkwkkwk", "kwkgwkkwkgwk", "kwwwwkkwwwwk", ".kkkk..kkkk.", "............", "..kk....kk..", ".kook..kook.", "..kk....kk..", "............"],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Lynx : deux images presque pareilles, trouve les différences. Chaque niveau dessine une scène en pixel art
   (jardin, plage ou ville la nuit) à partir de son numéro, puis change quelques objets à droite : enlevé, autre couleur, retourné, ajouté ---------- */
const LX = {W: 240, H: 124, PW: 112, PH: 96, LX0: 4, RX0: 124, Y0: 20, TIME: 5400};
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const lxs = gstore('lynx', {level: 1, found: 0, games: 0, stars: 0});
let lx = null, lxac = null, lxMute = false;
function lxBeep(f, d, type = 'square', slide = 0, vol = .03) { if (lxMute) return; try { lxac ??= new AudioContext(); const o = lxac.createOscillator(), g = lxac.createGain(), t = lxac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(lxac.destination); o.start(t); o.stop(t + d); } catch {} }
// les petits dessins, tournés vers la droite ; « c » est la couleur principale (celle qui peut changer)
const LX_SPR = {
  bird: ['...kk.', 'kkkkck', '.kkkk.', '..k...'],
  cat: ['k...k.....', 'kckck.....', 'kwcck.....', 'kceck..kk.', 'kcwpk.kck.', '.kcccckck.', '..kccccck.', '..kccccck.', '..kckkck..', '..kk.kk...'],
  flower: ['.c.c.', 'ccycc', '.c.c.', '..g..', '.gg..', '..g..', '..g..'],
  mush: ['.kkk.', 'kcwck', 'kcccc', '.kwk.', '.kwk.'],
  fly: ['c.k.c', 'cckcc', '.ckc.', 'c.k.c'],
  mailbox: ['kkkkk.', 'kcccck', 'kcccck', 'kkkkkk', '..kk..', '..kk..', '..kk..', '..kk..'],
  crab: ['k......k', 'ck.kk.kc', '.kccccck', 'kcckcckc', '.k.k.k.k'],
  shell: ['..k..', '.kck.', 'kcwck', 'kcccck'.slice(0, 5), '.kkk.'],
  star: ['..c..', '.ccc.', 'ccccc', '.c.c.', 'c...c'],
  ball: ['.kk.', 'kcwk', 'kwck', '.kk.'],
  boat: ['......k.......', '.....kck......', '....kccck.....', '...kcccck.....', '..kccccck.....', '......k.......', 'kkkkkkkkkkkkkk', '.kbbbbbbbbbbk.', '..kbbbbbbbbk..'],
  castle: ['.k.k.k.k.', 'kskskskskk'.slice(0, 9), 'ksssssssk', 'kssskssk.'.padEnd(9, 'k'), 'kssskksssk'.slice(0, 9), 'ksssssssk'],
  car: ['...kkkkk......', '..kcwwcck.....', '.kcccccccckkk.', 'kccccccccccccl', 'kkkccccccckkkk', '..kwk....kwk..', '...k......k...'],
  lamp: ['kkkk', 'kcck', '.kk.', '.kk.', '.kk.', '.kk.', '.kk.', '.kk.', '.kk.', '.kk.', 'kkkk'],
  moon: ['..kkk.', '.kcck.', 'kcck..', 'kck...', 'kcck..', '.kcck.', '..kkk.'],
};
const LX_SPR_PAL = {k: '#1a1408', w: '#ffffff', y: '#ffd84a', g: '#3a8a2a', e: '#1a1408', p: '#ff9ab0', s: '#e8c87a', b: '#8a5a3a', l: '#ffd84a'};
const LX_ALT = ['#e83a3a', '#3a7ae8', '#ffd84a', '#c84ae8', '#ffffff', '#3ac85a', '#ff8a2a', '#1a1a2a'];
// une scène : un fond (dessiné tel quel) et des objets ; tout vient du numéro du niveau
function lxScene(level) {
  const r = seeded(level * 7919 + 13), ri = (a, b) => a + Math.floor(r() * (b - a + 1)), pick = a => a[Math.floor(r() * a.length)], items = [];
  const theme = ['jardin', 'plage', 'ville'][(level - 1) % 3], add = o => items.push(o);
  const spr = (s, x, y, c, more) => add({t: 'spr', s, x, y, c, ...more});
  if (theme === 'jardin') {
    const left = r() < .5, hx = left ? ri(6, 16) : ri(66, 76), tx = left ? ri(70, 84) : ri(14, 28);
    add({t: 'sun', x: left ? ri(84, 100) : ri(10, 26), y: ri(10, 16), c: '#ffd84a'});
    for (let i = 0, n = ri(2, 3); i < n; i++) add({t: 'cloud', x: ri(4, 80), y: ri(6, 26), bumps: [ri(3, 5), ri(4, 7), ri(3, 6), ri(2, 4)], c: '#ffffff'});
    for (let i = 0, n = ri(1, 3); i < n; i++) spr('bird', ri(20, 96), ri(8, 34), '#2a2a3a', {flip: r() < .5});
    add({t: 'wall', x: hx, y: 50, c: pick(['#e8d8b0', '#f0c8a0', '#d8e0f0'])}); add({t: 'roof', x: hx, y: 50, c: pick(['#c84a3a', '#5a6ac8', '#8a5a3a'])});
    add({t: 'chim', x: hx + 20, y: 38}); add({t: 'door', x: hx + 11, y: 59, c: pick(['#8a5a3a', '#3a7ae8', '#3a8a3a'])});
    add({t: 'win', x: hx + 3, y: 55, c: '#8ad0f0'}); add({t: 'win', x: hx + 19, y: 55, c: '#8ad0f0'});
    add({t: 'tree', x: tx, y: 68}); for (let i = 0, n = ri(3, 5); i < n; i++) add({t: 'apple', x: tx - 8 + ri(0, 16), y: 42 + ri(0, 12), c: '#e83a3a'});
    for (let x = left ? 40 : 4; x < (left ? 64 : 40); x += 6) add({t: 'post', x, y: 62});
    for (let i = 0, n = ri(5, 8); i < n; i++) spr('flower', ri(2, 104), ri(74, 86), pick(['#e83a3a', '#ffd84a', '#c84ae8', '#ffffff', '#ff8ab0']));
    spr('cat', ri(40, 60), ri(76, 84), pick(['#ff9a3a', '#8a8a9a', '#3a3a3a']), {flip: r() < .5});
    spr('mush', ri(4, 100), ri(84, 88), '#e83a3a'); spr('fly', ri(30, 90), ri(36, 48), pick(['#ff8a2a', '#3ab8e8', '#ffd84a']));
    spr('mailbox', left ? hx + 30 : hx - 8, 64, '#3a7ae8');
    return {theme, bg: {t: 'jardin', hill: r() * 6}, items};
  }
  if (theme === 'plage') {
    add({t: 'sun', x: ri(10, 100), y: ri(8, 14), c: '#ffd84a'});
    for (let i = 0, n = ri(1, 2); i < n; i++) add({t: 'cloud', x: ri(4, 80), y: ri(6, 22), bumps: [ri(3, 5), ri(4, 7), ri(3, 6), ri(2, 4)], c: '#ffffff'});
    for (let i = 0, n = ri(2, 3); i < n; i++) spr('bird', ri(10, 100), ri(10, 30), '#ffffff', {flip: r() < .5});
    spr('boat', ri(10, 90), 36, pick(['#ffffff', '#e83a3a', '#ffd84a']), {flip: r() < .5});
    const px0 = r() < .5 ? ri(8, 20) : ri(84, 96);
    add({t: 'palm', x: px0, y: 82}); for (let i = 0, n = ri(2, 3); i < n; i++) add({t: 'coco', x: px0 - 3 + i * 3, y: 52 + (i % 2), c: '#8a5a3a'});
    add({t: 'umb', x: px0 < 50 ? ri(56, 70) : ri(28, 40), y: 60, c: pick(['#e83a3a', '#3a7ae8', '#c84ae8'])});
    add({t: 'towel', x: ri(30, 70), y: ri(80, 84), c: pick(['#3a7ae8', '#e83a3a', '#3ac85a'])});
    spr('crab', ri(6, 96), ri(70, 76), '#e85a3a', {flip: r() < .5});
    for (let i = 0, n = ri(2, 4); i < n; i++) spr('shell', ri(4, 104), ri(84, 90), pick(['#ffb0c0', '#f0e0c0']));
    spr('star', ri(4, 100), ri(66, 90), '#ff8a2a'); spr('ball', ri(20, 90), ri(68, 78), pick(['#e83a3a', '#3a7ae8']));
    const cx0 = ri(40, 80); spr('castle', cx0, 66, '#e8c87a'); add({t: 'flag', x: cx0 + 4, y: 58, c: '#e83a3a'});
    return {theme, bg: {t: 'plage', wave: r() * 6}, items};
  }
  const bld = []; let x = 0;
  while (x < LX.PW) { const w = ri(16, 26), h = ri(30, 60); bld.push({x, w, h, c: pick(['#2a2e5a', '#34386a', '#262a4a', '#3a3460'])}); x += w + ri(0, 2); }
  add({t: 'moon', x: ri(8, 96), y: ri(6, 12), c: '#f0f0c0', flip: r() < .5});
  for (let i = 0, n = ri(6, 9); i < n; i++) add({t: 'twinkle', x: ri(3, 106), y: ri(4, 26), c: '#fff8d0'});
  for (const b of bld) for (let wy = 82 - b.h + 6; wy < 74; wy += 8) for (let wx = b.x + 3; wx < b.x + b.w - 5; wx += 6) add({t: 'bwin', x: wx, y: wy, c: r() < .55 ? '#ffd84a' : '#1a1a30'});
  for (let i = 0; i < 2; i++) spr('lamp', 20 + i * 60 + ri(0, 10), 76, '#ffd84a');
  for (let i = 0, n = ri(1, 2); i < n; i++) spr('car', ri(4, 94), 82, pick(['#e83a3a', '#3a7ae8', '#ffd84a', '#3ac85a']), {flip: r() < .5});
  const top = bld[ri(0, bld.length - 1)]; spr('cat', top.x + 4, 82 - top.h - 10, '#9a9aaa', {flip: r() < .5});
  return {theme, bg: {t: 'ville', bld}, items};
}
const lxCircle = (g, cx, cy, rad, c) => { for (let y = -rad; y <= rad; y++) for (let x = -rad; x <= rad; x++) if (x * x + y * y <= rad * rad + rad) px(g, c, cx + x, cy + y); };
function lxDrawItem(g, o) {
  const k = '#1a1408';
  switch (o.t) {
    case 'spr': { let rows = LX_SPR[o.s]; if (o.flip) rows = rows.map(r => [...r].reverse().join('')); sprite(g, rows, o.x, o.y, {...LX_SPR_PAL, c: o.c}); break; }
    case 'sun': lxCircle(g, o.x, o.y, 6, k); lxCircle(g, o.x, o.y, 5, o.c); px(g, '#fff8d0', o.x - 2, o.y - 3, 2, 2); break;
    case 'cloud': { let x = o.x; const bb = o.flip ? [...o.bumps].reverse() : o.bumps; for (const b of bb) { px(g, '#d8e8f8', x, o.y + 1, b * 2, b); px(g, o.c, x, o.y - b + 3, b * 2, b); x += b * 2 - 1; } px(g, '#d8e8f8', o.x, o.y + 3, x - o.x, 2); break; }
    case 'wall': px(g, k, o.x - 1, o.y - 1, 30, 20); px(g, o.c, o.x, o.y, 28, 18); px(g, 'rgba(0,0,0,.08)', o.x, o.y + 14, 28, 4); break;
    case 'roof': for (let i = 0; i < 12; i++) { px(g, k, o.x - 3 + i, o.y - 1 - i, 34 - i * 2, 1); px(g, o.c, o.x - 2 + i, o.y - 1 - i, 32 - i * 2, 1); } break;
    case 'chim': px(g, k, o.x - 1, o.y - 1, 6, 9); px(g, '#a84a3a', o.x, o.y, 4, 8); px(g, '#c8c8d0', o.x + 1, o.y - 5, 3, 3); px(g, '#e0e0e8', o.x + 3, o.y - 9, 3, 3); break;
    case 'door': px(g, k, o.x - 1, o.y - 1, 8, 10); px(g, o.c, o.x, o.y, 6, 9); px(g, '#ffd84a', o.x + 4, o.y + 4, 1, 1); break;
    case 'win': px(g, k, o.x - 1, o.y - 1, 8, 7); px(g, o.c, o.x, o.y, 6, 5); px(g, '#ffffff', o.x + 2, o.y, 1, 5); px(g, '#ffffff', o.x, o.y + 2, 6, 1); break;
    case 'tree': px(g, k, o.x - 3, o.y - 22, 6, 23); px(g, '#8a5a3a', o.x - 2, o.y - 22, 4, 22); lxCircle(g, o.x, o.y - 26, 13, k); lxCircle(g, o.x, o.y - 26, 12, '#3a9a3a'); lxCircle(g, o.x - 3, o.y - 30, 6, '#5ab84a'); break;
    case 'apple': px(g, k, o.x - 1, o.y - 1, 4, 4); px(g, o.c, o.x, o.y, 2, 2); break;
    case 'post': px(g, k, o.x - 1, o.y - 1, 4, 11); px(g, '#e8d8b0', o.x, o.y, 2, 10); px(g, '#c8b890', o.x + 2, o.y + 2, 4, 1); px(g, '#c8b890', o.x + 2, o.y + 6, 4, 1); break;
    case 'palm': for (let i = 0; i < 28; i++) { const xx = o.x + Math.round(Math.sin(i / 9) * 3); px(g, k, xx - 2, o.y - i, 5, 1); px(g, i % 4 < 2 ? '#a87a4a' : '#8a5a3a', xx - 1, o.y - i, 3, 1); }
      for (const [dx, dy] of [[-1, 0], [1, 0], [-1, .5], [1, .5]]) for (let i = 0; i < 12; i++) px(g, '#3a9a3a', o.x + 2 + dx * i, o.y - 29 + dy * i + Math.abs(i - 5) * .3 * (dy ? 1 : -1) + (dy ? 0 : i * .25), 2, 2);
      break;
    case 'coco': px(g, k, o.x, o.y - 1, 4, 4); px(g, o.c, o.x + 1, o.y, 2, 2); break;
    case 'umb': for (let i = 0; i < 7; i++) { const w = 4 + i * 2; for (let j = 0; j < w; j++) px(g, (j >> 2) % 2 ? '#ffffff' : o.c, o.x - w / 2 + j, o.y - 7 + i, 1, 1); } px(g, k, o.x - 9, o.y, 18, 1); px(g, '#e8e0d0', o.x, o.y, 1, 16); break;
    case 'towel': px(g, k, o.x - 1, o.y - 1, 18, 7); px(g, o.c, o.x, o.y, 16, 5); px(g, '#ffffff', o.x + 3, o.y, 2, 5); px(g, '#ffffff', o.x + 11, o.y, 2, 5); break;
    case 'flag': px(g, k, o.x, o.y, 1, 8); px(g, o.c, o.x + 1, o.y, 4, 3); break;
    case 'moon': { let rows = LX_SPR.moon; if (o.flip) rows = rows.map(r => [...r].reverse().join('')); const big = rows.flatMap(r => { const d = r.replace(/./g, '$&$&'); return [d, d]; }); sprite(g, big, o.x, o.y, {k, c: o.c}); break; }
    case 'twinkle': px(g, o.c, o.x - 1, o.y, 3, 1); px(g, o.c, o.x, o.y - 1, 1, 3); break;
    case 'bwin': px(g, o.c, o.x, o.y, 3, 4); break;
  }
}
function lxDrawBg(g, bg) {
  const {PW, PH} = LX;
  if (bg.t === 'jardin') {
    px(g, '#8ad0f0', 0, 0, PW, PH); px(g, '#a8e0f8', 0, 30, PW, 30);
    for (let x = 0; x < PW; x++) { const h = Math.round(6 + 4 * Math.sin(x / 14 + bg.hill)); px(g, '#7ac85a', x, 60 - h, 1, h); }
    px(g, '#5aa83a', 0, 60, PW, PH - 60); for (let x = 0; x < PW; x += 7) px(g, '#4a983a', x + (x % 3), 66 + (x * 7) % 26, 2, 1);
  } else if (bg.t === 'plage') {
    px(g, '#9ad8f8', 0, 0, PW, 40); px(g, '#3a9ad8', 0, 40, PW, 18); for (let x = 0; x < PW; x += 6) px(g, '#8ad0f0', x + Math.round(bg.wave + (x % 12 ? 0 : 2)), 46 + (x % 3) * 3, 3, 1);
    px(g, '#e8d8a0', 0, 58, PW, PH - 58); px(g, '#ffffff', 0, 58, PW, 1); for (let x = 3; x < PW; x += 9) px(g, '#d8c890', x, 70 + (x * 5) % 22, 2, 1);
  } else {
    for (let y = 0; y < PH; y += 2) px(g, y < 30 ? '#14143a' : y < 60 ? '#1a1a4a' : '#22225a', 0, y, PW, 2);
    for (const b of bg.bld) { px(g, '#0e0e22', b.x - 1, 82 - b.h - 1, b.w + 2, b.h + 1); px(g, b.c, b.x, 82 - b.h, b.w, b.h); }
    px(g, '#3a3a4a', 0, 82, PW, PH - 82); for (let x = 2; x < PW; x += 12) px(g, '#ffd84a', x, 89, 6, 1);
  }
}
function lxRender(scene, items) {
  const c = Object.assign(document.createElement('canvas'), {width: LX.PW, height: LX.PH}), g = c.getContext('2d');
  lxDrawBg(g, scene.bg); for (const o of items) lxDrawItem(g, o); return c;
}
// les changements possibles d'un objet : enlevé, autre couleur, retourné ; ou un objet ajouté
function lxMutations(o, r) {
  const m = [];
  if (!['wall', 'tree', 'palm'].includes(o.t)) m.push(it => it.splice(it.indexOf(o), 1));
  if (o.c && !['bwin', 'cloud'].includes(o.t)) { const alt = LX_ALT.filter(c => c !== o.c); const nc = alt[Math.floor(r() * alt.length)]; m.push(it => { it[it.indexOf(o)] = {...o, c: nc}; }); }
  if (o.t === 'bwin') m.push(it => { it[it.indexOf(o)] = {...o, c: o.c === '#ffd84a' ? '#1a1a30' : '#ffd84a'}; });
  if ('flip' in o || o.t === 'cloud') m.push(it => { it[it.indexOf(o)] = {...o, flip: !o.flip}; });
  return m;
}
const lxPixels = c => c.getContext('2d').getImageData(0, 0, LX.PW, LX.PH).data;
// fabrique un niveau : garde seulement les changements qui se voient vraiment (au moins 6 pixels) et qui ne se touchent pas
function lxLevel(level) {
  const scene = lxScene(level), r = seeded(level * 104729 + 7), n = level < 4 ? 5 : level < 9 ? 6 : 7, base = lxPixels(lxRender(scene, scene.items)), diffs = [];
  let right = [...scene.items];
  const cands = scene.items.flatMap(o => lxMutations(o, r).map(f => ({o, f}))); for (let i = cands.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cands[i], cands[j]] = [cands[j], cands[i]]; }
  const used = new Set();
  for (const {o, f} of cands) {
    if (diffs.length >= n || used.has(o)) continue;
    const test = [...scene.items]; f(test); const p = lxPixels(lxRender(scene, test));
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, cnt = 0;
    for (let i = 0; i < p.length; i += 4) if (p[i] !== base[i] || p[i + 1] !== base[i + 1] || p[i + 2] !== base[i + 2]) { const x = (i >> 2) % LX.PW, y = Math.floor((i >> 2) / LX.PW); cnt++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    if (cnt < 6 || x1 - x0 > 40 || y1 - y0 > 40) continue;
    const box = [x0, y0, x1 + 1, y1 + 1];
    if (diffs.some(d => box[0] < d.box[2] + 3 && box[2] + 3 > d.box[0] && box[1] < d.box[3] + 3 && box[3] + 3 > d.box[1])) continue;
    diffs.push({box, found: false}); used.add(o);
    const k = right.indexOf(o); right = [...right]; const sub = [...scene.items]; f(sub); if (k >= 0) { const repl = sub.find(s => !scene.items.includes(s)); if (repl) right[k] = repl; else right.splice(k, 1); }
  }
  return {scene, diffs, left: lxRender(scene, scene.items), right: lxRender(scene, right)};
}
function lxNew(level = lxs.level) {
  const g = lx?.g, L = lxLevel(level);
  lx = renew(lx, {g, mode: 'ready', tick: 0, seen: 0, level, ...L, time: LX.TIME, cur: [56, 48], fx: [], miss: 0, dead: 0, won: 0, stars: 0, hints: 0});
  lxInfo();
}
function lxClick(x, y) {
  if (lx.mode !== 'play') return;
  const d = lx.diffs.find(d => !d.found && x >= d.box[0] - 4 && x < d.box[2] + 4 && y >= d.box[1] - 4 && y < d.box[3] + 4);
  if (d) { d.found = true; lxs.found++; lxBeep(880, .08, 'triangle', 1320); lx.fx.push({k: 'ok', d, t: 30}); }
  else { lx.time = Math.max(0, lx.time - 300); lx.miss++; lx.fx.push({k: 'no', x, y, t: 30}); lxBeep(140, .15, 'sawtooth', 90, .04); }
  lxCheck();
}
function lxHint() { const d = lx.diffs.find(d => !d.found); if (!d || lx.mode !== 'play') return; d.found = true; lx.hints++; lx.time = Math.max(0, lx.time - 900); lx.fx.push({k: 'ok', d, t: 30}); lxBeep(520, .1, 'triangle'); lxCheck(); }
function lxCheck() {
  if (lx.diffs.every(d => d.found)) { lx.mode = 'over'; lx.won = 1; lx.dead = 0; lx.stars = lx.time >= 3600 ? 3 : lx.time >= 1800 ? 2 : 1; lxs.stars += lx.stars; lxs.games++; if (lx.level >= lxs.level) lxs.level = lx.level + 1; best('lynx', lx.level); saveGames(); lxInfo(); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => lxBeep(f, .14, 'triangle'), i * 110)); }
}
function lxUpdate() {
  if (--lx.time <= 0) { lx.time = 0; lx.mode = 'over'; lx.won = 0; lx.dead = 0; lxs.games++; saveGames(); lxInfo(); [392, 330, 262].forEach((f, i) => setTimeout(() => lxBeep(f, .16, 'triangle'), i * 130)); }
  for (const f of lx.fx) f.t--; lx.fx = lx.fx.filter(f => f.t > 0);
}
function lxRing(g, d, ox, oy, c) {  // un cercle en pixels autour d'une différence trouvée
  const cx = ox + (d.box[0] + d.box[2]) / 2, cy = oy + (d.box[1] + d.box[3]) / 2, rx = (d.box[2] - d.box[0]) / 2 + 4, ry = (d.box[3] - d.box[1]) / 2 + 4;
  for (let i = 0; i < 64; i++) { const a = i / 64 * Math.PI * 2, x = Math.round(cx + Math.cos(a) * rx), y = Math.round(cy + Math.sin(a) * ry); px(g, '#1a1408', x + 1, y + 1, 1, 1); px(g, c, x, y, 1, 1); }
}
function lxDraw() {
  const g = lx.g, {W, H, LX0, RX0, Y0, PW, PH} = LX;
  for (; lx.seen < lx.tick; lx.seen++) if (lx.mode === 'over') lx.dead++;
  g.imageSmoothingEnabled = false;
  px(g, '#2a2236', 0, 0, W, H);
  for (const ox of [LX0, RX0]) { px(g, '#0e0a14', ox - 2, Y0 - 2, PW + 4, PH + 4); px(g, '#e8d8b0', ox - 1, Y0 - 1, PW + 2, PH + 2); }
  g.drawImage(lx.left, LX0, Y0); g.drawImage(lx.right, RX0, Y0);
  for (const d of lx.diffs) if (d.found) for (const ox of [LX0, RX0]) lxRing(g, d, ox, Y0, '#ffd84a');
  for (const f of lx.fx) if (f.k === 'no') for (const ox of [LX0, RX0]) { const x = ox + f.x, y = Y0 + f.y; for (let i = -3; i <= 3; i++) { px(g, '#ff3a3a', x + i, y + i, 1, 1); px(g, '#ff3a3a', x + i, y - i, 1, 1); } }
  if (lx.mode === 'play' || lx.mode === 'ready') for (const ox of [LX0, RX0]) { const x = ox + lx.cur[0], y = Y0 + lx.cur[1]; px(g, '#ffffff', x - 5, y, 3, 1); px(g, '#ffffff', x + 3, y, 3, 1); px(g, '#ffffff', x, y - 5, 1, 3); px(g, '#ffffff', x, y + 3, 1, 3); }
  // le haut : niveau, différences trouvées, temps
  px(g, '#0e0a14', 0, 0, W, 15);
  pxFont(g, 'Niveau ' + lx.level, 4, 11, '#ffffff', 8);
  const found = lx.diffs.filter(d => d.found).length;
  lx.diffs.forEach((d, i) => { const x = 96 + i * 8; px(g, '#1a1408', x, 4, 6, 6); px(g, d.found ? '#ffd84a' : '#4a3e5a', x + 1, 5, 4, 4); });
  const sec = Math.ceil(lx.time / 60); pxFont(g, Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'), W - 4, 11, sec <= 15 ? '#ff4a3a' : '#ffd84a', 8, 'right');
  if (lx.mode === 'ready') gameText(g, W, [['LYNX · NIVEAU ' + lx.level, '#ffd84a', 12], [lx.diffs.length + ' différences à trouver', '#ffffff'], ['Clique sur l’une des deux images', '#b8d0ff'], ['H : un indice (−15 s)', '#b8b0c8'], ['Espace : commencer', '#b8b0c8']], 40);
  if (lx.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 56);
  if (lx.mode === 'over' && lx.dead > 30) gameText(g, W, lx.won ? [['BRAVO !', '#7ae05a', 12], ['★'.repeat(lx.stars) + '☆'.repeat(3 - lx.stars), '#ffd84a', 12], [lx.miss + (lx.miss > 1 ? ' erreurs, ' : ' erreur, ') + lx.hints + (lx.hints > 1 ? ' indices' : ' indice'), '#ffffff'], [lx.dead > 60 ? 'Espace : niveau suivant' : '', '#b8b0c8']]
    : [['TEMPS ÉCOULÉ', '#ff4a3a', 12], [found + ' sur ' + lx.diffs.length + ' trouvées', '#ffffff'], [lx.dead > 60 ? 'Espace : recommencer' : '', '#b8b0c8']], 44);
  if (lx.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Lynx, niveau ' + lx.level + ' : ' + found + ' différences sur ' + lx.diffs.length + ', ' + sec + ' secondes, viseur à ' + lx.cur[0] + ', ' + lx.cur[1] + (lx.mode === 'over' ? (lx.won ? ', niveau fini' : ', temps écoulé') : '') + '.');
}
function lxInfo() {
  $('lxStats').replaceChildren(...[['Niveau atteint', lxs.level], ['Étoiles', lxs.stars], ['Différences trouvées', lxs.found], ['Parties', lxs.games]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !lx || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (lx.mode === 'over') { if ((k === ' ' || k === 'Enter') && lx.dead > 60) { e.preventDefault(); lxNew(lx.won ? lx.level + 1 : lx.level); } return; }
  if (k === 'p' || k === 'P' || k === 'Escape') { if (lx.mode === 'play') lx.mode = 'pause'; else if (lx.mode === 'pause') lx.mode = 'play'; return; }
  const mv = {ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -4], ArrowDown: [0, 4]}[k];
  if (mv) { e.preventDefault(); lx.cur = [Math.max(0, Math.min(LX.PW - 1, lx.cur[0] + mv[0])), Math.max(0, Math.min(LX.PH - 1, lx.cur[1] + mv[1]))]; return; }
  if (k === 'h' || k === 'H') { lxHint(); return; }
  if (k === ' ' || k === 'Enter') { e.preventDefault(); if (lx.mode !== 'play') lx.mode = 'play'; else lxClick(...lx.cur); }
});
{ const cv = $('lxCanvas');  // à la souris : un clic sur l'une des deux images
  const at = e => { const r = cv.getBoundingClientRect(); return [Math.floor((e.clientX - r.left) / r.width * LX.W), Math.floor((e.clientY - r.top) / r.height * LX.H)]; };
  const local = (x, y) => { for (const ox of [LX.LX0, LX.RX0]) if (x >= ox && x < ox + LX.PW && y >= LX.Y0 && y < LX.Y0 + LX.PH) return [x - ox, y - LX.Y0]; return null; };
  cv.onpointermove = e => { if (!lx) return; const p = local(...at(e)); if (p) lx.cur = p; };
  cv.onpointerdown = e => { e.preventDefault(); if (!lx) return;
    if (lx.mode === 'over') { if (lx.dead > 60) lxNew(lx.won ? lx.level + 1 : lx.level); return; }
    if (lx.mode !== 'play') { lx.mode = 'play'; return; }
    const p = local(...at(e)); if (p) { lx.cur = p; lxClick(...p); } };
}
$('lxNew').onclick = () => { lxNew(lx?.level || lxs.level); $('lxNew').blur(); };
{  // vérification : sur 12 niveaux, il y a assez de différences, et chaque pixel qui change entre les deux images est dans une différence ;
   // un clic juste trouve, un clic faux coûte 5 secondes, trouver tout finit le niveau
  const bad = [], keep = lx, keepS = JSON.stringify(lxs), keepB = games.best.lynx;
  lxMute = true;
  for (let L = 1; L <= 12; L++) {
    const v = lxLevel(L), a = lxPixels(v.left), b = lxPixels(v.right), want = L < 4 ? 5 : L < 9 ? 6 : 7;
    if (v.diffs.length < want) bad.push('niveau ' + L + ' : ' + v.diffs.length + ' différences');
    let out = 0;
    for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) { const x = (i >> 2) % LX.PW, y = Math.floor((i >> 2) / LX.PW); if (!v.diffs.some(d => x >= d.box[0] && x < d.box[2] && y >= d.box[1] && y < d.box[3])) out++; }
    if (out) bad.push('niveau ' + L + ' : ' + out + ' pixels changés hors des différences');
  }
  lx = null; lxNew(1); lx.mode = 'play'; const d0 = lx.diffs[0];
  lxClick(d0.box[0], d0.box[1]); if (!d0.found) bad.push('clic juste pas compté');
  const t = lx.time, spot = [[0, 0], [111, 95], [0, 95], [111, 0], [56, 0]].find(([x, y]) => !lx.diffs.some(d => x >= d.box[0] - 4 && x < d.box[2] + 4 && y >= d.box[1] - 4 && y < d.box[3] + 4));
  if (spot) { lxClick(...spot); if (lx.time !== t - 300) bad.push('clic faux sans pénalité'); }
  for (const d of lx.diffs) if (!d.found) lxClick((d.box[0] + d.box[2]) >> 1, (d.box[1] + d.box[3]) >> 1);
  if (!lx.won) bad.push('niveau pas fini');
  console.assert(!bad.length, 'lynx', bad);
  Object.assign(lxs, JSON.parse(keepS)); if (keepB === undefined) delete games.best.lynx; else games.best.lynx = keepB;
  lx = keep; lxMute = false;
}
ctx.onOpen(() => {
  if (!lx || !lx.g) { lxNew(); lx.g = $('lxCanvas').getContext('2d'); }
  gameLoop(lx, 'lynx', lxUpdate, lxDraw); lxInfo();
});
}
