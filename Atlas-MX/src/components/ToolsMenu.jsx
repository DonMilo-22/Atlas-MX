import React, { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

/** Un único menú para todas las herramientas: mantiene la pantalla despejada. */
export default function ToolsMenu({ tools }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => { if (ref.current && !ref.current.contains(event.target)) setOpen(false); };
    const onKey = (event) => { if (event.key === 'Escape') { setOpen(false); ref.current?.querySelector('button')?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    const first = ref.current?.querySelector('[role="menuitem"]');
    first?.focus();
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const onMenuKey = (event) => {
    const items = [...ref.current.querySelectorAll('[role="menuitem"]')];
    const index = items.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') { event.preventDefault(); items[(index + 1) % items.length]?.focus(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); items[(index - 1 + items.length) % items.length]?.focus(); }
  };

  return (
    <div className="tools-menu" ref={ref}>
      <button type="button" className="tools-trigger" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}<span>Herramientas</span>
      </button>
      {open && (
        <div className="tools-popover" id={menuId} role="menu" aria-label="Herramientas" onKeyDown={onMenuKey}>
          {tools.map(({ id, label, hint, icon: Icon, onSelect }) => (
            <button key={id} type="button" role="menuitem" onClick={() => { setOpen(false); onSelect(); }}>
              <Icon size={17} aria-hidden="true" />
              <span><strong>{label}</strong><small>{hint}</small></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
