import { ColorItem, ImageAdjustments, ChartData } from '../types';

// Curated list of pure, universal, single-character ASCII symbols
// Guaranteed to be 100% compatible across all canvas and PDF engines without corruption
export const CHART_SYMBOLS = [
  'X', 'O', 'A', 'V', 'Z', 'U', 'H', 'T', 'M', 'N',
  'S', 'E', 'K', '+', '=', '*', '#', '@', '$', '&',
  '%', '?', '/', '1', '2', '3', '4', '5', '6', '7',
  '8', '9', 'B', 'C', 'D', 'F', 'G', 'P', 'R', 'W', 'Y'
];

export interface DmcColor {
  code: string;
  name: string;
  rgb: [number, number, number];
  lab?: [number, number, number];
}

// Authentic DMC embroidery floss database with 130+ distinct, well-distributed colors
// with accurate sRGB values and genuine Portuguese craft shade names.
export const DMC_DATABASE: DmcColor[] = [
  // --- Brancos & Cremes ---
  { code: 'B5200', name: 'Branco Neve Brilhante', rgb: [255, 255, 255] },
  { code: 'Blanc', name: 'Branco Puro', rgb: [250, 250, 250] },
  { code: 'Ecru', name: 'Cru Natural', rgb: [240, 234, 218] },
  { code: '3865', name: 'Branco Suave Inverno', rgb: [247, 246, 240] },
  { code: '712', name: 'Creme Marfim', rgb: [244, 236, 218] },
  { code: '739', name: 'Castanho Bege Muito Claro', rgb: [238, 224, 204] },
  { code: '738', name: 'Bege Areia Suave', rgb: [216, 196, 168] },
  { code: '437', name: 'Castanho Claro Dourado', rgb: [204, 168, 128] },

  // --- Tons de Pele, Nude & Pêssego (Essencial para Retratos) ---
  { code: '948', name: 'Pele Porcelana Pálida', rgb: [254, 235, 226] },
  { code: '754', name: 'Pele Pêssego Claro', rgb: [247, 203, 187] },
  { code: '3770', name: 'Pêssego Alabastro', rgb: [255, 238, 227] },
  { code: '3856', name: 'Pêssego Rosado Claro', rgb: [254, 214, 186] },
  { code: '3771', name: 'Terracota Nude Areia', rgb: [235, 172, 148] },
  { code: '353', name: 'Pêssego Rosado Suave', rgb: [254, 199, 183] },
  { code: '3778', name: 'Terracota Rosa Médio', rgb: [217, 133, 114] },
  { code: '356', name: 'Terracota Médio', rgb: [197, 107, 92] },
  { code: '3830', name: 'Terracota Queimado', rgb: [180, 83, 73] },
  { code: '402', name: 'Mogno Alaranjado Claro', rgb: [244, 162, 119] },
  { code: '3774', name: 'Nude Areia Deserto', rgb: [238, 218, 205] },

  // --- Rosas & Magentas ---
  { code: '963', name: 'Rosa Bebê Suave', rgb: [255, 215, 221] },
  { code: '3716', name: 'Rosa Algodão Doce', rgb: [255, 179, 193] },
  { code: '899', name: 'Rosa Médio Romântico', rgb: [242, 128, 161] },
  { code: '335', name: 'Rosa Carmim', rgb: [238, 84, 115] },
  { code: '309', name: 'Rosa Rubi Intenso', rgb: [214, 43, 78] },
  { code: '603', name: 'Rosa Chiclete', rgb: [242, 125, 172] },
  { code: '602', name: 'Rosa Magenta Médio', rgb: [224, 49, 127] },
  { code: '600', name: 'Rosa Magenta Escuro', rgb: [196, 21, 98] },
  { code: '3806', name: 'Rosa Ciclame Claro', rgb: [255, 140, 180] },
  { code: '3804', name: 'Rosa Ciclame Escuro', rgb: [224, 18, 97] },
  { code: '3803', name: 'Framboesa Vinho', rgb: [136, 44, 73] },

  // --- Vermelhos, Vinho & Rubi ---
  { code: '3801', name: 'Coral Melancia Claro', rgb: [231, 84, 128] },
  { code: '666', name: 'Vermelho Natal Brilhante', rgb: [227, 29, 35] },
  { code: '321', name: 'Vermelho Primário', rgb: [199, 0, 43] },
  { code: '304', name: 'Vermelho Médio Intenso', rgb: [183, 22, 42] },
  { code: '498', name: 'Vermelho Rubi Escuro', rgb: [142, 19, 34] },
  { code: '817', name: 'Coral Carmim Escuro', rgb: [173, 23, 27] },
  { code: '816', name: 'Vinho Granada Médio', rgb: [137, 20, 24] },
  { code: '815', name: 'Vinho Granada Escuro', rgb: [110, 16, 20] },
  { code: '814', name: 'Vinho Tinto Escuro', rgb: [95, 11, 23] },

  // --- Laranjas & Corais ---
  { code: '3824', name: 'Coral Damasco Claro', rgb: [254, 183, 160] },
  { code: '3341', name: 'Damasco Médio', rgb: [254, 144, 115] },
  { code: '3340', name: 'Damasco Alaranjado', rgb: [255, 108, 77] },
  { code: '722', name: 'Laranja Suave Melão', rgb: [247, 142, 105] },
  { code: '721', name: 'Laranja Médio', rgb: [238, 110, 67] },
  { code: '720', name: 'Laranja Escuro Especiaria', rgb: [214, 82, 37] },
  { code: '970', name: 'Laranja Abóbora Vivo', rgb: [245, 102, 0] },
  { code: '946', name: 'Laranja Fogo Queimado', rgb: [229, 78, 14] },
  { code: '606', name: 'Laranja Avermelhado Vivo', rgb: [248, 50, 17] },

  // --- Amarelos & Dourados ---
  { code: '745', name: 'Amarelo Banana Claro', rgb: [255, 235, 166] },
  { code: '744', name: 'Amarelo Pálido Suave', rgb: [255, 224, 130] },
  { code: '444', name: 'Amarelo Limão Brilhante', rgb: [255, 219, 0] },
  { code: '307', name: 'Amarelo Sol Puro', rgb: [255, 229, 0] },
  { code: '742', name: 'Amarelo Ouro Quente', rgb: [255, 191, 0] },
  { code: '741', name: 'Amarelo Ouro Médio', rgb: [255, 162, 0] },
  { code: '740', name: 'Laranja Tangerina Dourada', rgb: [255, 137, 0] },
  { code: '972', name: 'Amarelo Mostarda Intenso', rgb: [247, 181, 16] },
  { code: '3820', name: 'Amarelo Palha Dourado', rgb: [223, 176, 91] },
  { code: '3822', name: 'Dourado Palha Claro', rgb: [235, 198, 114] },
  { code: '834', name: 'Dourado Latão Médio', rgb: [197, 154, 71] },

  // --- Marrons, Castanhos & Beges ---
  { code: '842', name: 'Bege Argila Muito Claro', rgb: [214, 198, 180] },
  { code: '841', name: 'Bege Argila Médio', rgb: [187, 166, 144] },
  { code: '840', name: 'Castanho Argila Escuro', rgb: [154, 127, 101] },
  { code: '436', name: 'Castanho Caramelo Claro', rgb: [187, 138, 86] },
  { code: '435', name: 'Castanho Caramelo Médio', rgb: [168, 114, 60] },
  { code: '434', name: 'Castanho Tabaco', rgb: [140, 89, 44] },
  { code: '433', name: 'Castanho Chocolate Suave', rgb: [122, 62, 33] },
  { code: '801', name: 'Marrom Café Médio', rgb: [102, 57, 24] },
  { code: '898', name: 'Marrom Café Escuro', rgb: [77, 43, 20] },
  { code: '938', name: 'Marrom Espresso Intenso', rgb: [54, 30, 16] },
  { code: '3371', name: 'Marrom Ébano Quase Preto', rgb: [30, 18, 12] },
  { code: '300', name: 'Mogno Castanho Avermelhado', rgb: [111, 48, 18] },
  { code: '400', name: 'Mogno Cobre Médio', rgb: [142, 60, 21] },
  { code: '3826', name: 'Castanho Dourado Ambarino', rgb: [176, 114, 57] },

  // --- Verdes Oliva, Musgo & Floresta ---
  { code: '3348', name: 'Verde Oliva Claro Amarelado', rgb: [204, 219, 166] },
  { code: '3347', name: 'Verde Oliva Médio Claro', rgb: [143, 177, 108] },
  { code: '3346', name: 'Verde Caçador Médio', rgb: [87, 127, 65] },
  { code: '3345', name: 'Verde Caçador Escuro', rgb: [56, 92, 42] },
  { code: '581', name: 'Verde Musgo Dourado', rgb: [153, 140, 38] },
  { code: '580', name: 'Verde Musgo Dourado Escuro', rgb: [125, 113, 29] },
  { code: '734', name: 'Verde Oliva Palha', rgb: [197, 187, 105] },
  { code: '732', name: 'Verde Oliva Terroso', rgb: [127, 118, 48] },
  { code: '989', name: 'Verde Floresta Suave', rgb: [136, 173, 109] },
  { code: '988', name: 'Verde Floresta Médio', rgb: [105, 147, 83] },
  { code: '987', name: 'Verde Musgo Mata', rgb: [86, 130, 89] },
  { code: '986', name: 'Verde Musgo Floresta Escuro', rgb: [47, 79, 44] },
  { code: '895', name: 'Verde Caçador Muito Escuro', rgb: [32, 65, 33] },

  // --- Verdes Folha, Primavera & Esmeralda ---
  { code: '472', name: 'Verde Abacate Claro', rgb: [216, 228, 147] },
  { code: '470', name: 'Verde Abacate Médio', rgb: [160, 188, 86] },
  { code: '704', name: 'Verde Primavera Brilhante', rgb: [158, 206, 68] },
  { code: '702', name: 'Verde Kelly Puro', rgb: [46, 179, 79] },
  { code: '700', name: 'Verde Folha Intenso', rgb: [15, 138, 54] },
  { code: '699', name: 'Verde Natal Clássico', rgb: [5, 101, 38] },
  { code: '912', name: 'Verde Esmeralda Claro', rgb: [49, 177, 133] },
  { code: '910', name: 'Verde Esmeralda Médio', rgb: [27, 134, 98] },
  { code: '909', name: 'Verde Esmeralda Escuro', rgb: [18, 109, 79] },
  { code: '3812', name: 'Verde Mar Oceânico Médio', rgb: [40, 143, 138] },
  { code: '3813', name: 'Verde Menta Pálido', rgb: [178, 211, 194] },

  // --- Azuis Turquesa, Céu & Bebê ---
  { code: '3811', name: 'Azul Turquesa Muito Claro', rgb: [204, 235, 237] },
  { code: '3810', name: 'Azul Turquesa Médio', rgb: [80, 168, 174] },
  { code: '3846', name: 'Azul Turquesa Vivo Brilhante', rgb: [0, 198, 215] },
  { code: '3844', name: 'Azul Turquesa Intenso', rgb: [0, 143, 163] },
  { code: '3843', name: 'Azul Elétrico Piscina', rgb: [0, 138, 206] },
  { code: '996', name: 'Azul Céu Elétrico Médio', rgb: [48, 178, 230] },
  { code: '800', name: 'Azul Céu Pálido', rgb: [194, 217, 237] },
  { code: '827', name: 'Azul Bebê Suave', rgb: [188, 222, 238] },
  { code: '813', name: 'Azul Flor de Linho Médio', rgb: [142, 185, 213] },
  { code: '826', name: 'Azul Médio Clássico', rgb: [107, 148, 196] },

  // --- Azuis Royal, Marinho & Meia-Noite ---
  { code: '798', name: 'Azul Delft Escuro', rgb: [70, 108, 161] },
  { code: '797', name: 'Azul Royal Puro', rgb: [36, 84, 153] },
  { code: '796', name: 'Azul Royal Intenso', rgb: [17, 65, 136] },
  { code: '820', name: 'Azul Marinho Real', rgb: [12, 35, 75] },
  { code: '312', name: 'Azul Marinho Noturno', rgb: [33, 62, 105] },
  { code: '311', name: 'Azul Marinho Profundo', rgb: [16, 48, 86] },
  { code: '824', name: 'Azul Petróleo Médio', rgb: [65, 114, 144] },
  { code: '930', name: 'Azul Jeans Escuro', rgb: [66, 92, 114] },
  { code: '939', name: 'Azul Meia-Noite Profundo', rgb: [27, 40, 56] },

  // --- Roxos, Violetas & Lavandas ---
  { code: '3747', name: 'Lilás Névoa Claro', rgb: [215, 218, 237] },
  { code: '211', name: 'Lilás Lavanda Claro', rgb: [226, 199, 224] },
  { code: '209', name: 'Lilás Lavanda Médio', rgb: [186, 137, 184] },
  { code: '208', name: 'Lilás Lavanda Escuro', rgb: [142, 79, 158] },
  { code: '554', name: 'Violeta Suave Claro', rgb: [216, 173, 203] },
  { code: '553', name: 'Violeta Ametista Médio', rgb: [158, 97, 144] },
  { code: '552', name: 'Violeta Ametista Escuro', rgb: [123, 56, 108] },
  { code: '550', name: 'Roxo Violeta Profundo', rgb: [92, 24, 107] },
  { code: '3837', name: 'Roxo Uva Intenso', rgb: [118, 43, 110] },
  { code: '3834', name: 'Roxo Vinho Ameixa Escuro', rgb: [99, 39, 81] },

  // --- Cinzas & Neutros ---
  { code: '762', name: 'Cinza Pérola Muito Claro', rgb: [230, 230, 230] },
  { code: '415', name: 'Cinza Prata Claro', rgb: [208, 210, 213] },
  { code: '318', name: 'Cinza Aço Médio Claro', rgb: [173, 176, 180] },
  { code: '414', name: 'Cinza Chumbo Médio', rgb: [140, 140, 140] },
  { code: '317', name: 'Cinza Chumbo Escuro', rgb: [108, 110, 115] },
  { code: '3799', name: 'Cinza Grafite Carvão', rgb: [50, 50, 50] },
  { code: '648', name: 'Cinza Castor Claro', rgb: [189, 186, 178] },
  { code: '646', name: 'Cinza Castor Médio Escuro', rgb: [129, 124, 115] },
  { code: '310', name: 'Preto Intenso Absoluto', rgb: [10, 10, 10] },
];

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Relative luminance based on sRGB
export function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Convert sRGB (0..255) to CIELAB [L, a, b] for true human perceptual color difference
function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  let sR = r / 255;
  let sG = g / 255;
  let sB = b / 255;

  sR = sR > 0.04045 ? Math.pow((sR + 0.055) / 1.055, 2.4) : sR / 12.92;
  sG = sG > 0.04045 ? Math.pow((sG + 0.055) / 1.055, 2.4) : sG / 12.92;
  sB = sB > 0.04045 ? Math.pow((sB + 0.055) / 1.055, 2.4) : sB / 12.92;

  sR *= 100;
  sG *= 100;
  sB *= 100;

  // D65 standard illuminant
  const x = sR * 0.4124564 + sG * 0.3575761 + sB * 0.1804375;
  const y = sR * 0.2126729 + sG * 0.7151522 + sB * 0.0721750;
  const z = sR * 0.0193339 + sG * 0.1191920 + sB * 0.9503041;
  return [x, y, z];
}

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = rgbToXyz(r, g, b);

  // D65 reference white
  let xNorm = x / 95.047;
  let yNorm = y / 100.000;
  let zNorm = z / 108.883;

  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

  const fx = f(xNorm);
  const fy = f(yNorm);
  const fz = f(zNorm);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return [L, a, bVal];
}

