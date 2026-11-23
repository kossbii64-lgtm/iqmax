import { MessageSquareQuote, Maximize2, X } from 'lucide-react';
import { useState } from 'react';
import { TESTIMONIALS } from '../config/storeConfig';
import type { TestimonialItem } from '../types/store';

export function TestimonialsSection() {
  const [activeLightbox, setActiveLightbox] = useState<TestimonialItem | null>(null);

  return (
    <section id="testimonials" className="scroll-mt-16 py-8 sm:py-12 bg-white rounded-3xl border border-slate-200/80 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-semibold tracking-wider uppercase text-[#164A91]">
          Customer Stories
        </p>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F1E36] tracking-tight [text-wrap:balance]">
          Apa Kata Mereka Tentang IQMAX+?
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Real feedback shared by Malaysian parents and families who incorporate YouEdu IQMAX+ into
          their daily learning and nutrition routines.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              data-testid={`testimonial-card-${item.id}`}
              className="rounded-3xl bg-[#F6F8FB] border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
            >
              <div>
                {/* Authentic Verified Story Visual */}
                <button
                  type="button"
                  onClick={() => setActiveLightbox(item)}
                  aria-label={`Enlarge testimonial image from ${item.customerName}`}
                  className="group relative w-full aspect-[9/10.1] bg-[#0B4AD4] border-b border-slate-200 overflow-hidden block cursor-zoom-in"
                >
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F1E36]/80 text-white text-[11px] font-medium backdrop-blur-xs">
                    <Maximize2 className="w-3 h-3 text-[#F5A623]" aria-hidden="true" />
                    <span>View Story</span>
                  </span>
                </button>

                {/* Story Summary & Customer Quote */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#164A91]">{item.customerName}</span>
                    <MessageSquareQuote className="w-4 h-4 text-[#F5A623]" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#0F1E36]">
                    {item.headline}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed italic">{item.quote}</p>
                </div>
              </div>

              <div className="px-6 pb-5 pt-3 border-t border-slate-200/80 space-y-1">
                <p className="font-mono text-[11px] font-semibold text-[#164A91]">
                  {item.packageUsed}
                </p>
                <p className="text-[11px] text-slate-500">{item.contextNote}</p>
              </div>
            </article>
          ))}
      </div>

      {/* Clean Image Lightbox */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs"
          onClick={() => setActiveLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Customer testimonial from ${activeLightbox.customerName}`}
        >
          <div
            className="relative max-w-2xl w-full rounded-2xl bg-white overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#164A91]">
                  {activeLightbox.segmentLabel}
                </p>
                <h3 className="font-display font-bold text-base text-[#0F1E36]">
                  {activeLightbox.customerName} — {activeLightbox.headline}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                aria-label="Close testimonial preview"
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-100 max-h-[75vh] overflow-auto flex justify-center">
              <img
                src={activeLightbox.imageSrc}
                alt={activeLightbox.imageAlt}
                className="max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
