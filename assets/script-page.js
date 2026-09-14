/* script-page.js — 문자 페이지 */
(function () {
  'use strict';
  // 변환기
  const inp = document.getElementById('conv-in'), out = document.getElementById('conv-out'), note = document.getElementById('conv-note');
  let lastSvg = '', lastText = '';
  function draw() {
    const v = inp.value.trim() || 'yunto';
    const chk = Sonilipi.check(v);
    lastText = chk.text;
    lastSvg = Sonilipi.svg(chk.text, { color: '#17233b', weight: 7 });
    out.innerHTML = lastSvg;
    const msgs = [];
    if (chk.adapted.length) msgs.push('윤토에 없는 글자를 바꿨습니다: ' + chk.adapted.join(', '));
    if (chk.invalid.length) msgs.push('음절 규칙에 맞지 않는 낱말: ' + chk.invalid.join(', ') + ' — 자음 뒤에는 모음이 오고, 받침은 n만 됩니다');
    note.textContent = msgs.join(' · ');
  }
  inp.addEventListener('input', draw); draw();
  function download(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  const fname = () => (lastText.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'yunto');
  document.getElementById('conv-png').addEventListener('click', () => {
    const s = lastSvg.replace('<svg ', '<svg height="280" width="' + (280 * (parseFloat(lastSvg.match(/viewBox="[^"]*?([\d.]+) 140"/)[1]) / 140)).toFixed(0) + '" ');
    Sonilipi.toPng(s, 2, blob => download(blob, fname() + '.png'));
  });
  document.getElementById('conv-svg').addEventListener('click', () => download(new Blob([lastSvg], { type: 'image/svg+xml' }), fname() + '.svg'));
  document.getElementById('conv-copy').addEventListener('click', () => navigator.clipboard.writeText(lastText));

  // 자음표
  const fams = [
    ['입술 가족', '∪ 아랫입술 모양', [['p', '파열'], ['m', '비음'], ['w', '흐름']]],
    ['혀끝 가족', '| 세운 혀끝', [['t', '파열'], ['n', '비음'], ['s', '마찰'], ['l', '흐름']]],
    ['혀뒤·목 가족', '< 뒤로 꺾인 혀', [['k', '파열'], ['h', '마찰'], ['y', '흐름']]],
  ];
  const cons = document.getElementById('chart-cons');
  cons.innerHTML = fams.map(f => '<div class="fam-row"><div><b>' + f[0] + '</b><br><span class="small muted">' + f[1] + '</span></div><div class="glyphs">' +
    f[2].map(g => '<div class="glyph">' + Sonilipi.svg(g[0]) + '<div class="rom">' + g[0] + '</div><div class="desc">' + g[1] + '</div></div>').join('') + '</div></div>').join('');
  const vows = [['a', '표시 없음<br>가장 열린 소리'], ['e', '왼쪽<br>앞 · 중간'], ['i', '왼쪽 + 위<br>앞 · 높음'], ['o', '오른쪽<br>뒤 · 중간'], ['u', '오른쪽 + 위<br>뒤 · 높음']];
  document.getElementById('chart-vow').innerHTML = vows.map(v => '<div class="glyph">' + Sonilipi.svg(v[0]) + '<div class="rom">' + v[0] + '</div><div class="desc">' + v[1] + '</div></div>').join('');
  const nums = ['p', 't', 'k', 'm', 'n', 's', 'h', 'l', 'w', 'y'];
  const names = { p: 'pan', t: 'tun', k: 'kin', m: 'mon', n: 'nen', s: 'sen', h: 'hon', l: 'lan', w: 'win', y: 'yun' };
  document.getElementById('chart-num').innerHTML = nums.map(c => '<div class="glyph">' + Sonilipi.svg(String(Sonilipi.DIGIT[c])) + '<div class="rom">' + Sonilipi.DIGIT[c] + '</div><div class="desc">' + c + ' · ' + names[c] + '</div></div>').join('');
})();