// Precompute CIELAB for all database colors once
DMC_DATABASE.forEach((dmc) => {
  dmc.lab = rgbToLab(dmc.rgb[0], dmc.rgb[1], dmc.rgb[2]);
});

// CIE76 Delta-E perceptual color difference
export function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  const dL = lab1[0] - lab2[0];
  const da = lab1[1] - lab2[1];
  const db = lab1[2] - lab2[2];
  return Math.sqrt(dL * dL + da * da + db * db);
}

// Redmean distance for fast pixel-grid clustering
export function colorDistanceSq(c1: [number, number, number], c2: [number, number, number]): number {
  const rmean = (c1[0] + c2[0]) / 2;
  const r = c1[0] - c2[0];
  const g = c1[1] - c2[1];
  const b = c1[2] - c2[2];
  return (((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8);
}

// Finds a unique DMC color for each palette item in the palette
// Guarantees NO DUPLICATE DMC codes across the active palette
export function assignUniqueDmcFloss(
  paletteColors: [number, number, number][]
): { code: string; name: string }[] {
  const paletteLabs = paletteColors.map((c) => rgbToLab(c[0], c[1], c[2]));
  const assignedCodes = new Set<string>();
  const results: { code: string; name: string }[] = [];

  for (let i = 0; i < paletteColors.length; i++) {
    const pLab = paletteLabs[i];

    // Rank all DMC colors by perceptual Delta-E distance
    const rankedDmc = DMC_DATABASE.map((dmc) => ({
      dmc,
      dist: deltaE(pLab, dmc.lab || [0, 0, 0]),
    })).sort((a, b) => a.dist - b.dist);

    // Pick closest that has NOT been assigned yet
    let chosen = rankedDmc.find((item) => !assignedCodes.has(item.dmc.code));

    // Fallback if somehow all 130 were exhausted
    if (!chosen) {
      chosen = rankedDmc[0];
    }

    assignedCodes.add(chosen.dmc.code);
    results.push({
      code: `DMC ${chosen.dmc.code}`,
      name: chosen.dmc.name,
    });
  }

  return results;
}

// Applies Brightness, Contrast and Saturation to raw image pixel data
export function applyAdjustments(
  imageData: ImageData,
  adjustments: ImageAdjustments
): ImageData {
  const data = imageData.data;
  const brightness = adjustments.brightness; // -100 to 100
  const contrast = adjustments.contrast; // -100 to 100
  const saturation = adjustments.saturation; // -100 to 100

  // Contrast factor: [-100..100] -> factor
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  // Saturation factor: -100 -> 0 (grayscale), 0 -> 1 (normal), 100 -> 2 (hyper-saturated)
  const satFactor = (saturation + 100) / 100;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Brightness
    if (brightness !== 0) {
      r += brightness * 2.55;
      g += brightness * 2.55;
      b += brightness * 2.55;
    }

    // 2. Contrast
    if (contrast !== 0) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    // 3. Saturation
    if (saturation !== 0) {
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * satFactor;
      g = gray + (g - gray) * satFactor;
      b = gray + (b - gray) * satFactor;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  return imageData;
}

// Median Cut Color Quantization
interface ColorBox {
  pixels: [number, number, number][];
  rMin: number;
  rMax: number;
  gMin: number;
  gMax: number;
  bMin: number;
  bMax: number;
}

function makeBox(pixels: [number, number, number][]): ColorBox {
  let rMin = 255, rMax = 0;
  let gMin = 255, gMax = 0;
  let bMin = 255, bMax = 0;

  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i];
    if (p[0] < rMin) rMin = p[0];
    if (p[0] > rMax) rMax = p[0];
    if (p[1] < gMin) gMin = p[1];
    if (p[1] > gMax) gMax = p[1];
    if (p[2] < bMin) bMin = p[2];
    if (p[2] > bMax) bMax = p[2];
  }

  return { pixels, rMin, rMax, gMin, gMax, bMin, bMax };
}

function splitBox(box: ColorBox): [ColorBox, ColorBox] {
  const rRange = box.rMax - box.rMin;
  const gRange = box.gMax - box.gMin;
  const bRange = box.bMax - box.bMin;

  let axis = 0; // 0=R, 1=G, 2=B
  if (gRange >= rRange && gRange >= bRange) axis = 1;
  else if (bRange >= rRange && bRange >= gRange) axis = 2;

  // Sort along axis
  box.pixels.sort((a, b) => a[axis] - b[axis]);
  const mid = Math.floor(box.pixels.length / 2);

  const b1 = makeBox(box.pixels.slice(0, mid));
  const b2 = makeBox(box.pixels.slice(mid));
  return [b1, b2];
}

export function quantizeMedianCut(
  pixelList: [number, number, number][],
  kColors: number
): [number, number, number][] {
  if (pixelList.length === 0) {
    return [[255, 255, 255]];
  }

  const boxes: ColorBox[] = [makeBox(pixelList)];

  while (boxes.length < kColors) {
    let maxRange = -1;
    let splitIdx = -1;

    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (b.pixels.length <= 1) continue;
      const range = Math.max(b.rMax - b.rMin, b.gMax - b.gMin, b.bMax - b.bMin);
      if (range > maxRange) {
        maxRange = range;
        splitIdx = i;
      }
    }

    if (splitIdx === -1 || maxRange <= 0) break;

    const [b1, b2] = splitBox(boxes[splitIdx]);
    boxes.splice(splitIdx, 1, b1, b2);
  }

  // Calculate average color for each box
  const palette: [number, number, number][] = [];
  for (const box of boxes) {
    if (box.pixels.length === 0) continue;
    let sumR = 0, sumG = 0, sumB = 0;
    for (const p of box.pixels) {
      sumR += p[0];
      sumG += p[1];
      sumB += p[2];
    }
    const count = box.pixels.length;
    palette.push([
      Math.round(sumR / count),
      Math.round(sumG / count),
      Math.round(sumB / count),
    ]);
  }

  // Sort palette by luminance for clean visual order
  palette.sort((a, b) => getLuminance(a[0], a[1], a[2]) - getLuminance(b[0], b[1], b[2]));

  return palette;
}

