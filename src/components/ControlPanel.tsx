import React, { useState } from 'react';
import {
  ImageAdjustments,
  GridConfig,
  ColorItem,
  ProjectInfo,
  ViewMode,
  CraftType,
} from '../types';
import { PRESET_DESIGNS, PresetDesign } from '../utils/sampleImages';
import {
  Sliders,
  Palette,
  FileDown,
  Image as ImageIcon,
  Crop,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Info,
} from 'lucide-react';

export type ActiveTab = 'image' | 'grid' | 'palette' | 'export';

interface ControlPanelProps {
  gridConfig: GridConfig;
  onUpdateGridConfig: (updated: Partial<GridConfig>) => void;
  adjustments: ImageAdjustments;
  onUpdateAdjustments: (updated: Partial<ImageAdjustments>) => void;
  onResetAdjustments: () => void;
  palette: ColorItem[];
  totalStitches: number;
  projectInfo: ProjectInfo;
  onUpdateProjectInfo: (updated: Partial<ProjectInfo>) => void;
  onSelectPreset: (preset: PresetDesign) => void;
  onOpenCrop: () => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (colorId: number, newHex: string) => void;
  selectedColorId: number | null;
  onSelectColor: (colorId: number | null) => void;
  onDownloadPNG: () => void;
  onDownloadPDF: () => void;
  isProcessing: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  gridConfig,
  onUpdateGridConfig,
  adjustments,
  onUpdateAdjustments,
  onResetAdjustments,
  palette,
  totalStitches,
  projectInfo,
  onUpdateProjectInfo,
  onSelectPreset,
  onOpenCrop,
  onFileInputChange,
  onColorChange,
  selectedColorId,
  onSelectColor,
  onDownloadPNG,
  onDownloadPDF,
  isProcessing,
  activeTab,
  setActiveTab,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Fabric calculation
  const fabricCount = projectInfo.fabricCount || 14;
  const cmWidth = ((gridConfig.width / fabricCount) * 2.54).toFixed(1);
  const cmHeight = ((gridConfig.height / fabricCount) * 2.54).toFixed(1);

  const handleTabClick = (tab: ActiveTab) => {
    if (activeTab === tab) {
      setIsOpen(!isOpen);
    } else {
      setActiveTab(tab);
      setIsOpen(true);
    }
  };

