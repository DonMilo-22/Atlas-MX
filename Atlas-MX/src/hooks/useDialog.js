import { useEffect, useRef } from 'react';

// Pila global de diálogos abiertos: solo el último abierto responde a Escape.
const stack = [];

/**
 * Comportamiento accesible común para modales y drawers:
 * - Escape cierra únicamente el diálogo superior.
 * - Bloquea el scroll del documento mientras haya un diálogo abierto.
 * - Mueve el foco al diálogo al abrir y lo devuelve al elemento previo al cerrar.
 * - Mantiene el foco con Tab dentro del diálogo (focus trap).
 */
export default function useDialog(isOpen, onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const entry = {};
    stack.push(entry);
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      const node = ref.current;
      if (node && !node.contains(document.activeElement)) {
        const first = node.querySelector('[data-autofocus]') || node.querySelector(FOCUSABLE);
        (first || node).focus?.({ preventScroll: true });
      }
    }, 0);

    const handleKey = (event) => {
      if (stack[stack.length - 1] !== entry) return;
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeRef.current?.();
        return;
      }
      if (event.key === 'Tab' && ref.current) {
        const items = [...ref.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKey);
      const index = stack.indexOf(entry);
      if (index >= 0) stack.splice(index, 1);
      if (stack.length === 0) document.body.style.overflow = previousOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function' && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  return ref;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
