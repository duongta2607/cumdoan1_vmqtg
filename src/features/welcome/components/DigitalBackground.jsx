const PARTICLES = [
  { left: '12%', top: '18%', '--particle-delay': '0s' },
  { left: '86%', top: '24%', '--particle-delay': '1.2s' },
  { left: '18%', top: '47%', '--particle-delay': '2.1s' },
  { left: '79%', top: '53%', '--particle-delay': '0.7s' },
  { left: '56%', top: '41%', '--particle-delay': '1.7s' },
];

export default function DigitalBackground() {
  return (
    <div className="digital-background" aria-hidden="true">
      <div className="digital-circuit digital-circuit--left" />
      <div className="digital-circuit digital-circuit--right" />
      <div className="digital-particles">
        {PARTICLES.map((particle, index) => (
          <i key={index} style={particle} />
        ))}
      </div>
      <div className="digital-city">
        <div className="digital-city__glow" />
        <svg className="digital-city__svg" viewBox="0 0 390 250" preserveAspectRatio="none">
          <defs>
            <linearGradient id="city-fill-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0e83d5" />
              <stop offset="1" stopColor="#02163e" />
            </linearGradient>
            <linearGradient id="city-fill-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#087acb" />
              <stop offset="0.7" stopColor="#03245b" />
              <stop offset="1" stopColor="#010e2d" />
            </linearGradient>
            <linearGradient id="light-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#63e7ff" stopOpacity="0" />
              <stop offset="1" stopColor="#17cfff" stopOpacity="0.72" />
            </linearGradient>
            <pattern id="city-windows" width="13" height="15" patternUnits="userSpaceOnUse">
              <rect x="3" y="3" width="2" height="4" rx="0.5" fill="#5ce8ff" opacity="0.72" />
              <rect x="8" y="3" width="2" height="4" rx="0.5" fill="#2aaeff" opacity="0.46" />
            </pattern>
            <filter id="city-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <path id="back-buildings" d="M0 225V169H12V145H24V174H37V123H50V155H66V136H78V176H92V111H109V163H124V139H139V183H154V128H168V158H182V105H198V169H213V132H228V151H243V115H259V171H275V143H288V126H302V166H316V108H332V155H346V133H359V170H374V143H390V225Z" />
            <path id="front-buildings" d="M0 235V184H14V151H28V194H40V134H54V120H66V185H80V157H94V174H106V125H121V111H133V183H147V146H160V165H174V121H184V93H190V67H195V42H200V67H206V93H215V122H227V177H241V139H254V116H269V181H283V151H298V174H312V126H326V143H339V186H353V148H369V171H382V134H390V235Z" />
          </defs>

          <path d="M195 226L70 74M195 226L320 74M195 226L132 48M195 226L258 48" stroke="url(#light-beam)" strokeWidth="1" opacity="0.42" />
          <use href="#back-buildings" fill="url(#city-fill-back)" opacity="0.7" />
          <use href="#back-buildings" fill="url(#city-windows)" opacity="0.45" />
          <use href="#front-buildings" fill="url(#city-fill-front)" stroke="#19bfff" strokeWidth="0.8" filter="url(#city-glow-filter)" />
          <use href="#front-buildings" fill="url(#city-windows)" opacity="0.72" />
          <path d="M0 226H390" stroke="#67eaff" strokeWidth="1.2" opacity="0.9" />
        </svg>
        <div className="digital-city__horizon" />
      </div>
      <div className="digital-grid" />
    </div>
  );
}
