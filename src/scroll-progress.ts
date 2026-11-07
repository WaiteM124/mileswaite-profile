export function mountScrollProgress(): () => void {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.className = 'scroll-progress-track';

  const fill = document.createElement('div');
  fill.className = 'scroll-progress-fill';

  bar.append(track, fill);
  document.body.append(bar);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const update = () => {
    if (reduced.matches) {
      fill.style.height = '0';
      return;
    }
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const top = window.scrollY || document.documentElement.scrollTop;
    const progress = scrollable > 0 ? Math.min(Math.max(top / scrollable, 0), 1) : 0;
    fill.style.height = `${progress * 100}%`;
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  reduced.addEventListener('change', update);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', update);
    reduced.removeEventListener('change', update);
    bar.remove();
  };
}
