/**
 * Accessible controls for the Codrops Columns transition in the Zafis hero.
 * No autoplay, wheel interception, or dependencies beyond the vendored GSAP.
 */
const root = document.querySelector('.zafis-slides');
const controls = document.querySelector('.hero__choices');

if (root && controls) {
  const slides = [...root.querySelectorAll('.slide')];
  const buttons = [...controls.querySelectorAll('button[data-slide]')];
  let slideshow;

  const fallback = () => {
    controls.hidden = true;
    root.removeAttribute('tabindex');
    root.removeAttribute('aria-busy');
    root.removeAttribute('data-slider-ready');
    if (window.gsap) {
      window.gsap.killTweensOf([...slides, ...root.querySelectorAll('.slide__img, .slide__piece')]);
    }
    slides.forEach((slide, index) => {
      slide.classList.toggle('slide--current', index === 0);
      slide.style.removeProperty('opacity');
      slide.style.removeProperty('z-index');
      slide.setAttribute('aria-hidden', String(index !== 0));
      const inner = slide.querySelector('.slide__img');
      if (inner) {
        ['opacity', 'transform', 'filter'].forEach((property) => inner.style.removeProperty(property));
      }
    });
    root.querySelectorAll('.slide__piece').forEach((piece) => piece.remove());
  };

  const update = () => {
    const index = slideshow.current;
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.slide) === index));
    });
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== index));
    });
    root.setAttribute('aria-busy', String(slideshow.isAnimating));
    root.dataset.currentSlide = String(index);
  };

  const select = (index, direction) => {
    if (!slideshow || slideshow.isAnimating || index === slideshow.current) return false;
    if (!Number.isInteger(index) || index < 0 || index >= slides.length) return false;
    try {
      const accepted = slideshow.navigate(direction || (index > slideshow.current ? 1 : -1), index);
      if (accepted) update();
      return accepted;
    } catch (error) {
      fallback();
      return false;
    }
  };

  const step = (direction) => {
    if (!slideshow) return false;
    const index = (slideshow.current + direction + slides.length) % slides.length;
    return select(index, direction);
  };

  const keydown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    if (!root.contains(document.activeElement) && !controls.contains(document.activeElement)) return;
    event.preventDefault();
    const changed = step(event.key === 'ArrowRight' ? 1 : -1);
    if (changed && controls.contains(document.activeElement)) {
      buttons.find((button) => Number(button.dataset.slide) === slideshow.current)?.focus({ preventScroll: true });
    }
  };

  const init = async () => {
    try {
      if (!window.gsap || slides.length < 2 || !buttons.length) return fallback();
      const { Slideshow } = await import('./slideshow.js');
      slideshow = new Slideshow(root);
      root.id ||= 'hero-slides';
      root.setAttribute('role', 'group');
      root.setAttribute('aria-roledescription', 'karusel');
      root.setAttribute('tabindex', '0');
      root.setAttribute('aria-label', root.getAttribute('aria-label') || 'Zahrada v detailu');
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Vybrat fotografii zahrady');

      slides.forEach((slide, index) => {
        const label = slide.dataset.label || buttons.find((button) => Number(button.dataset.slide) === index)?.textContent.trim() || 'Fotografie';
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'snímek');
        slide.setAttribute('aria-label', `${label}, ${index + 1} z ${slides.length}`);
      });

      buttons.forEach((button) => {
        button.type = 'button';
        button.setAttribute('aria-controls', root.id);
        button.addEventListener('click', () => select(Number(button.dataset.slide)));
      });
      root.addEventListener('zafis:slideend', update);
      root.addEventListener('keydown', keydown);
      controls.addEventListener('keydown', keydown);

      let pointer = null;
      root.addEventListener('pointerdown', (event) => {
        if (!event.isPrimary || event.button !== 0) return;
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      }, { passive: true });
      root.addEventListener('pointerup', (event) => {
        if (!pointer || pointer.id !== event.pointerId) return;
        const dx = event.clientX - pointer.x;
        const dy = event.clientY - pointer.y;
        pointer = null;
        if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
      }, { passive: true });
      root.addEventListener('pointercancel', () => { pointer = null; }, { passive: true });
      root.addEventListener('pointerleave', () => { pointer = null; }, { passive: true });

      update();
      root.dataset.sliderReady = 'true';
      controls.hidden = false;
    } catch (error) {
      fallback();
    }
  };

  init();
}
