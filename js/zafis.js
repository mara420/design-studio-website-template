/* Local interactions for the Zafis test site. No data leaves this page. */
(() => {
  'use strict';
  const form = document.getElementById('enquiry-form');
  const status = form.querySelector('.contact__status');
  const draft = document.getElementById('enquiry-draft');
  const text = document.getElementById('draft-text');
  const emailLink = document.getElementById('draft-mail');
  const copyButton = document.getElementById('copy-draft');
  let draftText = '';

  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      form.elements.topic.value = link.dataset.service;
      draft.hidden = true;
      status.textContent = '';
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const location = String(data.get('location') || '').trim();
    const topic = String(data.get('topic') || '');
    const message = String(data.get('message') || '').trim();
    if (!name || !location || !message) {
      status.textContent = 'Doplňte prosím jméno, lokalitu a stručný popis zahrady.';
      return;
    }
    draftText = `Dobrý den,\n\nmám zájem o službu: ${topic}.\nLokalita: ${location}\n\n${message}\n\n${name}\nE-mail: ${email}`;
    text.textContent = draftText;
    emailLink.href = `mailto:info@zafis.cz?subject=${encodeURIComponent(`Poptávka Zafis: ${topic} — ${location}`)}&body=${encodeURIComponent(draftText)}`;
    draft.hidden = false;
    copyButton.textContent = 'Zkopírovat text';
    status.textContent = 'Poptávka je připravená níže. Zpráva zatím nebyla odeslána.';
    draft.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  });

  form.addEventListener('input', () => {
    if (!draft.hidden) {
      draft.hidden = true;
      status.textContent = 'Údaje se změnily. Připravte poptávku znovu.';
    }
  });

  copyButton.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draftText);
      copyButton.textContent = 'Text zkopírován';
      status.textContent = 'Text je zkopírovaný. Vložte ho do e-mailu pro info@zafis.cz.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(text);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Text je označený. Zkopírujte jej klávesovou zkratkou nebo podržením výběru.';
    }
  });

  const dialog = document.querySelector('.photo-dialog');
  // Bring a horizontally arranged card into view when reached with a keyboard.
  const work = document.getElementById('work');
  work.addEventListener('focusin', event => {
    const button = event.target.closest('[data-photo]');
    if (!button || !button.matches(':focus-visible')) return;
    const card = button.closest('.case');
    if (matchMedia('(max-width: 699px)').matches) {
      work.querySelector('.work__window').scrollTo({ left: card.offsetLeft, behavior: 'instant' });
      return;
    }
    if (!document.documentElement.hasAttribute('data-8b-live')) return;
    const stage = work.querySelector('.work__stage');
    const run = parseFloat(getComputedStyle(work).getPropertyValue('--work-run')) || 0;
    const visibleWidth = work.clientWidth - 2 * parseFloat(getComputedStyle(stage).paddingLeft);
    const offset = Math.min(run, Math.max(0, card.offsetLeft - (visibleWidth - card.offsetWidth) / 2));
    const top = work.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'instant' });
  });
  const galleryWindow = work.querySelector('.work__window');
  const galleryCards = [...work.querySelectorAll('.case')];
  const galleryPrevious = work.querySelector('[data-gallery-prev]');
  const galleryNext = work.querySelector('[data-gallery-next]');
  const galleryCount = work.querySelector('.work__count');
  const currentCard = () => Math.max(0, Math.min(galleryCards.length - 1, Math.round(galleryWindow.scrollLeft / (galleryCards[0].offsetWidth + 16))));
  function updateGalleryControls() {
    const index = currentCard();
    galleryCount.textContent = `${index + 1} / ${galleryCards.length}`;
    galleryPrevious.disabled = index === 0;
    galleryNext.disabled = index === galleryCards.length - 1;
  }
  function moveGallery(direction) {
    const index = Math.max(0, Math.min(galleryCards.length - 1, currentCard() + direction));
    galleryWindow.scrollTo({ left: index * (galleryCards[0].offsetWidth + 16), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  galleryPrevious.addEventListener('click', () => moveGallery(-1));
  galleryNext.addEventListener('click', () => moveGallery(1));
  galleryWindow.addEventListener('scroll', updateGalleryControls, { passive: true });
  updateGalleryControls();
  document.querySelectorAll('[data-photo]').forEach(button => {
    button.addEventListener('click', () => {
      dialog.querySelector('img').src = button.dataset.photo;
      dialog.querySelector('img').alt = button.dataset.caption;
      dialog.querySelector('p').textContent = button.dataset.caption;
      dialog.showModal();
      window.motionKit?.wheel?.stop();
    });
  });
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => window.motionKit?.wheel?.start());
})();
