import * as focusing from './focusing';

export default function () {
  // Set up menu drawer
  // Give drawer the `dialog` role and hide it from view
  const menuDrawerEl = document.querySelector('.c-menu__drawer');
  menuDrawerEl.hidden = true;
  menuDrawerEl.setAttribute('role', 'dialog');

  // Set up menu button
  // Mark drawer as being closed
  const menuButtonEl = document.querySelector('.c-menu__button');
  menuButtonEl.setAttribute('aria-expanded', false);

  // Set up backdrop
  const backdropEl = document.createElement('div');
  document.body.appendChild(backdropEl);
  backdropEl.className = 'c-backdrop';
  backdropEl.setAttribute('tabindex', -1);

  // Focusing
  const focusRegion = menuDrawerEl;
  let previousFocusedElement;

  function handleKeypress(e) {
    focusing.bindKeypress(true, () => {
      handleRemoveFocus();
    }, focusRegion, e);
  }

  function handleMaintainFocus(e) {
    focusing.maintainFocus(true, focusRegion, e);
  }

  function handleSetFocus() {
    previousFocusedElement = focusing.safeActiveElement();
    focusing.setInitialFocus(focusRegion);
    document.addEventListener('keydown', handleKeypress);
    document.body.addEventListener('focus', handleMaintainFocus, true);
  }

  function handleRemoveFocus() {
    document.removeEventListener('keydown', handleKeypress);
    document.body.removeEventListener('focus', handleMaintainFocus, true);
    focusing.removeFocus(focusRegion);
    previousFocusedElement.focus();
  }

  function toggleMenu(state) {
    menuButtonEl.setAttribute('aria-expanded', state);
    menuDrawerEl.setAttribute('aria-hidden', !state);
    document.body.setAttribute('data-menu-expanded', state);

    if (state === 'true') {
      handleSetFocus();
      menuDrawerEl.hidden = false;
    } else {
      handleRemoveFocus();
      menuDrawerEl.hidden = true;
    }
  }

  if (menuButtonEl) {
    // Toggle drawer on clicking button
    menuButtonEl.addEventListener('click', e => {
      const state = menuButtonEl.getAttribute('aria-expanded') === 'false' ? 'true' : 'false';
      toggleMenu(state);
      e.preventDefault();
    });

    // Close menu if escape key is pressed
    window.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        toggleMenu(false);
        handleRemoveFocus();
      }
    });

    // Close menu if backdrop (area outside menu) is clicked
    backdropEl.addEventListener('click', e => {
      const state = menuButtonEl.getAttribute('aria-expanded') === 'false' ? 'true' : 'false';
      toggleMenu(state);
      e.preventDefault();
    });
  }
}
