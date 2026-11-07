import { mountScrollProgress } from './scroll-progress';
import { mountThemeToggle } from './theme';

const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
if (!toggle) throw new Error('Missing theme toggle');

const stopTheme = mountThemeToggle(toggle);
const stopScroll = mountScrollProgress();

window.addEventListener(
  'pagehide',
  () => {
    stopTheme();
    stopScroll();
  },
  { once: true },
);
