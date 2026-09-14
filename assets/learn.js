/* learn.js — 10분 코스 */
(function () {
  'use strict';
  const course = document.getElementById('course');
  if (!course) return;
  const steps = Array.from(course.querySelectorAll('.step'));
  const tabs = Array.from(course.querySelectorAll('.course-bar button'));
  const prev = document.getElementById('prev'), next = document.getElementById('next');
  let cur = 0;
  function show(i) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => s.classList.toggle('on', k === cur));
    tabs.forEach((t, k) => { t.setAttribute('aria-current', k === cur ? 'step' : 'false'); t.classList.toggle('done', k < cur); });
    prev.disabled = cur === 0;
    next.textContent = cur === steps.length - 1 ? '처음으로' : '다음';
    if (window.Sonilipi) Sonilipi.mount(course);
  }
  tabs.forEach((t, k) => t.addEventListener('click', () => show(k)));
  prev.addEventListener('click', () => show(cur - 1));
  next.addEventListener('click', () => show(cur === steps.length - 1 ? 0 : cur + 1));
  show(0);

  // 문장 만들기
  const bank = document.getElementById('bank'), answer = document.getElementById('answer'), result = document.getElementById('result');
  const target = ['ola!', 'tu', 'si', 'kalo', 'ka?'];
  const pool = ['si', 'kalo', 'ola!', 'mi', 'ka?', 'tu', 'makasi'];
  let picked = [];
  function renderBank() {
    bank.innerHTML = '';
    pool.forEach((w, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = w;
      b.disabled = picked.indexOf(i) >= 0;
      b.addEventListener('click', () => { picked.push(i); renderAll(); });
      bank.appendChild(b);
    });
  }
  function renderAnswer() {
    answer.innerHTML = '';
    if (!picked.length) { answer.innerHTML = '<span class="muted small">여기에 낱말이 놓입니다. 순서를 잘못 눌렀으면 낱말을 다시 눌러 빼세요.</span>'; return; }
    picked.forEach((idx, k) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = pool[idx];
      b.addEventListener('click', () => { picked.splice(k, 1); renderAll(); });
      answer.appendChild(b);
    });
    const s = document.createElement('span'); s.className = 'yn';
    s.innerHTML = Sonilipi.svg(picked.map(i => pool[i]).join(' '));
    answer.appendChild(s);
  }
  function renderAll() { renderBank(); renderAnswer(); result.textContent = ''; result.className = 'result'; }
  document.getElementById('check').addEventListener('click', () => {
    const got = picked.map(i => pool[i]).join(' ');
    if (got === target.join(' ')) { result.textContent = '맞습니다. “안녕! 너 잘 지내?” — 첫 문장을 만들었습니다.'; result.className = 'result ok'; }
    else if (!picked.length) { result.textContent = '낱말을 눌러 문장을 만들어 보세요.'; result.className = 'result no'; }
    else { result.textContent = '조금 다릅니다. 인사 → 너 → ~이다 → 좋다 → 물음표 순서입니다.'; result.className = 'result no'; }
  });
  document.getElementById('reset').addEventListener('click', () => { picked = []; renderAll(); });
  renderAll();

  // 복사·공유
  const sentence = 'ola! tu si kalo ka?';
  const copied = document.getElementById('copied');
  document.getElementById('copy').addEventListener('click', () => {
    navigator.clipboard.writeText(sentence + '  (윤토: 안녕! 너 잘 지내? — 답은 ya, mi si kalo. makasi.)').then(() => { copied.textContent = '복사했습니다. 메신저에 붙여 넣어 보내세요.'; });
  });
  document.getElementById('share').addEventListener('click', () => {
    if (navigator.share) navigator.share({ title: '윤토 첫 문장', text: sentence + ' — 안녕! 너 잘 지내? (윤토)', url: location.origin + '/learn.html' }).catch(() => {});
    else { copied.textContent = '이 브라우저는 공유 기능이 없습니다. 문장 복사를 눌러 직접 보내 주세요.'; }
  });
})();
