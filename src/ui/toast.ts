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
      'pointer-events-auto animate-pop glass-panel flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium text-[var(--ink-primary)] shadow-xl',
    children: [
      icon(
        variant === 'success' ? CheckCircle2 : Info,
        `w-4 h-4 shrink-0 ${variant === 'success' ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-amber)]'}`
      ),
      el('span', { text: message }),
    ],
  });

  root.appendChild(toast);
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px) scale(0.96)';
    toast.style.transition = 'opacity 240ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1)';
    window.setTimeout(() => toast.remove(), 250);
  }, 2600);
}
