import {
  Bookmark,
  Compass,
  Dices,
  Moon,
  Sparkles,
  Sun,
  Wine,
} from 'lucide';
import type { ActiveTab, AppState } from '../types/cocktail';
import { t } from '../i18n/translations';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';

export function renderHeader(state: AppState): HTMLElement {
  const { language, theme, activeTab, favorites } = state;
  const favCount = Object.keys(favorites).length;

  const navItems: { id: ActiveTab; label: string; iconNode: typeof Compass; badge?: number }[] = [
    { id: 'explore', label: t(language, 'navExplore'), iconNode: Compass },
    { id: 'roulette', label: t(language, 'navRoulette'), iconNode: Dices },
    { id: 'quiz', label: t(language, 'navQuiz'), iconNode: Sparkles },
    { id: 'favorites', label: t(language, 'navFavorites'), iconNode: Bookmark, badge: favCount },
  ];

  const header = el('header', {
    className:
      'sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/95 backdrop-blur-xs',
  });

  const inner = el('div', {
    className: 'max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4',
  });

  // Brand mark
  const brand = el('button', {
    className: 'flex items-center gap-2.5 text-left cursor-pointer group',
    attrs: { type: 'button' },
    onClick: () => store.setActiveTab('explore'),
    children: [
      el('span', {
        className:
          'w-9 h-9 rounded-xl bg-[var(--accent-primary)] text-[var(--ink-on-accent)] flex items-center justify-center shadow-xs group-hover:scale-[1.03] transition-transform',
        children: [icon(Wine, 'w-4 h-4')],
      }),
      el('div', {
        className: 'leading-none',
        children: [
          el('span', {
            className: 'font-editorial text-lg font-semibold text-[var(--ink-primary)] block',
            text: t(language, 'brandName'),
          }),
          el('span', {
            className: 'text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] font-semibold',
            text: t(language, 'brandTagline'),
          }),
        ],
      }),
    ],
  });

  // Desktop Navigation (centered)
  const desktopNav = el('nav', {
    className: 'hidden md:flex items-center gap-1 p-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]',
    attrs: { 'aria-label': 'Primary navigation' },
    children: navItems.map((item) => {
      const active = activeTab === item.id;
      return el('button', {
        className: `inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
          active
            ? 'bg-[var(--accent-primary)] text-[var(--ink-on-accent)]'
            : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-muted)]'
        }`,
        attrs: { type: 'button', 'aria-current': active ? 'page' : 'false' },
        onClick: () => store.setActiveTab(item.id),
        children: [
          icon(item.iconNode, 'w-4 h-4'),
          el('span', { text: item.label }),
          item.badge !== undefined &&
            item.badge > 0 &&
            el('span', {
              className: `ml-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                active
                  ? 'bg-white/20 text-[var(--ink-on-accent)]'
                  : 'bg-[var(--accent-warm-soft)] text-[var(--accent-warm)]'
              }`,
              text: String(item.badge),
            }),
        ],
      });
    }),
  });

  // Right Utilities: Language toggle + Paper/Speakeasy theme toggle
  const utilities = el('div', {
    className: 'flex items-center gap-2',
    children: [
      el('div', {
        className:
          'inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 text-xs font-mono',
        attrs: { role: 'group', 'aria-label': 'Language' },
        children: (['pt', 'en'] as const).map((lang) => {
          const active = language === lang;
          return el('button', {
            className: `px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
              active
                ? 'bg-[var(--ink-primary)] text-[var(--bg-surface)] font-semibold'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
            }`,
            attrs: { type: 'button', 'aria-pressed': String(active) },
            onClick: () => store.setLanguage(lang),
            text: lang.toUpperCase(),
          });
        }),
      }),
      el('button', {
        className:
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer',
        attrs: {
          type: 'button',
          'aria-label': theme === 'paper' ? t(language, 'themeSpeakeasy') : t(language, 'themePaper'),
        },
        onClick: () => store.toggleTheme(),
        children: [
          icon(theme === 'paper' ? Moon : Sun, 'w-3.5 h-3.5 text-[var(--accent-amber)]'),
          el('span', {
            className: 'hidden sm:inline',
            text: theme === 'paper' ? t(language, 'themeSpeakeasy') : t(language, 'themePaper'),
          }),
        ],
      }),
    ],
  });

  inner.append(brand, desktopNav, utilities);
  header.appendChild(inner);
  return header;
}

export function renderExploreHero(state: AppState): HTMLElement {
  const { language } = state;
  return el('section', {
    className: 'mb-7 sm:mb-9 pt-2',
    children: [
      el('div', {
        className: 'flex items-center gap-3 mb-2.5',
        children: [
          el('span', {
            className: 'h-px w-8 bg-[var(--accent-warm)]',
          }),
          el('span', {
            className: 'text-xs uppercase tracking-[0.2em] font-semibold text-[var(--accent-warm)]',
            text: t(language, 'heroEyebrow'),
          }),
        ],
      }),
      el('h1', {
        className:
          'text-3xl sm:text-5xl font-semibold text-[var(--ink-primary)] tracking-tight leading-[1.1] max-w-2xl',
        text: t(language, 'heroTitle'),
      }),
      el('p', {
        className: 'text-sm sm:text-base text-[var(--ink-secondary)] mt-3 max-w-2xl leading-relaxed',
        text: t(language, 'heroSubtitle'),
      }),
    ],
  });
}

export function renderMobileBottomNav(state: AppState): HTMLElement {
  const { language, activeTab, favorites } = state;
  const favCount = Object.keys(favorites).length;

  const navItems: { id: ActiveTab; label: string; iconNode: typeof Compass; badge?: number }[] = [
    { id: 'explore', label: t(language, 'navExplore'), iconNode: Compass },
    { id: 'roulette', label: t(language, 'navRoulette'), iconNode: Dices },
    { id: 'quiz', label: t(language, 'navQuiz'), iconNode: Sparkles },
    { id: 'favorites', label: t(language, 'navFavorites'), iconNode: Bookmark, badge: favCount },
  ];

  return el('nav', {
    className:
      'md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-xs pb-safe',
    attrs: { 'aria-label': 'Mobile navigation' },
    children: [
      el('div', {
        className: 'grid grid-cols-4 px-2 pt-1.5',
        children: navItems.map((item) => {
          const active = activeTab === item.id;
          return el('button', {
            className: `relative flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
              active ? 'text-[var(--accent-primary)]' : 'text-[var(--ink-muted)]'
            }`,
            attrs: { type: 'button', 'aria-current': active ? 'page' : 'false' },
            onClick: () => {
              store.setActiveTab(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            children: [
              el('span', {
                className: `relative px-3 py-1 rounded-full transition-colors ${
                  active ? 'bg-[var(--accent-primary-soft)]' : ''
                }`,
                children: [
                  icon(item.iconNode, 'w-5 h-5'),
                  item.badge !== undefined &&
                    item.badge > 0 &&
                    el('span', {
                      className:
                        'absolute -top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[var(--accent-warm)] text-[var(--ink-on-accent)] text-[10px] font-mono flex items-center justify-center',
                      text: String(item.badge),
                    }),
                ],
              }),
              el('span', { text: item.label }),
            ],
          });
        }),
      }),
    ],
  });
}

export function renderFooter(state: AppState): HTMLElement {
  return el('footer', {
    className:
      'mt-14 pt-6 pb-24 md:pb-10 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--ink-muted)]',
    children: [
      el('p', { text: t(state.language, 'footerNote') }),
    ],
  });
}
