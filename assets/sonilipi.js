/* sonilipi.js — YUNTO 고유문자 렌더러 (v1.0 규격)
 * 사용: Sonilipi.svg('mi apen yunto') → SVG 문자열
 *       Sonilipi.mount()  → [data-yn] 요소를 모두 그림
 * 좌표계: 셀 100×140, 기준선 y=100, 자음 상단 22, 모음 원 중심 (50,79) r19 */
(function (global) {
  'use strict';
  const BASE = 100;
  const FAM = { p: 'lip', m: 'lip', w: 'lip', t: 'tip', n: 'tip', s: 'tip', l: 'tip', k: 'back', h: 'back', y: 'back' };
  const MAN = { p: 'stop', t: 'stop', k: 'stop', m: 'nasal', n: 'nasal', s: 'fric', h: 'fric', w: 'flow', l: 'flow', y: 'flow' };
  const VOW = 'aeiou';
  const DIGIT = { p: 1, t: 2, k: 3, m: 4, n: 5, s: 6, h: 7, l: 8, w: 9, y: 0 };
  const DIGIT_CH = { '1': 'p', '2': 't', '3': 'k', '4': 'm', '5': 'n', '6': 's', '7': 'h', '8': 'l', '9': 'w', '0': 'y' };
  const INK = { p: [22, 78], m: [11, 89], w: [16, 89], t: [46, 54], n: [11, 89], s: [30, 70], l: [40, 86], k: [22, 78], h: [14, 88], y: [18, 89],
    a: [28, 72], e: [9, 72], i: [9, 72], o: [28, 91], u: [28, 91], '.': [20, 32], '\u00b7': [34, 46] };
  const GAP_IN = 12, GAP_SYL = 46, GAP_WORD = 86, CODA = 0.55;
  const ADAPT = { b: 'p', d: 't', g: 'k', r: 'l', f: 'p', v: 'w', z: 's', j: 'y', c: 'k', q: 'k', x: 'ks' };

  function glyph(ch, numeral) {
    const P = [], C = [], O = [];
    if (FAM[ch]) {
      const f = FAM[ch], m = MAN[ch];
      if (f === 'lip') {
        if (m === 'flow') { P.push('M20,22 L20,73 A21,27 0 0 0 62,73 L62,22'); P.push('M62,73 Q78,84 88,100'); }
        else P.push('M26,22 L26,74 A24,26 0 0 0 74,74 L74,22');
      } else if (f === 'tip') {
        if (m === 'fric') { P.push('M34,22 L34,100'); P.push('M66,22 L66,100'); }
        else if (m === 'flow') P.push('M44,22 L44,78 Q46,100 82,100');
        else P.push('M50,22 L50,100');
      } else {
        if (m === 'fric') { P.push('M50,26 L18,60 L50,96'); P.push('M84,26 L52,60 L84,96'); }
        else if (m === 'flow') P.push('M58,22 L22,58 L56,86 Q70,96 88,100');
        else P.push('M74,22 L26,61 L74,100');
      }
      if (m === 'nasal') P.push('M12,100 L88,100');
      if (numeral) P.push('M14,8 L86,8');
    } else if (VOW.indexOf(ch) >= 0) {
      O.push([50, 79, 19]);
      if (ch === 'e' || ch === 'i') P.push('M31,79 L12,79');
      if (ch === 'o' || ch === 'u') P.push('M69,79 L88,79');
      if (ch === 'i' || ch === 'u') P.push('M50,60 L50,43');
    } else if (ch === '.') C.push([26, 97, 6]);
    else if (ch === '\u00b7') C.push([40, 79, 6]);
    return { P: P, C: C, O: O };
  }

  function syllables(word) { return word.match(/[ptkmnshlwy]?[aeiou]n?/g) || []; }

  // 낱말을 음절 단위로 자른다. 규칙에 맞지 않는 글자(자음 홀로 등)는 낱글자로 둔다.
  function tokenize(word) {
    const out = []; let i = 0;
    const re = /^[ptkmnshlwy]?[aeiou]n?/;
    while (i < word.length) {
      const m = word.slice(i).match(re);
      if (m) {
        const syl = m[0];
        const coda = syl.length > 1 && syl.slice(-1) === 'n' && VOW.indexOf(syl.charAt(syl.length - 2)) >= 0;
        out.push({ body: coda ? syl.slice(0, -1) : syl, coda: coda });
        i += syl.length;
      } else {
        const ch = word.charAt(i);
        if (FAM[ch] || VOW.indexOf(ch) >= 0) out.push({ body: ch, coda: false });
        i += 1;
      }
    }
    return out;
  }

  function adapt(text) {
    const notes = [];
    let out = '';
    for (const ch of text) {
      const lo = ch.toLowerCase();
      if (ADAPT[lo]) { notes.push(ch + ' \u2192 ' + ADAPT[lo]); out += (ch === lo ? ADAPT[lo] : ADAPT[lo].charAt(0).toUpperCase() + ADAPT[lo].slice(1)); }
      else out += ch;
    }
    return { text: out, notes: Array.from(new Set(notes)) };
  }

  function check(text) {
    const a = adapt(text);
    const bad = [];
    a.text.split(/\s+/).filter(Boolean).forEach(tok => {
      const core = tok.replace(/^\u00b7/, '').replace(/[.,!?]+$/, '').toLowerCase();
      if (!core || /^\d+$/.test(core)) return;
      const re = /^([ptkmnshlwy]?[aeiou]n?)+$/;
      if (!re.test(core)) bad.push(core);
    });
    return { text: a.text, adapted: a.notes, invalid: bad };
  }

  function layout(text) {
    let pen = 0; const items = [];
    function put(ch, scale, dy, numeral) {
      const ink = (numeral && DIGIT[ch] !== undefined) ? [11, 89] : (INK[ch] || [10, 90]);
      const x = pen - ink[0] * scale;
      items.push({ ch: ch, x: x, scale: scale, dy: dy || 0, numeral: !!numeral });
      pen = x + ink[1] * scale + GAP_IN;
    }
    const words = String(text).split(/\s+/).filter(Boolean);
    words.forEach((token, wi) => {
      const m = token.match(/^(.*?)([.,!?]*)$/);
      let core = m[1], tail = m[2], name = false;
      if (core.charAt(0) === '\u00b7') { name = true; core = core.slice(1); }
      if (/^[A-Z]/.test(core)) name = true;
      core = core.toLowerCase();
      if (name) put('\u00b7', 1, 0);
      if (/^\d+$/.test(core)) {
        for (const d of core) put(DIGIT_CH[d], 1, 0, true);
      } else {
        const sy = tokenize(core);
        sy.forEach((t, si) => {
          for (const c of t.body) put(c, 1, 0);
          if (t.coda) put('n', CODA, BASE - BASE * CODA);
          if (si < sy.length - 1) pen += GAP_SYL - GAP_IN;
        });
      }
      for (const t of tail) {
        if (t === '.') put('.', 1, 0);
        else { items.push({ txt: t, x: pen }); pen += 36; }
      }
      if (wi < words.length - 1) pen += GAP_WORD - GAP_IN;
    });
    return { items: items, width: Math.max(pen - GAP_IN, 20) };
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  function svg(text, opts) {
    opts = opts || {};
    const color = opts.color || 'currentColor';
    const sw = opts.weight || 7;
    const lay = layout(text);
    const vbW = lay.width + 20;
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 ' + vbW.toFixed(1) + ' 140"' +
      (opts.height ? ' height="' + opts.height + '" width="' + (opts.height * vbW / 140).toFixed(1) + '"' : '') +
      ' role="img" aria-label="' + esc(text) + '" class="sl">';
    s += '<g fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">';
    lay.items.forEach(it => {
      if (it.txt) { s += '<text x="' + it.x.toFixed(1) + '" y="100" font-size="76" font-weight="700" font-family="inherit" fill="' + color + '" stroke="none">' + esc(it.txt) + '</text>'; return; }
      const g = glyph(it.ch, it.numeral);
      s += '<g transform="translate(' + it.x.toFixed(1) + ',' + it.dy.toFixed(1) + ') scale(' + it.scale + ')">';
      g.P.forEach(p => { s += '<path d="' + p + '"/>'; });
      g.O.forEach(c => { s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>'; });
      g.C.forEach(c => { s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + color + '" stroke="none"/>'; });
      s += '</g>';
    });
    s += '</g></svg>';
    return s;
  }

  function mount(root) {
    (root || document).querySelectorAll('[data-yn]').forEach(el => {
      if (el.dataset.done) return;
      const t = el.getAttribute('data-yn') || el.textContent;
      const a = adapt(t);
      el.innerHTML = svg(a.text, { weight: el.dataset.w ? +el.dataset.w : undefined });
      el.dataset.done = '1';
    });
  }

  function toPng(svgString, scale, cb) {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = function () {
      const w = img.width * scale, h = img.height * scale;
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob(cb, 'image/png');
    };
    img.src = url;
  }

  global.Sonilipi = { svg: svg, glyph: glyph, layout: layout, mount: mount, adapt: adapt, check: check, syllables: syllables, tokenize: tokenize, toPng: toPng, DIGIT: DIGIT, FAM: FAM, MAN: MAN };
  if (document.readyState !== 'loading') mount(); else document.addEventListener('DOMContentLoaded', function () { mount(); });
})(window);
