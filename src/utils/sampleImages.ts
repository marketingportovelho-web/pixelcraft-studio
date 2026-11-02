// Procedurally generated high-fidelity sample images for instant testing

export interface PresetDesign {
  id: string;
  name: string;
  category: string;
  recommendedColors: number;
  recommendedWidth: number;
  dataUrl: string;
}

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// 1. Rosa Vintage (Classic Floral Cross-Stitch)
const ROSE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff8f0" />
      <stop offset="100%" stop-color="#faeee0" />
    </radialGradient>
    <radialGradient id="roseCenter" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ff758c" />
      <stop offset="50%" stop-color="#e63946" />
      <stop offset="100%" stop-color="#9d0208" />
    </radialGradient>
    <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#588157" />
      <stop offset="100%" stop-color="#344e41" />
    </linearGradient>
    <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a3b18a" />
      <stop offset="100%" stop-color="#588157" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgGrad)" />
  <!-- Leaves -->
  <path d="M120 280 C80 320 60 260 110 210 C140 180 170 240 120 280 Z" fill="url(#leafGrad1)" />
  <path d="M280 270 C330 310 340 240 290 200 C250 170 230 230 280 270 Z" fill="url(#leafGrad2)" />
  <path d="M140 130 C100 80 160 60 200 110 C180 140 150 150 140 130 Z" fill="url(#leafGrad2)" />
  <!-- Stem -->
  <path d="M200 240 Q190 320 180 360" stroke="#344e41" stroke-width="12" fill="none" stroke-linecap="round" />
  <!-- Outer Petals -->
  <circle cx="200" cy="190" r="95" fill="#ba181b" />
  <path d="M130 190 C120 120 200 110 200 110 C200 110 280 120 270 190 C260 250 140 250 130 190 Z" fill="#e63946" />
  <!-- Inner Swirls -->
  <circle cx="200" cy="180" r="65" fill="url(#roseCenter)" />
  <path d="M165 170 C170 145 225 140 230 175 C235 200 175 210 165 170 Z" fill="#ff758c" />
  <path d="M185 175 C190 165 215 165 215 180 C215 195 185 195 185 175 Z" fill="#ffccd5" />
  <circle cx="200" cy="180" r="10" fill="#fff0f3" />
</svg>
`;

// 2. Gatinho Místico (Cute Stylized Cat)
const CAT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#f0f4f8" />
  <!-- Moon behind -->
  <circle cx="200" cy="190" r="140" fill="#fef08a" opacity="0.6" />
  <!-- Ears -->
  <polygon points="120,200 90,80 170,140" fill="#1e293b" />
  <polygon points="125,185 105,105 160,145" fill="#f472b6" />
  <polygon points="280,200 310,80 230,140" fill="#1e293b" />
  <polygon points="275,185 295,105 240,145" fill="#f472b6" />
  <!-- Head -->
  <ellipse cx="200" cy="220" rx="100" ry="85" fill="#1e293b" />
  <!-- Cheeks -->
  <circle cx="145" cy="245" r="16" fill="#fbcfe8" opacity="0.7" />
  <circle cx="255" cy="245" r="16" fill="#fbcfe8" opacity="0.7" />
  <!-- Eyes -->
  <ellipse cx="160" cy="210" rx="18" ry="24" fill="#38bdf8" />
  <ellipse cx="240" cy="210" rx="18" ry="24" fill="#38bdf8" />
  <circle cx="160" cy="210" r="10" fill="#0f172a" />
  <circle cx="240" cy="210" r="10" fill="#0f172a" />
  <circle cx="165" cy="204" r="5" fill="#ffffff" />
  <circle cx="245" cy="204" r="5" fill="#ffffff" />
  <!-- Nose and Mouth -->
  <polygon points="200,230 192,222 208,222" fill="#f472b6" />
  <path d="M192 232 Q200 240 200 242 Q200 240 208 232" stroke="#fbcfe8" stroke-width="3" fill="none" stroke-linecap="round" />
  <!-- Whiskers -->
  <line x1="120" y1="230" x2="60" y2="220" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
  <line x1="120" y1="240" x2="65" y2="245" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
  <line x1="280" y1="230" x2="340" y2="220" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
  <line x1="280" y1="240" x2="335" y2="245" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
  <!-- Star on forehead -->
  <polygon points="200,160 203,172 215,172 205,180 209,192 200,184 191,192 195,180 185,172 197,172" fill="#fbbf24" />
</svg>
`;

