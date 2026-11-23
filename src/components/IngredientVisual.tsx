import type { IngredientItem } from '../types/store';

interface IngredientVisualProps {
  iconKey: IngredientItem['iconKey'];
}

export function IngredientVisual({ iconKey }: IngredientVisualProps) {
  switch (iconKey) {
    case 'magnesium-threonate':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#EBF2FC" />
          <path
            d="M32 14L46 22V38L32 46L18 38V22L32 14Z"
            stroke="#164A91"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="30" r="5" fill="#F5A623" />
          <circle cx="32" cy="14" r="2.5" fill="#164A91" />
          <circle cx="46" cy="38" r="2.5" fill="#164A91" />
          <circle cx="18" cy="38" r="2.5" fill="#164A91" />
        </svg>
      );
    case 'l-theanine':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#FFF4E2" />
          <path
            d="M16 34C20 26 26 26 32 34C38 42 44 42 48 34"
            stroke="#164A91"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M20 24C24 19 29 19 32 24C35 29 40 29 44 24"
            stroke="#F5A623"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'centella':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#EBF2FC" />
          <path
            d="M32 48V28M32 28C22 28 17 20 22 15C27 11 32 18 32 28ZM32 28C42 28 47 20 42 15C37 11 32 18 32 28Z"
            stroke="#164A91"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="24" r="3" fill="#F5A623" />
        </svg>
      );
    case 'probiotic':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#EBF2FC" />
          <rect x="20" y="21" width="16" height="9" rx="4.5" transform="rotate(-25 20 21)" stroke="#164A91" strokeWidth="2.2" fill="#FFFFFF" />
          <rect x="28" y="34" width="17" height="9" rx="4.5" transform="rotate(15 28 34)" stroke="#F5A623" strokeWidth="2.2" fill="#FFFFFF" />
          <circle cx="43" cy="22" r="3.5" fill="#164A91" />
        </svg>
      );
    case 'inulin':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#FFF4E2" />
          <path
            d="M22 45C22 33 27 25 32 18C37 25 42 33 42 45"
            stroke="#164A91"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M26 39H38M28 32H36" stroke="#F5A623" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'fos':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#EBF2FC" />
          <circle cx="21" cy="34" r="5" stroke="#164A91" strokeWidth="2.2" fill="#FFFFFF" />
          <circle cx="32" cy="27" r="5" stroke="#F5A623" strokeWidth="2.2" fill="#FFFFFF" />
          <circle cx="43" cy="34" r="5" stroke="#164A91" strokeWidth="2.2" fill="#FFFFFF" />
          <path d="M25.5 31L27.8 29.5M36.2 29.5L38.5 31" stroke="#164A91" strokeWidth="2" />
        </svg>
      );
    case 'vitamins':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#FFF4E2" />
          <circle cx="26" cy="26" r="6" stroke="#164A91" strokeWidth="2.2" fill="#FFFFFF" />
          <circle cx="40" cy="28" r="5" stroke="#F5A623" strokeWidth="2.2" fill="#FFFFFF" />
          <circle cx="31" cy="40" r="5.5" stroke="#164A91" strokeWidth="2.2" fill="#FFFFFF" />
        </svg>
      );
    case 'berries':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#EBF2FC" />
          <circle cx="27" cy="36" r="7" fill="#164A91" />
          <circle cx="38" cy="35" r="6.5" fill="#F5A623" />
          <circle cx="32" cy="26" r="5.5" fill="#2563EB" />
          <path d="M29 20C32 17 36 17 38 20" stroke="#164A91" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'isomalt':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#EBF2FC" />
          <rect x="22" y="22" width="20" height="20" rx="5" stroke="#164A91" strokeWidth="2.2" fill="#FFFFFF" />
          <path d="M27 32H37" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'stevia':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#FFF4E2" />
          <path
            d="M21 41C21 26 30 20 43 20C43 33 36 42 21 41Z"
            stroke="#164A91"
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill="#FFFFFF"
          />
          <path d="M21 41L36 27" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
