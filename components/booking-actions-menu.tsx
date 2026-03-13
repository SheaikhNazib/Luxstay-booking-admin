'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { EllipsisVertical, Eye, Trash2 } from 'lucide-react';
import { deleteBookingAction } from '@/app/actions';

interface BookingActionsMenuProps {
  bookingId: string;
}

export function BookingActionsMenu({ bookingId }: BookingActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function updatePosition() {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      const menuWidth = menuRef.current?.offsetWidth ?? 136;
      const menuHeight = menuRef.current?.offsetHeight ?? 100;

      if (!triggerRect) {
        return;
      }

      let top = triggerRect.bottom + 8;
      let left = triggerRect.right - menuWidth;

      if (left < 8) {
        left = 8;
      }

      if (top + menuHeight > window.innerHeight - 8) {
        top = Math.max(8, triggerRect.top - menuHeight - 8);
      }

      setPosition({ top, left });
    }

    updatePosition();

    const raf = requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const insideTrigger = rootRef.current?.contains(target);
      const insideMenu = menuRef.current?.contains(target);

      if (!insideTrigger && !insideMenu) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={open ? 'admin-action-menu admin-action-menu-open' : 'admin-action-menu'} ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="admin-action-trigger"
        ref={triggerRef}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <EllipsisVertical size={16} />
        <span className="sr-only">Open actions</span>
      </button>

      {open
        ? createPortal(
            <div className="admin-action-dropdown" ref={menuRef} role="menu" style={position}>
              <Link className="admin-action-item" href={`/bookings/${bookingId}`} role="menuitem">
                <Eye size={14} />
                <span>View</span>
              </Link>

              <form action={deleteBookingAction}>
                <input name="id" type="hidden" value={bookingId} />
                <button className="admin-action-item admin-action-danger" role="menuitem" type="submit">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </form>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
