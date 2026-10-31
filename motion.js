// Assinatura de movimento da Florencio. Abaixo dela, a base comum (_base/motion-base.js).
window.assinatura = ({ gsap, ScrollTrigger, mobile }) => {
  // Abertura: a bancada acende no escuro e o cartão cor de pedra sobe, com o nome se espalhando.
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('.hero-img', { filter: 'brightness(.15)', scale: 1.12 }, { filter: 'brightness(.62)', scale: 1, duration: 1.8, ease: 'power2.out' })
    .fromTo('.hero-card', { y: 80, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.out' }, '-=1.3')
    .from('.hero-name span', { letterSpacing: '0.4em', opacity: 0, duration: .9, stagger: .1 }, '-=.6')
    .from('.hero h1, .hero-facts, .hero-foot', { y: 24, opacity: 0, duration: .8, stagger: .12 }, '-=.6');

  // Rolando: o cartão encolhe e a bancada desce devagar por trás, como uma peça indo para a vitrine.
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 };
  gsap.to('.hero-card', { scale: mobile ? .97 : .9, yPercent: -10, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero-img', { yPercent: 14, ease: 'none', scrollTrigger: heroST });

  // Onde a pedra entra: a foto fixa sobe devagar enquanto a lista passa; os itens entram em sequência.
  gsap.from('.where-list li', { x: 40, opacity: 0, stagger: .08, duration: .8, scrollTrigger: { trigger: '.where-list ul', start: 'top 85%', once: true } });
  gsap.from('.where-photo img', { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: '.where', start: 'top 75%', once: true } });

  // Mostruário: as amostras viram como peças sobre a bancada; trocar a pedra a revela da esquerda para a direita.
  gsap.from('.swatches button', { y: 40, rotationX: -50, opacity: 0, transformOrigin: '50% 100%', stagger: .07, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: '.swatches', start: 'top 85%', once: true } });
  gsap.from('.stone', { clipPath: 'inset(0 0 0 100%)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: '.quote-grid', start: 'top 75%', once: true } });
  const onPedra = () => {
    gsap.fromTo('[data-stone-img]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .8, ease: 'power3.inOut', delay: .15 });
    gsap.fromTo('.slip', { y: 10 }, { y: 0, duration: .5, ease: 'back.out(2)' });
  };
  document.addEventListener('florencio:pedra', onPedra);

  // Explicado antes de cortar: a fileira desliza um pouco para o lado conforme a página desce.
  gsap.from('.how-row li', { y: 60, opacity: 0, stagger: .1, duration: .9, scrollTrigger: { trigger: '.how-row', start: 'top 85%', once: true } });
  if (!mobile) gsap.fromTo('.how-row', { x: 80 }, { x: 0, ease: 'none', scrollTrigger: { trigger: '.how', start: 'top bottom', end: 'bottom top', scrub: 1 } });

  // Visite: a foto se move devagar e o cartão entra da direita.
  gsap.fromTo('.visit-img', { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  gsap.from('.card', { x: mobile ? 0 : 120, y: mobile ? 60 : 0, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.visit', start: 'top 60%', once: true } });

  // Rodapé: o nome gigante sobe de baixo.
  gsap.from('.footer-word', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.footer', start: 'top 60%', once: true } });

  return () => document.removeEventListener('florencio:pedra', onPedra);
};

// Movimento padrão dos sites-demo (estilo TAL): GSAP + ScrollTrigger.
// Como usar: site/motion.js = `window.assinatura = ({ gsap, ScrollTrigger, mobile }) => { ... }` + este arquivo.
// A assinatura roda dentro do gsap.matchMedia (só com movimento permitido) e cuida da abertura (.intro) do site.
// No index.html, antes de app.js:
//   gsap.min.js e ScrollTrigger.min.js do cdnjs (versão 3.12.5), com defer
// e depois deles, motion.js também com defer (roda depois do app.js do fim do body).
// No <head>, um script que marca html.no-motion se o GSAP não carregar em 2,5s, e no CSS:
//   html.js:not(.no-motion) .reveal, html.js:not(.no-motion) .intro { opacity: 0; }
//   @media (prefers-reduced-motion: reduce) { html.js .reveal, html.js .intro { opacity: 1; } }
//   .backtype { position:absolute; font-size:22vw; white-space:nowrap; pointer-events:none; line-height:.8; }
// Marcações: .reveal (entra ao rolar), .intro (entra na abertura, pela assinatura), [data-parallax] (foto com
// parallax), [data-count] (número que conta), .backtype (palavra gigante).
(() => {
  if (!window.gsap || !window.ScrollTrigger) return; // sem GSAP o site fica como está
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion');
  const $$ = s => gsap.utils.toArray(s);

  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)', mobile: '(max-width: 860px)' }, ctx => {
    const { motion, mobile } = ctx.conditions;
    if (!motion) { gsap.set('.reveal, .intro', { opacity: 1, y: 0 }); return; }

    // Revelar ao rolar, em cascata
    gsap.set('.reveal', { opacity: 0, y: 26 });
    ScrollTrigger.batch('.reveal', {
      start: 'top 94%', once: true,
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .85, ease: 'power3.out', stagger: .08, overwrite: true }),
    });

    // Fotos com parallax
    $$('[data-parallax]').forEach(img => {
      gsap.fromTo(img, { scale: 1.08, yPercent: -4 }, {
        scale: 1, yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    // Números que contam até o valor (data-count="447", data-dec="1" para 4,9)
    $$('[data-count]').forEach(el => {
      const fim = parseFloat(el.dataset.count), dec = Number(el.dataset.dec || 0), o = { v: 0 };
      const fmt = v => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      gsap.to(o, { v: fim, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = fmt(o.v); }, onStart: () => { el.textContent = fmt(0); } });
    });

    // Palavras gigantes atravessando a seção
    $$('.backtype').forEach(el => {
      gsap.fromTo(el, { xPercent: mobile ? 5 : 10 }, {
        xPercent: mobile ? -45 : -30, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    // A assinatura pode devolver uma função de limpeza (ex.: remover ouvintes de eventos).
    if (typeof window.assinatura === 'function') return window.assinatura({ gsap, ScrollTrigger, mobile });
  });

  // Recalcula as posições quando fontes e fotos terminam de carregar
  const refresh = () => ScrollTrigger.refresh();
  document.fonts && document.fonts.ready.then(refresh);
  $$('img').forEach(i => { if (!i.complete) i.addEventListener('load', refresh, { once: true }); });
})();
