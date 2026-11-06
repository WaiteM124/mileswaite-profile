import './style.css';
import { profile, type ContactLink, type WorkItem } from './content';
import { mountHero } from './hero';

const app = document.querySelector('#app');
if (!app) throw new Error('Missing #app');

app.append(renderPage());

const visual = app.querySelector<HTMLElement>('[data-hero]');
if (!visual) throw new Error('Missing hero');

const cleanup = mountHero(visual);
window.addEventListener('pagehide', () => cleanup(), { once: true });

function renderPage(): HTMLElement {
  const header = element('header', 'site-header', [
    element('p', 'brand', [], profile.name),
    element(
      'nav',
      'site-nav',
      [textLink('#work', 'Work'), textLink('#contact', 'Contact')],
      undefined,
      { 'aria-label': 'On this page' },
    ),
  ]);

  const hero = element(
    'section',
    'hero',
    [
      element('div', 'hero-visual', [], undefined, { 'data-hero': '', 'aria-hidden': 'true' }),
      element('h1', undefined, [], profile.name, { id: 'hero-name' }),
      element('p', 'role', [], profile.role),
      element('p', 'intro', [], profile.introduction),
      textLink('#work', 'View selected work', 'cta'),
    ],
    undefined,
    { 'aria-labelledby': 'hero-name' },
  );

  const work = element(
    'section',
    'section',
    [
      element('h2', undefined, [], profile.workHeading, { id: 'work-heading' }),
      element('div', 'work-list', profile.work.map(renderWork)),
    ],
    undefined,
    { id: 'work', 'aria-labelledby': 'work-heading' },
  );

  const contact = element(
    'section',
    'section',
    [
      element('h2', undefined, [], profile.contactHeading, { id: 'contact-heading' }),
      element('ul', 'contact-list', profile.contact.map(renderContact)),
    ],
    undefined,
    { id: 'contact', 'aria-labelledby': 'contact-heading' },
  );

  return element('div', 'shell', [header, element('main', undefined, [hero, work, contact])]);
}

function renderWork(item: WorkItem): HTMLElement {
  const children: Node[] = [];
  if (item.kicker) children.push(element('p', 'kicker', [], item.kicker));
  children.push(element('h3', undefined, [], item.title));
  children.push(element('p', 'summary', [], item.summary));
  if (item.link) children.push(textLink(item.link.href, item.link.label));
  return element('article', 'work-item', children);
}

function renderContact(item: ContactLink): HTMLElement {
  return element('li', undefined, [textLink(item.href, item.text)]);
}

function textLink(href: string, text: string, className = ''): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  link.className = className ? `link ${className}` : 'link';
  link.textContent = text;

  if (/^https?:/i.test(href)) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const hint = document.createElement('span');
    hint.className = 'sr-only';
    hint.textContent = ' (opens in a new tab)';
    link.append(hint);
  }

  return link;
}

function element(
  tag: string,
  className: string | undefined,
  children: Node[],
  text?: string,
  attrs?: Record<string, string>,
): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  }
  if (children.length > 0) node.append(...children);
  return node;
}
