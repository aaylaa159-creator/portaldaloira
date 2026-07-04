'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface FieldTooltipProps {
  content: string;
  placement?: 'top' | 'bottom';
}

export function FieldTooltip({ content, placement = 'top' }: FieldTooltipProps) {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    function updatePosition() {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const gap = 8;

      setPosition({
        top: placement === 'top' ? rect.top - gap : rect.bottom + gap,
        left: rect.left + rect.width / 2,
      });
    }

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, placement]);

  const tooltip =
    open && typeof document !== 'undefined'
      ? createPortal(
          <span
            id={id}
            role="tooltip"
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
              zIndex: 9999,
            }}
            className="pointer-events-none w-64 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-left text-xs font-normal leading-relaxed text-white shadow-lg"
          >
            {content}
            <span
              aria-hidden
              className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
                placement === 'top'
                  ? 'top-full border-t-gray-900'
                  : 'bottom-full border-b-gray-900'
              }`}
            />
          </span>,
          document.body
        )
      : null;

  return (
    <>
      <span className="relative ml-1.5 inline-flex shrink-0 align-middle">
        <button
          ref={buttonRef}
          type="button"
          tabIndex={0}
          aria-label="Mais informações sobre este campo"
          aria-describedby={open ? id : undefined}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-[10px] font-bold leading-none text-gray-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
        >
          ?
        </button>
      </span>
      {tooltip}
    </>
  );
}
