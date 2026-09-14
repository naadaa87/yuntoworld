/* dictionary.js — 사전 */
(function () {
  'use strict';
  const q = document.getElementById('q'), tabs = document.getElementById('tabs'), cats = document.getElementById('cats');
  const list = document.getElementById('entries'), count = document.getElementById('count');
  if (!list) return;
  let data = null, tab = 'roots', cat = '전체';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  fetch('data/lexicon.json').then(r => r.json()).then(d => { data = d; buildCats(); render(); })
    .catch(() => { list.innerHTML = '<div class="empty">사전 데이터(data/lexicon.json)를 불러오지 못했습니다. 파일 위치를 확인해 주세요.</div>'; });

  function buildCats() {
    const seen = [];
    data.roots.forEach(r => { if (seen.indexOf(r.cat) < 0) seen.push(r.cat); });
    cats.innerHTML = ['전체'].concat(seen).map(c => '<button type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c) + '</button>').join('');
    cats.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { cat = b.getAttribute('data-cat'); cats.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); render(); }));
  }
  tabs.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    tab = b.getAttribute('data-tab');
    tabs.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    cats.style.display = tab === 'roots' ? '' : 'none';
    render();
  }));
  q.addEventListener('input', render);

  function match(e, s) {
    if (!s) return true;
    return [e.f, e.ko, e.en, e.cls, e.note, e.hint, e.cat].some(v => v && String(v).toLowerCase().indexOf(s) >= 0);
  }
  function render() {
    if (!data) return;
    const s = q.value.trim().toLowerCase();
    let items = [], html = '';
    if (tab === 'roots') {
      items = data.roots.filter(e => (cat === '전체' || e.cat === cat) && match(e, s));
      html = items.map(e => '<div class="entry">' + Sonilipi.svg(e.f) + '<div class="rom">' + esc(e.f) + '</div><div class="ko">' + esc(e.ko) + '</div><div class="en">' + esc(e.en) + '</div>' +
        (e.hint ? '<div class="hint">출처 단서: ' + esc(e.hint) + '</div>' : '<div class="hint">신조어</div>') + '<div class="cat">' + esc(e.cat) + '</div></div>').join('');
    } else if (tab === 'particles') {
      items = data.particles.filter(e => match(e, s));
      html = items.map(e => '<div class="entry">' + Sonilipi.svg(e.f) + '<div class="rom">' + esc(e.f) + '</div><div class="ko">' + esc(e.ko) + '</div><div class="en">' + esc(e.en) + '</div>' +
        (e.note ? '<div class="hint">' + esc(e.note) + '</div>' : '') + '<div class="cat">' + esc(e.cls) + '</div></div>').join('');
    } else {
      items = data.numbers.filter(e => match(e, s) || String(e.v).indexOf(s) >= 0);
      html = items.map(e => '<div class="entry">' + Sonilipi.svg(e.f) + '<div class="rom">' + esc(e.f) + '</div><div class="ko">' + esc(e.v.toLocaleString()) + '</div><div class="hint">' + esc(e.note) + '</div></div>').join('');
    }
    count.textContent = items.length + '개' + (s ? ' — “' + s + '” 검색 결과' : '');
    list.innerHTML = html || '<div class="empty">찾는 낱말이 없습니다. 다른 말로 찾아보거나, 아래에서 새 낱말을 제안해 주세요.</div>';
  }
})();
