// lancé par le test « local » de NeoDex : commence, fait un clic faux au clavier, puis demande des indices jusqu'à la fin du niveau
// et vérifie que le niveau est fini (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('lxCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('lxCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'lynx-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500); await shot('0-depart');
  if (process.env.NEO_SHOTS) { for (let n = 2; n <= 7; n++) { await pj(`document.getElementById('lxCanvas').__go(${n}), 0`); await sleep(250); await shot('decor-' + n); } await pj(`document.getElementById('lxCanvas').__go(1), document.getElementById('lxNew').click(), 0`); await sleep(200); }
  await key(' '); await sleep(300); await shot('1-images');
  for (let i = 0; i < 12; i++) await key('ArrowUp');
  for (let i = 0; i < 14; i++) await key('ArrowLeft');
  await key('Enter'); await sleep(300);  // tout en haut à gauche : en général rien à trouver là
  await key('h'); await key('h'); await sleep(400); await shot('2-indices');
  for (let i = 0; i < 6; i++) await key('h');
  await sleep(1500); await shot('3-fin');
  const l = await label();
  if (!/niveau fini/.test(l)) throw new Error('le niveau devait être fini avec les indices : « ' + l + ' »');
  return l;
};
