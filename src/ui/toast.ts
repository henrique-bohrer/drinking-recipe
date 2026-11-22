import { CheckCircle2, Info } from 'lucide';
import { el, icon } from '../utils/dom';

let container: HTMLElement | null = null;

function ensureContainer(): HTMLElement {
  if (container && document.body.contains(container)) return container;
  container = el('div', {
    className:
      'fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 items-center pointer-events-none px-4 w-full max-w-md',
    attrs: { 'aria-live': 'polite', role: 'status' },
  });
  document.body.appendChild(container);
  return container;
}

export function showToast(message: string, variant: 'success' | 'info' = 'success'): void {
  const root = ensureContainer();
  const toast = el('div', {
    className:
      'pointer-events-auto animate-fade-up flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium border border-[var(--border-strong)] bg-[var(--ink-primary)] text-[var(--bg-surface)] shadow-lg',
    children: [
      icon(variant === 'success' ? CheckCircle2 : Info, 'w-4 h-4 shrink-0 text-[var(--accent-amber)]'),
      el('span', { text: message }),
    ],
  });

  root.appendChild(toast);
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
    window.setTimeout(() => toast.remove(), 220);
  }, 2600);
}
