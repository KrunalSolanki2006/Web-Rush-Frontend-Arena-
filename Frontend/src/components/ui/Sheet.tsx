import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = 'hidden';
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = '';
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="backdrop:bg-ink/60 backdrop:backdrop-blur-xs fixed inset-0 m-0 p-0 max-w-none max-h-none w-full h-full bg-transparent flex justify-end items-end md:items-stretch z-50 overflow-hidden"
      aria-labelledby="sheet-title"
    >
      <div
        className="w-full md:max-w-xl lg:max-w-2xl bg-slip border-t md:border-t-0 md:border-l border-rule shadow-2xl flex flex-col max-h-[92vh] md:max-h-full h-auto md:h-full animate-in slide-in-from-bottom md:slide-in-from-right duration-200"
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-dashed border-rule bg-paper/80">
          <h2 id="sheet-title" className="font-display font-bold text-lg md:text-xl text-ink">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-sm hover:bg-paper-deep text-ink-soft hover:text-ink transition-colors"
            aria-label="Close receipt details"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </dialog>
  );
};
