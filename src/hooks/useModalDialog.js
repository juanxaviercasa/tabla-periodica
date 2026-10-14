import { useEffect, useRef } from "react";

const openDialogs = [];
let previousOverflow = "";
const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModalDialog(isOpen, onClose) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const opener = document.activeElement;
    if (!openDialogs.length) previousOverflow = document.body.style.overflow;
    openDialogs.push(dialog);
    document.body.style.overflow = "hidden";
    const isTop = () => openDialogs.at(-1) === dialog;
    const controls = () => [...dialog.querySelectorAll(focusableSelector)].filter(node => node.getClientRects().length && !node.closest('[hidden], [inert]'));
    (dialog.querySelector('[data-dialog-initial-focus]') ?? controls()[0] ?? dialog).focus({ preventScroll: true });

    const handleKey = event => {
      if (!isTop()) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeRef.current();
      } else if (event.key === "Tab") {
        const items = controls();
        const index = items.indexOf(document.activeElement);
        if (!items.length || (event.shiftKey ? index <= 0 : index === items.length - 1 || index < 0)) {
          event.preventDefault();
          (event.shiftKey ? items.at(-1) : items[0])?.focus();
          if (!items.length) dialog.focus();
        }
      }
    };
    const handleFocus = event => {
      if (isTop() && !dialog.contains(event.target)) (controls()[0] ?? dialog).focus({ preventScroll: true });
    };
    document.addEventListener("keydown", handleKey, true);
    document.addEventListener("focusin", handleFocus);
    return () => {
      document.removeEventListener("keydown", handleKey, true);
      document.removeEventListener("focusin", handleFocus);
      const index = openDialogs.indexOf(dialog);
      if (index >= 0) openDialogs.splice(index, 1);
      if (!openDialogs.length) document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [isOpen]);
  return dialogRef;
}
