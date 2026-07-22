import { useEffect, useRef } from "react";

/**
 * The dialog shell both admin modals share.
 *
 * They previously rendered a bare positioned div: no dialog role, no Escape,
 * no focus management. Tab walked straight out of the dialog into the page
 * behind it, and the page kept scrolling under the overlay. Everything a
 * dialog owes the keyboard lives here so neither caller has to repeat it.
 */
interface Props {
  open: boolean;
  onClose: () => void;
  /** Wired to aria-labelledby so screen readers announce the dialog. */
  labelledBy: string;
  children: React.ReactNode;
  /** Escape and backdrop clicks are suppressed while a write is in flight. */
  dismissable?: boolean;
  /** Panel sizing/padding — callers own their own layout. */
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
  dismissable = true,
  className = "w-full max-w-md p-6",
}: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Whatever had focus before we opened, so it can be handed back on close.
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    // Move focus into the dialog rather than leaving it on the trigger
    // behind the overlay.
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panelRef.current)?.focus();

    // Stop the page behind the overlay from scrolling with the wheel.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && dismissable) {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      // Cycle focus inside the panel instead of letting it escape.
      const items = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus?.();
    };
  }, [open, onClose, dismissable]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        // Only a press that both starts and ends on the backdrop closes —
        // a drag that began inside the panel shouldn't dismiss it.
        if (e.target === e.currentTarget && dismissable) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`card shadow-2xl outline-none ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