// Converts downscaled image canvas to ChartData (grid of color indices + palette)
export function generateChartFromCanvas(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  colorCount: number,
  adjustments: ImageAdjustments
): ChartData {
  const offscreen = document.createElement('canvas');
  offscreen.width = targetWidth;
  offscreen.height = targetHeight;
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2D context');

  // Draw source onto offscreen scaled canvas
  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
  let imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);

  // Apply Brightness / Contrast / Saturation
  imgData = applyAdjustments(imgData, adjustments);
  ctx.putImageData(imgData, 0, 0);

  // Extract pixel samples
  const rawData = imgData.data;
  const pixelSamples: [number, number, number][] = [];
  const cellRgbList: [number, number, number][] = [];

  for (let i = 0; i < rawData.length; i += 4) {
    const r = rawData[i];
    const g = rawData[i + 1];
    const b = rawData[i + 2];
    const rgb: [number, number, number] = [r, g, b];
    cellRgbList.push(rgb);
    pixelSamples.push(rgb);
  }

  // Quantize palette to colorCount colors
  const rawPalette = quantizeMedianCut(pixelSamples, colorCount);

  // Map each grid cell to closest palette color
  const grid: number[][] = [];
  const counts = new Array(rawPalette.length).fill(0);

  let pIdx = 0;
  for (let y = 0; y < targetHeight; y++) {
    const row: number[] = [];
    for (let x = 0; x < targetWidth; x++) {
      const cellRgb = cellRgbList[pIdx++];
      let bestDist = Infinity;
      let bestPalIdx = 0;

      for (let c = 0; c < rawPalette.length; c++) {
        const d = colorDistanceSq(cellRgb, rawPalette[c]);
        if (d < bestDist) {
          bestDist = d;
          bestPalIdx = c;
        }
      }

      row.push(bestPalIdx);
      counts[bestPalIdx]++;
    }
    grid.push(row);
  }

  // Assign UNIQUE DMC Floss codes for every palette item
  const uniqueDmcs = assignUniqueDmcFloss(rawPalette);

  // Build ColorItem list with pure ASCII symbols
  const palette: ColorItem[] = rawPalette.map((rgb, idx) => {
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    const lum = getLuminance(rgb[0], rgb[1], rgb[2]);
    const isLight = lum >= 135;
    const symbol = CHART_SYMBOLS[idx % CHART_SYMBOLS.length];
    const dmc = uniqueDmcs[idx];

    return {
      id: idx,
      rgb,
      hex,
      symbol,
      count: counts[idx] || 0,
      isLight,
      textColor: isLight ? '#0f172a' : '#ffffff',
      dmcCode: dmc.code,
      name: dmc.name,
    };
  });

  return {
    width: targetWidth,
    height: targetHeight,
    grid,
    palette,
    totalStitches: targetWidth * targetHeight,
  };
}
