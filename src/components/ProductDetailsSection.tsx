import { AlertCircle, ArrowDown, Check, Clock, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { PRODUCT_USAGE_SPECS, STORE_CONFIG } from '../config/storeConfig';

const GALLERY_IMAGES = [
  {
    id: 'single',
    label: 'Box & Bottle (30 Tabs)',
    src: '/images/iqmax-single-hero.png',
    alt: 'YouEdu IQMAX+ Single Box and 30 chewable tablets bottle',
  },
  {
    id: 'value',
    label: 'Package 2 (2 + 1 FREE)',
    src: '/images/iqmax-pkg-2.png',
    alt: 'YouEdu IQMAX+ Package 2 containing two bottles plus one free bottle (three bottles total)',
  },
  {
    id: 'family',
    label: 'Package 3 (3 + 2 FREE)',
    src: '/images/iqmax-pkg-3.png',
    alt: 'YouEdu IQMAX+ Package 3 containing three bottles plus two free bottles (five bottles total)',
  },
];

interface ProductDetailsSectionProps {
  onSelectPackages: () => void;
}

export function ProductDetailsSection({ onSelectPackages }: ProductDetailsSectionProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentImage = GALLERY_IMAGES[activeImageIdx];

  return (
    <section id="product-details" className="scroll-mt-20 py-10 sm:py-14 bg-[#F6F8FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Authentic Product Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="aspect-[4/3] w-full flex items-center justify-center bg-white rounded-xl overflow-hidden">
                {!imageError ? (
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-500">
                    <p className="font-display font-bold text-lg text-[#164A91]">
                      YouEdu IQMAX+ Packaging
                    </p>
                    <p className="text-sm mt-1">30 Chewable Tablets · 400mg · Mixfruit</p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3">
                {GALLERY_IMAGES.map((img, idx) => {
                  const selected = idx === activeImageIdx;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        setImageError(false);
                        setActiveImageIdx(idx);
                      }}
                      className={`p-2 rounded-xl border text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164A91] ${
                        selected
                          ? 'border-[#164A91] bg-[#EBF2FC]/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full bg-white rounded-lg overflow-hidden mb-1.5">
                        <img
                          src={img.src}
                          alt={img.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs font-semibold text-[#0F1E36] truncate">{img.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Product Specification & Usage Sheet */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#164A91]">
                Product Information &amp; Directions
              </p>
              <h1 className="mt-2 font-display font-bold text-2xl sm:text-4xl text-[#0F1E36] tracking-tight">
                YouEdu {PRODUCT_USAGE_SPECS.productName}
              </h1>
              <p className="mt-2 text-base text-slate-600">
                {PRODUCT_USAGE_SPECS.format} · {PRODUCT_USAGE_SPECS.quantityPerBox}
              </p>
            </div>

            {/* Key Specifications Table */}
            <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
              <div className="p-5 flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#164A91] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0F1E36]">
                    Recommended Daily Intake
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 font-medium">
                    {PRODUCT_USAGE_SPECS.dosage} — {PRODUCT_USAGE_SPECS.timing}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{PRODUCT_USAGE_SPECS.method}.</p>
                </div>
              </div>

              <div className="p-5 flex items-start gap-4">
                <Users className="w-5 h-5 text-[#164A91] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0F1E36]">
                    Age &amp; Family Suitability
                  </h3>
                  <p className="mt-1 text-sm text-slate-700">{PRODUCT_USAGE_SPECS.suitability}.</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {PRODUCT_USAGE_SPECS.supervision}.
                  </p>
                </div>
              </div>

              <div className="p-5 flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[#164A91] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0F1E36]">
                    Box Contents &amp; Highlights
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F5A623] shrink-0" aria-hidden="true" />
                      <span>30 chewable tablets per bottle/box (400mg each)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F5A623] shrink-0" aria-hidden="true" />
                      <span>Combination of Prebiotics (Inulin &amp; FOS) and Probiotic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F5A623] shrink-0" aria-hidden="true" />
                      <span>Natural Mixfruit flavour with Isomalt &amp; Stevia</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Health Disclaimer */}
            <div className="rounded-xl bg-white p-4 border border-amber-200/80 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#D98B0F] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-[#0F1E36]">Nutritional Supplement Notice: </span>
                {STORE_CONFIG.disclaimer}
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onSelectPackages}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-base transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164A91]"
              >
                <span>Choose Your Package</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
