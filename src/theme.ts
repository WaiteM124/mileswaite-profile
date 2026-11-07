export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'miles-theme';

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#141413' : '#f3f2ee');
}

export function mountThemeToggle(button: HTMLButtonElement): () => void {
  const render = () => {
    const theme = currentTheme();
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    button.textContent = theme === 'dark' ? 'L' : 'D';
    button.setAttribute('aria-label', `Switch to ${next} theme`);
  };

  const onClick = () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Storage can be blocked. The choice still applies for this view. */
    }
    render();
  };

  button.type = 'button';
  button.classList.add('theme-toggle');
  button.addEventListener('click', onClick);
  render();

  return () => button.removeEventListener('click', onClick);
}

export function createThemeToggle(): HTMLButtonElement {
  const button = document.createElement('button');
  mountThemeToggle(button);
  return button;
}