// 3. Monstera Tropical (Botanical leaf)
const MONSTERA_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#fffbeb" />
  <!-- Stylized Monstera Leaf -->
  <path d="M200 60 C260 60 330 110 320 230 C310 330 230 350 200 360 C170 350 90 330 80 230 C70 110 140 60 200 60 Z" fill="#2d6a4f" />
  <!-- Cutouts/Slits -->
  <path d="M200 60 L200 360" stroke="#d8f3dc" stroke-width="6" stroke-linecap="round" />
  <ellipse cx="140" cy="180" rx="14" ry="40" transform="rotate(-35 140 180)" fill="#fffbeb" />
  <ellipse cx="260" cy="180" rx="14" ry="40" transform="rotate(35 260 180)" fill="#fffbeb" />
  <ellipse cx="130" cy="260" rx="12" ry="32" transform="rotate(-40 130 260)" fill="#fffbeb" />
  <ellipse cx="270" cy="260" rx="12" ry="32" transform="rotate(40 270 260)" fill="#fffbeb" />
  <!-- Side cuts -->
  <path d="M78 180 Q130 200 120 220 Q70 210 78 180 Z" fill="#fffbeb" />
  <path d="M322 180 Q270 200 280 220 Q330 210 322 180 Z" fill="#fffbeb" />
</svg>
`;

// 4. Mandala Geométrica (Tapestry & Tile pattern)
const MANDALA_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#0f172a" />
  <circle cx="200" cy="200" r="160" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="8 6" />
  <circle cx="200" cy="200" r="130" fill="#1e293b" stroke="#06b6d4" stroke-width="4" />
  <polygon points="200,80 300,180 200,280 100,180" fill="#3b82f6" opacity="0.8" />
  <polygon points="200,100 280,200 200,300 120,200" fill="#ec4899" opacity="0.8" />
  <circle cx="200" cy="200" r="70" fill="#f43f5e" />
  <circle cx="200" cy="200" r="45" fill="#facc15" />
  <circle cx="200" cy="200" r="20" fill="#ffffff" />
  <!-- Four corner ornaments -->
  <circle cx="50" cy="50" r="30" fill="#f59e0b" opacity="0.6" />
  <circle cx="350" cy="50" r="30" fill="#f59e0b" opacity="0.6" />
  <circle cx="50" cy="350" r="30" fill="#f59e0b" opacity="0.6" />
  <circle cx="350" cy="350" r="30" fill="#f59e0b" opacity="0.6" />
</svg>
`;

export const PRESET_DESIGNS: PresetDesign[] = [
  {
    id: 'rose',
    name: 'Rosa Vintage',
    category: 'Floral Clássico',
    recommendedColors: 12,
    recommendedWidth: 90,
    dataUrl: svgToDataUrl(ROSE_SVG),
  },
  {
    id: 'cat',
    name: 'Gatinho Místico',
    category: 'Pixel Art Pet',
    recommendedColors: 10,
    recommendedWidth: 85,
    dataUrl: svgToDataUrl(CAT_SVG),
  },
  {
    id: 'monstera',
    name: 'Monstera Tropical',
    category: 'Botânica',
    recommendedColors: 8,
    recommendedWidth: 80,
    dataUrl: svgToDataUrl(MONSTERA_SVG),
  },
  {
    id: 'mandala',
    name: 'Mandala Étnica',
    category: 'Tapeçaria & Mosaico',
    recommendedColors: 12,
    recommendedWidth: 90,
    dataUrl: svgToDataUrl(MANDALA_SVG),
  },
];
