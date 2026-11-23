import { X } from 'lucide-react';
import { useEffect } from 'react';
import { LEGAL_POLICIES } from '../config/storeConfig';
import type { PolicyKey } from '../types/store';

interface PolicyModalProps {
  policyKey: PolicyKey | null;
  onClose: () => void;
}

export function PolicyModal({ policyKey, onClose }: PolicyModalProps) {
  useEffect(() => {
    if (!policyKey) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [policyKey, onClose]);

  if (!policyKey) return null;
  const doc = LEGAL_POLICIES[policyKey];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#164A91]">
              YouEdu IQMAX+ Storefront Policy
            </p>
            <h3 id="policy-modal-title" className="font-display font-bold text-xl text-[#0F1E36]">
              {doc.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close policy modal"
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <p className="text-xs font-medium text-slate-500">{doc.updatedAt}</p>
          {doc.sections.map((section) => (
            <div key={section.heading} className="space-y-1.5">
              <h4 className="font-display font-bold text-sm text-[#0F1E36]">{section.heading}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-3.5 border-t border-slate-200 bg-[#F6F8FB] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
