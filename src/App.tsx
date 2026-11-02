import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GridConfig,
  ImageAdjustments,
  ProjectInfo,
  ChartData,
  ColorItem,
} from './types';
import { Header } from './components/Header';
import { CanvasViewport } from './components/CanvasViewport';
import { ControlPanel, ActiveTab } from './components/ControlPanel';
import { ImageCropModal } from './components/ImageCropModal';
import { PRESET_DESIGNS, PresetDesign } from './utils/sampleImages';
import {
  generateChartFromCanvas,
  hexToRgb,
  getLuminance,
  assignUniqueDmcFloss,
} from './utils/colorQuantization';
import { downloadHighResPNG, downloadPrintablePDF } from './utils/exportChart';

export default function App() {
  // Current active source image (data URL or uploaded image)
  const [sourceImageSrc, setSourceImageSrc] = useState<string>(PRESET_DESIGNS[0].dataUrl);
  // Source canvas holding the loaded/cropped image
  const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);

  // Generated chart data
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Grid Configuration
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    width: 90,
    height: 90,
    colorCount: 12,
    viewMode: 'color-symbol',
    showGridLines: true,
    showSymbols: true,
    showRulers: true,
    craftType: 'ponto-cruz',
  });

  // Pre-grid Image Adjustments
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
  });

  // Project Information
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    code: 'Nº 1084-01',
    title: 'Rosa Vintage em Ponto Cruz',
    author: 'PixelCraft',
    fabricCount: 14,
  });

  // Highlighted color ID in palette
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('grid');
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load image into HTMLCanvasElement
  const loadImageToCanvas = useCallback((src: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setSourceCanvas(canvas);
      }
      setIsProcessing(false);
    };
    img.onerror = () => {
      setIsProcessing(false);
    };
  }, []);

  // Initialize with default preset on mount
  useEffect(() => {
    loadImageToCanvas(sourceImageSrc);
  }, []);

  // Recalculate Chart whenever sourceCanvas, gridConfig, or adjustments change
  useEffect(() => {
    if (!sourceCanvas) return;

    // Calculate height respecting aspect ratio
    const imgAspect = sourceCanvas.height / sourceCanvas.width;
    const targetHeight = Math.max(15, Math.min(220, Math.round(gridConfig.width * imgAspect)));

    if (gridConfig.height !== targetHeight) {
      setGridConfig((prev) => ({ ...prev, height: targetHeight }));
      return;
    }

    setIsProcessing(true);
    const timer = setTimeout(() => {
      try {
        const data = generateChartFromCanvas(
          sourceCanvas,
          gridConfig.width,
          targetHeight,
          gridConfig.colorCount,
          adjustments
        );
        setChartData(data);
      } catch (err) {
        console.error('Error generating chart:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [
    sourceCanvas,
    gridConfig.width,
    gridConfig.height,
    gridConfig.colorCount,
    adjustments.brightness,
    adjustments.contrast,
    adjustments.saturation,
  ]);

  // Handle User Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSourceImageSrc(result);
        loadImageToCanvas(result);
        setProjectInfo((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetDesign) => {
    setSourceImageSrc(preset.dataUrl);
    loadImageToCanvas(preset.dataUrl);
    setGridConfig((prev) => ({
      ...prev,
      width: preset.recommendedWidth,
      colorCount: preset.recommendedColors,
    }));
    setProjectInfo((prev) => ({
      ...prev,
      title: `${preset.name} em Ponto Cruz`,
    }));
    setAdjustments({ brightness: 0, contrast: 0, saturation: 0 });
  };

  // Handle Crop confirmation
  const handleConfirmCrop = (croppedCanvas: HTMLCanvasElement) => {
    setSourceCanvas(croppedCanvas);
    setSourceImageSrc(croppedCanvas.toDataURL());
  };

  // Handle manual color replacement from palette picker
  const handleColorChange = (colorId: number, newHex: string) => {
    if (!chartData) return;
    const newRgb = hexToRgb(newHex);
    const lum = getLuminance(newRgb[0], newRgb[1], newRgb[2]);
    const isLight = lum >= 135;

    const baseUpdated = chartData.palette.map((item) => {
      if (item.id === colorId) {
        return {
          ...item,
          hex: newHex,
          rgb: newRgb,
          isLight,
          textColor: isLight ? '#0f172a' : '#ffffff',
        };
      }
      return item;
    });

    // Re-assign unique DMC floss for the palette so codes and names stay accurate and non-duplicated
    const updatedDmcs = assignUniqueDmcFloss(baseUpdated.map((c) => c.rgb));
    const updatedPalette = baseUpdated.map((item, idx) => ({
      ...item,
      dmcCode: updatedDmcs[idx].code,
      name: updatedDmcs[idx].name,
    }));

    setChartData({
      ...chartData,
      palette: updatedPalette,
    });
  };

  // Exports
  const handleDownloadPNG = () => {
    if (!chartData) return;
    downloadHighResPNG({
      chartData,
      projectInfo,
      viewMode: gridConfig.viewMode,
      showGridLines: gridConfig.showGridLines,
      showSymbols: gridConfig.showSymbols,
      showRulers: gridConfig.showRulers,
    });
  };

  const handleDownloadPDF = () => {
    if (!chartData) return;
    downloadPrintablePDF({
      chartData,
      projectInfo,
      viewMode: gridConfig.viewMode,
      showGridLines: gridConfig.showGridLines,
      showSymbols: gridConfig.showSymbols,
      showRulers: gridConfig.showRulers,
    });
  };

  return (
    <div className="min-h-screen h-[100dvh] w-full bg-slate-950 flex justify-center items-center p-0 sm:p-3 font-sans antialiased select-none overflow-hidden">
      {/* Smartphone vertical portrait shell: 414px x 844px on desktop, 100vw/100vh on mobile */}
      <div className="relative w-full sm:w-[414px] max-w-[414px] h-[100dvh] sm:h-[844px] max-h-[844px] bg-slate-900 sm:rounded-3xl border-0 sm:border sm:border-slate-700/60 shadow-2xl flex flex-col overflow-hidden sm:ring-1 sm:ring-white/10">
        
        {/* Subtle Smartphone speaker / Dynamic notch for authentic mobile look on desktop */}
        <div className="hidden sm:flex justify-center items-center h-4 bg-slate-950 shrink-0 select-none">
          <div className="w-20 h-2.5 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 border border-slate-800/80">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <div className="w-7 h-0.5 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Top Header */}
        <Header
          projectInfo={projectInfo}
          onUpdateProjectInfo={(updated) =>
            setProjectInfo((prev) => ({ ...prev, ...updated }))
          }
          onOpenExport={() => {
            setActiveTab('export');
          }}
        />

        {/* Central Canvas Viewport Area */}
        <div className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col bg-slate-950">
          <CanvasViewport
            chartData={chartData}
            projectInfo={projectInfo}
            viewMode={gridConfig.viewMode}
            showGridLines={gridConfig.showGridLines}
            showSymbols={gridConfig.showSymbols}
            showRulers={gridConfig.showRulers}
            onSelectColor={(id) => setSelectedColorId(id)}
            selectedColorId={selectedColorId}
          />

          {/* Processing spinner indicator */}
          {isProcessing && (
            <div className="absolute inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="px-4 py-2.5 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span>Atualizando gráfico...</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sliding Control Sheet with Fixed Bottom Tabs */}
        <ControlPanel
          gridConfig={gridConfig}
          onUpdateGridConfig={(updated) =>
            setGridConfig((prev) => ({ ...prev, ...updated }))
          }
          adjustments={adjustments}
          onUpdateAdjustments={(updated) =>
            setAdjustments((prev) => ({ ...prev, ...updated }))
          }
          onResetAdjustments={() =>
            setAdjustments({ brightness: 0, contrast: 0, saturation: 0 })
          }
          palette={chartData?.palette || []}
          totalStitches={chartData?.totalStitches || 0}
          projectInfo={projectInfo}
          onUpdateProjectInfo={(updated) =>
            setProjectInfo((prev) => ({ ...prev, ...updated }))
          }
          onSelectPreset={handleSelectPreset}
          onOpenCrop={() => setIsCropModalOpen(true)}
          onFileInputChange={handleFileUpload}
          onColorChange={handleColorChange}
          selectedColorId={selectedColorId}
          onSelectColor={setSelectedColorId}
          onDownloadPNG={handleDownloadPNG}
          onDownloadPDF={handleDownloadPDF}
          isProcessing={isProcessing}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Crop & Framing Modal */}
        <ImageCropModal
          imageSrc={sourceImageSrc}
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          onConfirmCrop={handleConfirmCrop}
        />
      </div>
    </div>
  );
}
