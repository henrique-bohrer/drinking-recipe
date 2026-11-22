import { createElement, type IconNode } from 'lucide';

/**
 * Creates a DOM element safely using textContent (never raw HTML interpolation)
 * to eliminate XSS vectors from external API payloads.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    text?: string;
    attrs?: Record<string, string>;
    children?: (Node | string | null | undefined | false)[];
    onClick?: (ev: MouseEvent) => void;
  }
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options?.className) node.className = options.className;
  if (options?.text !== undefined) node.textContent = options.text;
  if (options?.attrs) {
    for (const [key, val] of Object.entries(options.attrs)) {
      node.setAttribute(key, val);
    }
  }
  if (options?.onClick) {
    const handler = options.onClick;
    node.addEventListener('click', (ev) => handler(ev as MouseEvent));
  }
  if (options?.children) {
    for (const child of options.children) {
      if (!child) continue;
      if (typeof child === 'string') {
        node.appendChild(document.createTextNode(child));
      } else {
        node.appendChild(child);
      }
    }
  }
  return node;
}

/**
 * Renders a Lucide icon node into an SVGElement with consistent crisp stroke styling.
 */
export function icon(iconNode: IconNode, className = 'w-4 h-4'): SVGElement {
  const svg = createElement(iconNode);
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}

export function clearChildren(container: Element): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
