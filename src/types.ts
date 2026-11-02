export type ViewMode = 'color-symbol' | 'color-only' | 'symbol-bw';

export type CraftType = 'ponto-cruz' | 'croche-conduzido' | 'tapecaria';

export interface ColorItem {
  id: number;
  rgb: [number, number, number];
  hex: string;
  symbol: string;
  count: number;
  isLight: boolean;
  textColor: string;
  dmcCode?: string;
  name?: string;
}

export interface ImageAdjustments {
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  saturation: number; // -100 to 100
}

export interface GridConfig {
  width: number;       // 30 to 160 squares
  height: number;      // auto computed based on aspect ratio
  colorCount: number;  // 2 to 32 colors
  viewMode: ViewMode;
  showGridLines: boolean;
  showSymbols: boolean;
  showRulers: boolean;
  craftType: CraftType;
}

export interface ProjectInfo {
  code: string;
  title: string;
  author: string;
  fabricCount: number; // e.g. 14 count (stitches per inch)
}

export interface ChartData {
  width: number;
  height: number;
  grid: number[][]; // index of color in palette for each cell [y][x]
  palette: ColorItem[];
  totalStitches: number;
}
