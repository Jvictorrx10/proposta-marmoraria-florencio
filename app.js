(() => {
  const D = window.FLORENCIO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&fm=webp&q=70`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Avisos ----------
  const toastEl = $('[data-toast]');
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 4200);
  }
  const wa = text => window.open(`https://wa.me/${D.whatsapp.numero}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  const pageUrl = () => location.href.split('#')[0];
  function swapImg(el, src) {
    if (el.getAttribute('src') === src) return;
    el.classList.add('swap');
    setTimeout(() => { el.src = src; }, reduced ? 0 : 180);
    el.onload = () => el.classList.remove('swap');
  }

  // ---------- Onde a pedra entra ----------
  const whereEl = $('[data-where]');
  const whereImg = $('[data-where-img]');
  let ativo = D.ambientes[0].id;
  whereEl.innerHTML = D.ambientes.map(a => `<li>
      <button type="button" data-amb="${a.id}" aria-expanded="false" aria-controls="amb-${a.id}">${a.nome}</button>
      <p id="amb-${a.id}" hidden>${a.texto}<br><a href="#orcamento" data-pick="${a.id}">Orçar ${a.nome.toLowerCase()}</a></p>
    </li>`).join('');
  function renderWhere() {
    D.ambientes.forEach(a => {
      const on = a.id === ativo;
      $(`[data-amb="${a.id}"]`).setAttribute('aria-expanded', String(on));
      $(`#amb-${a.id}`).hidden = !on;
      if (on) { swapImg(whereImg, img(a.foto, 1000, 1250)); whereImg.alt = `${a.nome} (imagem ilustrativa)`; }
    });
  }
  whereEl.addEventListener('click', e => {
    const b = e.target.closest('[data-amb]');
    if (b) { ativo = b.dataset.amb; renderWhere(); return; }
    const p = e.target.closest('[data-pick]');
    if (p) pick('onde', D.ambientes.find(a => a.id === p.dataset.pick).nome);
  });
  // No computador, passar o mouse também troca a foto.
  whereEl.addEventListener('mouseover', e => {
    const b = e.target.closest('[data-amb]');
    if (b && matchMedia('(hover: hover)').matches && b.dataset.amb !== ativo) { ativo = b.dataset.amb; renderWhere(); }
  });

  // ---------- Orçamento em 3 perguntas ----------
  const opcoes = {
    onde: D.ambientes.map(a => a.nome),
    medida: ['Tenho a medida', 'Não sei, quero medição'],
  };
  const escolha = { onde: [], medida: '', pedra: '' };
  $$('[data-q]').forEach(box => {
    const q = box.dataset.q;
    box.innerHTML = opcoes[q].map(o => `<button type="button" aria-pressed="false" data-opt="${o}">${o}</button>`).join('');
    box.addEventListener('click', e => { const b = e.target.closest('[data-opt]'); if (b) pick(q, b.dataset.opt, true); });
  });
  const pedrasEl = $('[data-pedras]');
  pedrasEl.innerHTML = D.pedras.map(p => `<button type="button" aria-pressed="false" data-pedra="${p.id}">
      <img src="${img(p.foto, 400, 300)}" width="400" height="300" alt="" loading="lazy"><span>${p.nome}</span></button>`).join('') +
    '<button type="button" class="help" aria-pressed="false" data-pedra="ajuda"><span>Me ajuda a escolher</span></button>';
  pedrasEl.addEventListener('click', e => {
    const b = e.target.closest('[data-pedra]'); if (!b) return;
    escolha.pedra = escolha.pedra === b.dataset.pedra ? '' : b.dataset.pedra;
    renderQuote();
  });

  function pick(q, o, toggleable) {
    if (Array.isArray(escolha[q])) {
      const has = escolha[q].includes(o);
      if (has && toggleable) escolha[q] = escolha[q].filter(x => x !== o);
      else if (!has) escolha[q].push(o);
    } else {
      escolha[q] = escolha[q] === o && toggleable ? '' : o;
    }
    renderQuote();
  }
  const pedraNome = () => escolha.pedra === 'ajuda' ? 'Quero ajuda para escolher' : (D.pedras.find(p => p.id === escolha.pedra) || {}).nome || '';
  function medidaTexto() {
    if (escolha.medida !== 'Tenho a medida') return escolha.medida;
    const t = $('[data-medida-text]').value.trim();
    return t ? `Tenho a medida: ${t}` : 'Tenho a medida';
  }
  function renderQuote() {
    $$('[data-q]').forEach(box => {
      const q = box.dataset.q;
      $$('button', box).forEach(b => b.setAttribute('aria-pressed',
        String(Array.isArray(escolha[q]) ? escolha[q].includes(b.dataset.opt) : escolha[q] === b.dataset.opt)));
    });
    $('[data-medida-field]').hidden = escolha.medida !== 'Tenho a medida';
    $$('[data-pedra]', pedrasEl).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pedra === escolha.pedra)));
    const p = D.pedras.find(x => x.id === escolha.pedra);
    const stoneImg = $('[data-stone-img]');
    if (p && stoneImg.dataset.pedra !== p.id) {
      stoneImg.dataset.pedra = p.id;
      swapImg(stoneImg, img(p.foto, 1000, 1250));
      stoneImg.alt = `${p.nome} (textura ilustrativa)`;
      document.dispatchEvent(new CustomEvent('florencio:pedra'));
    }
    const linhas = [['Onde', escolha.onde.join(', ')], ['Medida', medidaTexto()], ['Pedra', pedraNome()]];
    $('[data-slip]').innerHTML = linhas.map(([k, v]) => `<dt>${k}</dt><dd class="${v ? '' : 'empty'}">${v || 'a escolher'}</dd>`).join('');
  }
  $('[data-medida-text]').addEventListener('input', renderQuote);
  $('[data-send]').addEventListener('click', () => {
    if (!escolha.onde.length) { toast('Escolha onde vai a pedra.'); $('[data-q="onde"] button').focus(); return; }
    const linhas = [
      'Oi, Florencio! Quero um orçamento de pedra.',
      `Onde: ${escolha.onde.join(', ')}`,
      escolha.medida && `Medida: ${medidaTexto().toLowerCase()}`,
      pedraNome() && `Pedra: ${pedraNome().toLowerCase()}`,
      'Vocês têm disponível? Qual o próximo passo?',
      pageUrl(),
    ];
    wa(linhas.filter(Boolean).join('\n'));
  });
  $$('[data-ask-general]').forEach(b => b.addEventListener('click', () => wa(`Oi, Florencio! Vim pelo site e queria tirar uma dúvida.\n${pageUrl()}`)));

  // ---------- Como trabalhamos: arrastar e botões ----------
  const row = $('[data-how-row]');
  const bar = $('[data-how-bar]');
  const sync = () => {
    const max = row.scrollWidth - row.clientWidth;
    const vis = row.clientWidth / row.scrollWidth;
    bar.style.width = `${Math.min(100, (vis + (max > 0 ? row.scrollLeft / max : 1) * (1 - vis)) * 100)}%`;
  };
  row.addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync);
  $$('[data-how]').forEach(b => b.addEventListener('click', () => {
    const step = row.querySelector('li').offsetWidth + 32;
    row.scrollBy({ left: Number(b.dataset.how) * step, behavior: reduced ? 'auto' : 'smooth' });
  }));

  // ---------- Prova: um elogio aceso por vez ----------
  const lit = $$('[data-lit]');
  let k = 0;
  lit[0].classList.add('on');
  if (!reduced) setInterval(() => {
    if (document.hidden) return;
    lit[k].classList.remove('on'); k = (k + 1) % lit.length; lit[k].classList.add('on');
  }, 2000);

  // As entradas ao rolar ficam no motion.js (GSAP).

  renderWhere();
  renderQuote();
  sync();
})();
