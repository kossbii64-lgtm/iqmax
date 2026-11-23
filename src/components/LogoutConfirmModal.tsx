import { LogOut, X } from 'lucide-react';
import { useEffect } from 'react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ isOpen, onCancel, onConfirm }: LogoutConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-xs"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close logout confirmation"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h2 id="logout-modal-title" className="font-display font-bold text-lg text-[#0F1E36]">
            Log Out of App Demo?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You will return to the IQMAX+ Login screen. Your local demo account, profile details,
            shopping cart, and DEMO orders stay saved in this browser.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-display font-semibold text-sm hover:bg-slate-50 cursor-pointer"
          >
            Stay Signed In
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-testid="confirm-logout-button"
            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-display font-bold text-sm cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