  return (
    <div className="shrink-0 w-full bg-slate-900 border-t border-slate-800 shadow-2xl flex flex-col z-30">
      {/* Sliding Bottom Sheet Drawer Content */}
      {isOpen && (
        <div className="w-full flex flex-col max-h-[46vh] sm:max-h-[380px] bg-slate-900/98 backdrop-blur-md border-b border-slate-800/80 animate-in slide-in-from-bottom-3 duration-200">
          {/* Sheet Header with drag handle affordance & title */}
          <div
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-between px-4 py-2 border-b border-slate-800/60 cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">
                {activeTab === 'image' && 'Foto & Ajustes'}
                {activeTab === 'grid' && 'Configurações do Gráfico'}
                {activeTab === 'palette' && `Paleta de Cores (${palette.length})`}
                {activeTab === 'export' && 'Exportar Gráfico'}
              </span>
              {activeTab === 'grid' && (
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {gridConfig.width}×{gridConfig.height}
                </span>
              )}
            </div>

            {/* Grab handle indicator */}
            <div className="w-10 h-1 bg-slate-700/80 rounded-full" />

            {/* Minimize button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Recolher painel"
              aria-label="Recolher painel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sheet Body with touch-friendly controls */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 overscroll-contain">
            {/* TAB 1: IMAGEM / NOVA FOTO */}
            {activeTab === 'image' && (
              <div className="space-y-4">
                {/* Upload photo + Crop actions (min 44px touch targets) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <label className="min-h-[46px] flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md active:scale-95 text-center">
                    <ImageIcon className="w-4 h-4 stroke-[2.5]" />
                    <span>Enviar Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileInputChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={onOpenCrop}
                    className="min-h-[46px] flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all active:scale-95 text-center"
                  >
                    <Crop className="w-4 h-4 text-emerald-400" />
                    <span>Enquadrar / Recorte</span>
                  </button>
                </div>

                {/* Presets Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Modelos de Teste
                    </span>
                    <span className="text-[10px] text-slate-500">Toque para carregar</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_DESIGNS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelectPreset(p)}
                        className="group flex flex-col items-center p-1.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all text-left active:scale-95 min-h-[44px]"
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-800 mb-1.5 group-hover:scale-105 transition-transform">
                          <img
                            src={p.dataUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-300 truncate w-full text-center">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Adjustments: Brightness, Contrast, Saturation */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-teal-400" />
                      Ajustes Pré-Gráfico
                    </span>
                    <button
                      onClick={onResetAdjustments}
                      className="min-h-[32px] px-2 flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Resetar
                    </button>
                  </div>

                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Brilho</span>
                      <span className="font-mono text-slate-300">{adjustments.brightness}</span>
                    </div>
                    <div className="min-h-[44px] flex items-center">
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={adjustments.brightness}
                        onChange={(e) =>
                          onUpdateAdjustments({ brightness: parseInt(e.target.value) })
                        }
                        className="w-full accent-emerald-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Contraste</span>
                      <span className="font-mono text-slate-300">{adjustments.contrast}</span>
                    </div>
                    <div className="min-h-[44px] flex items-center">
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={adjustments.contrast}
                        onChange={(e) =>
                          onUpdateAdjustments({ contrast: parseInt(e.target.value) })
                        }
                        className="w-full accent-emerald-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Saturação</span>
                      <span className="font-mono text-slate-300">{adjustments.saturation}</span>
                    </div>
                    <div className="min-h-[44px] flex items-center">
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={adjustments.saturation}
                        onChange={(e) =>
                          onUpdateAdjustments({ saturation: parseInt(e.target.value) })
                        }
                        className="w-full accent-emerald-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GRÁFICO */}
            {activeTab === 'grid' && (
              <div className="space-y-4">
                {/* Craft Type Selector */}
                <div>
                  <span className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Técnica de Artesanato
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    {(
                      [
                        { id: 'ponto-cruz', label: 'Ponto Cruz' },
                        { id: 'croche-conduzido', label: 'Crochê' },
                        { id: 'tapecaria', label: 'Tapeçaria' },
                      ] as { id: CraftType; label: string }[]
                    ).map((craft) => (
                      <button
                        key={craft.id}
                        onClick={() => onUpdateGridConfig({ craftType: craft.id })}
                        className={`min-h-[44px] py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          gridConfig.craftType === craft.id
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {craft.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Width Slider (30 to 160) */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">
                      Largura do Gráfico
                    </span>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {gridConfig.width} col × {gridConfig.height} lin
                    </span>
                  </div>
                  <div className="min-h-[44px] flex items-center">
                    <input
                      type="range"
                      min="30"
                      max="160"
                      value={gridConfig.width}
                      onChange={(e) => onUpdateGridConfig({ width: parseInt(e.target.value) })}
                      className="w-full accent-emerald-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>30 pts</span>
                    <span>60 pts</span>
                    <span>90 pts (Padrão)</span>
                    <span>120 pts</span>
                    <span>160 pts</span>
                  </div>
                </div>

                {/* Number of Colors Slider (2 to 32) */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">
                      Número de Cores (Quantização)
                    </span>
                    <span className="font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                      {gridConfig.colorCount} cores
                    </span>
                  </div>
                  <div className="min-h-[44px] flex items-center">
                    <input
                      type="range"
                      min="2"
                      max="32"
                      value={gridConfig.colorCount}
                      onChange={(e) =>
                        onUpdateGridConfig({ colorCount: parseInt(e.target.value) })
                      }
                      className="w-full accent-teal-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2 cores</span>
                    <span>8 cores</span>
                    <span>16 cores</span>
                    <span>32 cores</span>
                  </div>
                </div>

                {/* View Modes */}
                <div>
                  <span className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Modo de Visualização
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    {(
                      [
                        { id: 'color-symbol', label: 'Cor + Símbolo' },
                        { id: 'color-only', label: 'Apenas Cor' },
                        { id: 'symbol-bw', label: 'Preto & Branco' },
                      ] as { id: ViewMode; label: string }[]
                    ).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => onUpdateGridConfig({ viewMode: m.id })}
                        className={`min-h-[44px] py-1 px-2 text-[11px] font-semibold rounded-lg transition-all text-center leading-tight ${
                          gridConfig.viewMode === m.id
                            ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Toggles with generous min-h-[44px] hitboxes */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-xs font-semibold text-slate-200 block mb-1">
                    Exibição da Grade
                  </span>

                  <label className="min-h-[44px] flex items-center justify-between cursor-pointer py-1">
                    <span className="text-xs text-slate-300">Linhas da grade quadriculada</span>
                    <input
                      type="checkbox"
                      checked={gridConfig.showGridLines}
                      onChange={(e) =>
                        onUpdateGridConfig({ showGridLines: e.target.checked })
                      }
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="min-h-[44px] flex items-center justify-between cursor-pointer py-1">
                    <span className="text-xs text-slate-300">Símbolos nos quadradinhos</span>
                    <input
                      type="checkbox"
                      checked={gridConfig.showSymbols}
                      onChange={(e) =>
                        onUpdateGridConfig({ showSymbols: e.target.checked })
                      }
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="min-h-[44px] flex items-center justify-between cursor-pointer py-1">
                    <span className="text-xs text-slate-300">
                      Réguas numeradas nas bordas (10, 20, 30...)
                    </span>
                    <input
                      type="checkbox"
                      checked={gridConfig.showRulers}
                      onChange={(e) =>
                        onUpdateGridConfig({ showRulers: e.target.checked })
                      }
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: PALETA & CORES */}
            {activeTab === 'palette' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      Cores e Símbolos ({palette.length})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Toque na cor para alterar seu tom ou limpar o fundo
                    </p>
                  </div>
                  {selectedColorId !== null && (
                    <button
                      onClick={() => onSelectColor(null)}
                      className="min-h-[36px] px-2 text-[11px] font-semibold text-amber-400 hover:underline"
                    >
                      Mostrar todas
                    </button>
                  )}
                </div>

                {/* Palette List with minimum 48px row touch targets */}
                <div className="space-y-2">
                  {palette.map((color) => {
                    const isSelected = selectedColorId === color.id;
                    const pct = ((color.count / totalStitches) * 100).toFixed(1);

                    return (
                      <div
                        key={color.id}
                        onClick={() => onSelectColor(isSelected ? null : color.id)}
                        className={`min-h-[48px] flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                            : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Color swatch button with color input */}
                          <label
                            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-md cursor-pointer border border-white/20 transition-transform active:scale-95 shrink-0"
                            style={{
                              backgroundColor: color.hex,
                              color: color.textColor,
                            }}
                            title="Toque para editar esta cor"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{color.symbol}</span>
                            <input
                              type="color"
                              value={color.hex}
                              onChange={(e) => {
                                onColorChange(color.id, e.target.value);
                              }}
                              className="sr-only"
                            />
                          </label>

                          {/* Color Meta */}
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono font-bold text-slate-200">
                                {color.hex}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold truncate">
                                {color.dmcCode}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                              {color.name}
                            </span>
                          </div>
                        </div>

                        {/* Count & Action */}
                        <div className="flex items-center gap-2 text-right shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-mono font-bold text-slate-200">
                              {color.count.toLocaleString('pt-BR')} pts
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {pct}%
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onColorChange(color.id, '#FFFFFF');
                            }}
                            className="min-h-[40px] px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 active:scale-95"
                            title="Transformar esta cor em branco puro"
                          >
                            Branco
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: EXPORTAR */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                {/* Project Metadata */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
                  <span className="text-xs font-semibold text-slate-200 block">
                    Identificação do Gráfico
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[10px] text-slate-400">Código</label>
                      <input
                        type="text"
                        value={projectInfo.code}
                        onChange={(e) =>
                          onUpdateProjectInfo({ code: e.target.value })
                        }
                        className="w-full min-h-[44px] px-2.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] text-slate-400">Título do Gráfico</label>
                      <input
                        type="text"
                        value={projectInfo.title}
                        onChange={(e) =>
                          onUpdateProjectInfo({ title: e.target.value })
                        }
                        className="w-full min-h-[44px] px-2.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Fabric Size Estimator */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Info className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tecido (Etamine 14ct):</span>
                    </div>
                    <span className="font-mono font-bold text-slate-200">
                      {cmWidth} × {cmHeight} cm
                    </span>
                  </div>
                </div>

                {/* Download Action Buttons (min 48px height) */}
                <div className="space-y-2.5">
                  <button
                    onClick={onDownloadPNG}
                    disabled={isProcessing}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Baixar Gráfico (PNG Alta Resolução)</span>
                  </button>

                  <button
                    onClick={onDownloadPDF}
                    disabled={isProcessing}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-slate-100 font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400" />
                    <span>Baixar PDF para Impressão (2 Páginas)</span>
                  </button>
                </div>

                <p className="text-[10px] text-center text-slate-500">
                  Página 1 com o gráfico completo e Página 2 com a tabela de cores e símbolos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FIXED PERMANENT BOTTOM TAB BAR AT THE SMARTPHONE BASE */}
      <nav
        className="w-full bg-slate-950/98 border-t border-slate-800/90 grid grid-cols-4 items-center px-1 pb-safe shrink-0 z-40"
        aria-label="Navegação Principal"
      >
        {/* Tab 1: Nova Foto */}
        <button
          onClick={() => handleTabClick('image')}
          className={`min-h-[54px] flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'image' && isOpen
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Aba Foto"
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
            Nova Foto
          </span>
        </button>

        {/* Tab 2: Gráfico */}
        <button
          onClick={() => handleTabClick('grid')}
          className={`min-h-[54px] flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'grid' && isOpen
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Aba Gráfico"
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
            Gráfico
          </span>
        </button>

        {/* Tab 3: Paleta */}
        <button
          onClick={() => handleTabClick('palette')}
          className={`relative min-h-[54px] flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'palette' && isOpen
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Aba Paleta"
        >
          <div className="relative">
            <Palette className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-3 text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-1 py-0.2 rounded-full leading-tight">
              {palette.length}
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
            Paleta
          </span>
        </button>

        {/* Tab 4: Exportar */}
        <button
          onClick={() => handleTabClick('export')}
          className={`min-h-[54px] flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'export' && isOpen
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Aba Exportar"
        >
          <FileDown className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
            Exportar
          </span>
        </button>
      </nav>
    </div>
  );
};
