interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Refined vector presentation preserving the original winged-ray youedu emblem,
 * lowercase `youedu` lettering, and `IQ MAX+` brand lockup.
 */
export function BrandLogo({ variant = 'dark', size = 'md' }: BrandLogoProps) {
  const isLightOnDark = variant === 'light';
  const mainInk = isLightOnDark ? '#FFFFFF' : '#164A91';
  const secondaryInk = isLightOnDark ? '#E2E8F0' : '#0F1E36';
  const orange = '#F5A623';

  const dimensions =
    size === 'sm'
      ? 'h-8'
      : size === 'lg'
        ? 'h-12'
        : 'h-10';

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${dimensions}`}>
      {/* Winged cradle mark adapted directly from official IQMAX+ packaging */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-full w-auto shrink-0"
        aria-hidden="true"
      >
        <rect
          width="48"
          height="48"
          rx="12"
          fill={isLightOnDark ? 'rgba(255,255,255,0.12)' : '#164A91'}
        />
        {/* Outer golden-orange curved L-cradle */}
        <path
          d="M12 29.5V33C12 34.3807 13.1193 35.5 14.5 35.5H31.5C34.2614 35.5 36.5 33.2614 36.5 30.5V14.5"
          stroke={orange}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner crisp white curve */}
        <path
          d="M29.5 12.5V27C29.5 28.3807 28.3807 29.5 27 29.5H16.5"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Three signature radiating rays */}
        <path d="M22 12L25 22" stroke={orange} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M15.5 16L21 23.5" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M11.5 22L19 26" stroke={orange} strokeWidth="2.6" strokeLinecap="round" />
      </svg>

      {/* Wordmark lockup: `youedu` + `IQ MAX+` */}
      <span className="flex flex-col leading-none text-left">
        <span className="flex items-baseline gap-0.5 text-[12px] sm:text-[13px] font-display font-bold tracking-tight">
          <span style={{ color: secondaryInk }}>you</span>
          <span style={{ color: orange }}>edu</span>
        </span>
        <span
          className="font-display font-extrabold tracking-tight text-base sm:text-lg leading-none mt-0.5"
          style={{ color: mainInk }}
        >
          IQ MAX
          <sup className="text-xs sm:text-sm font-extrabold ml-0.5" style={{ color: orange }}>
            +
          </sup>
        </span>
      </span>
    </span>
  );
}
