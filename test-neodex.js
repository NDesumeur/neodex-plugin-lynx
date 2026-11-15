// lancé par le test « local » de NeoDex : commence, fait un clic faux au clavier, puis demande des indices jusqu'à la fin du niveau
// et vérifie que le niveau est fini ; les dix scènes (dont château, désert, ferme), le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('lxCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('lxCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'lynx-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500); await shot('0-depart');
  const chk = await pj(`document.getElementById('lxCanvas').dataset.check`); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  const th = await pj(`[8, 9, 10].map(n => document.getElementById('lxCanvas').__lx.scene(n)).join()`); if (th !== 'chateau,desert,ferme') throw new Error('nouvelles scènes : ' + th);
  for (const n of [8, 9, 10]) { await pj(`document.getElementById('lxCanvas').__go(${n}), 0`); await sleep(250); const d = await pj(`document.getElementById('lxCanvas').__lx.st().diffs.length`); if (d < 6) throw new Error('scène ' + n + ' : ' + d + ' différences'); await shot('scene-' + n); }
  await pj(`document.getElementById('lxCanvas').__go(1), document.getElementById('lxNew').click(), 0`); await sleep(200);
  if (process.env.NEO_SHOTS) { for (let n = 2; n <= 7; n++) { await pj(`document.getElementById('lxCanvas').__go(${n}), 0`); await sleep(250); await shot('decor-' + n); } await pj(`document.getElementById('lxCanvas').__go(1), document.getElementById('lxNew').click(), 0`); await sleep(200); }
  await key(' '); await sleep(300); await shot('1-images');
  for (let i = 0; i < 12; i++) await key('ArrowUp');
  for (let i = 0; i < 14; i++) await key('ArrowLeft');
  await key('Enter'); await sleep(300);  // tout en haut à gauche : en général rien à trouver là
  await key('h'); await key('h'); await sleep(400); await shot('2-indices');
  for (let i = 0; i < 6; i++) await key('h');
  await sleep(1500); await shot('3-fin');
  const l = await label();
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('gFs').click(), 0`); await sleep(800);
  const fs = await pj(`(() => { const c = document.getElementById('lxCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(400);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('lxCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('lxCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 150) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  if (!/niveau fini/.test(l)) throw new Error('le niveau devait être fini avec les indices : « ' + l + ' »');
  return l + " · château, désert, ferme · plein écran · " + L.h + " px dans " + L.ww + "×" + L.wh;
};
