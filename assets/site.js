/* site.js — 공통 동작 */
(function () {
  'use strict';
  // 모바일 메뉴
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // 현재 페이지 표시
  // 주소는 확장자 없이 열린다(/learn). 옛 .html 주소로 들어와도 같은 메뉴가 표시되게 맞춘다.
  const page = v => (v || '').split('#')[0].split('?')[0].split('/').pop().replace(/\.html$/, '').replace(/^index$/, '');
  const here = page(location.pathname);
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (/^(https?:|mailto:|tel:)/.test(href)) return;
    if (page(href === './' ? '' : href) === here) a.setAttribute('aria-current', 'page');
  });
  // 홈 히어로 변환기
  const inp = document.getElementById('hero-in');
  const stage = document.getElementById('hero-stage');
  const note = document.getElementById('hero-note');
  if (inp && stage && window.Sonilipi) {
    const draw = function () {
      const v = inp.value.trim() || 'yunto';
      const chk = Sonilipi.check(v);
      stage.innerHTML = Sonilipi.svg(chk.text, { weight: 7 });
      const msgs = [];
      if (chk.adapted.length) msgs.push('윤토에 없는 글자를 바꿨습니다: ' + chk.adapted.join(', '));
      if (chk.invalid.length) msgs.push('음절 규칙(자음+모음, 받침은 n만)에 맞지 않는 낱말: ' + chk.invalid.join(', '));
      if (note) note.textContent = msgs.join(' · ');
    };
    inp.addEventListener('input', draw);
    draw();
  }
  // 발음 듣기 (브라우저 음성 합성, 있을 때만)
  window.ynSpeak = function (text) {
    if (!('speechSynthesis' in window)) return false;
    const u = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const pick = voices.find(v => /^(es|id|it)/i.test(v.lang)) || voices.find(v => /^ja/i.test(v.lang)) || null;
    if (pick) u.voice = pick;
    u.lang = pick ? pick.lang : 'es-ES';
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    return true;
  };
  document.addEventListener('click', function (e) {
    const b = e.target.closest('[data-say]');
    if (!b) return;
    if (!window.ynSpeak(b.getAttribute('data-say'))) { b.textContent = '이 브라우저는 음성을 지원하지 않습니다'; }
  });
  // 연도
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
