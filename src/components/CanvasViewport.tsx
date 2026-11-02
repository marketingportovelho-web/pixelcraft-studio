import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChartData, ProjectInfo, ViewMode } from '../types';
import { ZoomIn, ZoomOut, Maximize2, Eye } from 'lucide-react';

interface CanvasViewportProps {
  chartData: ChartData | null;
  projectInfo: ProjectInfo;
  viewMode: ViewMode;
  showGridLines: boolean;
  showSymbols: boolean;
  showRulers: boolean;
  onSelectColor?: (colorId: number) => void;
  selectedColorId?: number | null;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  chartData,
  projectInfo,
  viewMode,
  showGridLines,
  showSymbols,
  showRulers,
  onSelectColor,
  selectedColorId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pan and Zoom transform state (absolute coordinates in pixels)
  const [zoom, setZoom] = useState<number>(0.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCentered, setIsCentered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Selected / Hovered cell inspection
  const [inspectedCell, setInspectedCell] = useState<{
    x: number;
    y: number;
    palIdx: number;
  } | null>(null);

  // Multi-touch pinch state
  const pinchRef = useRef<{
    initialDistance: number;
    initialZoom: number;
    initialPan: { x: number; y: number };
  } | null>(null);

  // Cell size base in CSS pixels before zoom
  const baseCellSize = 20;
  const rulerSize = showRulers ? 30 : 6;

  // Total unscaled canvas dimensions
  const totalUnscaledW = chartData ? chartData.width * baseCellSize + rulerSize * 2 : 0;
  const totalUnscaledH = chartData ? chartData.height * baseCellSize + rulerSize * 2 : 0;

  // Mathematical Auto-Centering and Fitting helper
  const fitToScreen = useCallback((): boolean => {
    if (!containerRef.current || !chartData) return false;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 10 || rect.height <= 10) return false;

    // Generous margin around chart so rulers and borders are 100% visible
    const padding = 32;
    const availW = Math.max(30, rect.width - padding);
    const availH = Math.max(30, rect.height - padding);

    const totalGridW = chartData.width * baseCellSize + rulerSize * 2;
    const totalGridH = chartData.height * baseCellSize + rulerSize * 2;

    // Scale factor to fit 100% within width and height
    const scaleX = availW / totalGridW;
    const scaleY = availH / totalGridH;
    const idealScale = Math.min(scaleX, scaleY);

    // Allow wide zoom out down to 0.05 (5%) and up to 3.0 (300%)
    const newZoom = Math.max(0.05, Math.min(idealScale, 3.0));

    // Calculate exact center coordinates (never at 0, 0 top-left)
    const scaledW = totalGridW * newZoom;
    const scaledH = totalGridH * newZoom;
    const centeredX = Math.round((rect.width - scaledW) / 2);
    const centeredY = Math.round((rect.height - scaledH) / 2);

    setZoom(newZoom);
    setPan({ x: centeredX, y: centeredY });
    setIsCentered(true);
    return true;
  }, [chartData, rulerSize]);

  // Trigger auto-centering immediately whenever chartData is loaded or recalculated
  useEffect(() => {
    if (!chartData) return;
    setIsCentered(false);

    let cancelled = false;

    const attemptFit = () => {
      if (cancelled) return;
      const success = fitToScreen();
      if (!success) {
        requestAnimationFrame(() => {
          if (!cancelled && !fitToScreen()) {
            setTimeout(() => {
              if (!cancelled) fitToScreen();
            }, 60);
          }
        });
      }
    };

    attemptFit();

    return () => {
      cancelled = true;
    };
  }, [chartData, fitToScreen]);

  // Keep centered when container element resizes (e.g. orientation change or bottom sheet toggle)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 20 && entry.contentRect.height > 20) {
          fitToScreen();
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fitToScreen]);

  // Handle Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const totalW = chartData.width * baseCellSize + rulerSize * 2;
    const totalH = chartData.height * baseCellSize + rulerSize * 2;

    // Set canvas dimensions with high DPI
    canvas.width = totalW * dpr;
    canvas.height = totalH * dpr;
    canvas.style.width = `${totalW}px`;
    canvas.style.height = `${totalH}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Technical paper background (#fdfbf7)
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, totalW, totalH);

    const startX = rulerSize;
    const startY = rulerSize;
    const gridW = chartData.width * baseCellSize;
    const gridH = chartData.height * baseCellSize;

    // 2. Draw Rulers
    if (showRulers) {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Top & Bottom rulers
      for (let x = 1; x <= chartData.width; x++) {
        if (x % 10 === 0) {
          const xPos = startX + (x - 0.5) * baseCellSize;
          ctx.fillText(String(x), xPos, startY - 12);
          ctx.fillText(String(x), xPos, startY + gridH + 12);

          // Ticks
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(xPos, startY - 4);
          ctx.lineTo(xPos, startY);
          ctx.moveTo(xPos, startY + gridH);
          ctx.lineTo(xPos, startY + gridH + 4);
          ctx.stroke();
        }
      }

      // Left & Right rulers
      for (let y = 1; y <= chartData.height; y++) {
        if (y % 10 === 0) {
          const yPos = startY + (y - 0.5) * baseCellSize;
          ctx.textAlign = 'right';
          ctx.fillText(String(y), startX - 8, yPos);
          ctx.textAlign = 'left';
          ctx.fillText(String(y), startX + gridW + 8, yPos);

          // Ticks
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(startX - 4, yPos);
          ctx.lineTo(startX, yPos);
          ctx.moveTo(startX + gridW, yPos);
          ctx.lineTo(startX + gridW + 4, yPos);
          ctx.stroke();
        }
      }

      // Center red alignment markers
      const midCol = Math.floor(chartData.width / 2);
      const midRow = Math.floor(chartData.height / 2);
      const midX = startX + midCol * baseCellSize;
      const midY = startY + midRow * baseCellSize;

      ctx.fillStyle = '#dc2626';
      // Top marker
      ctx.beginPath();
      ctx.moveTo(midX, startY - 2);
      ctx.lineTo(midX - 4, startY - 8);
      ctx.lineTo(midX + 4, startY - 8);
      ctx.fill();
      // Bottom marker
      ctx.beginPath();
      ctx.moveTo(midX, startY + gridH + 2);
      ctx.lineTo(midX - 4, startY + gridH + 8);
      ctx.lineTo(midX + 4, startY + gridH + 8);
      ctx.fill();
      // Left marker
      ctx.beginPath();
      ctx.moveTo(startX - 2, midY);
      ctx.lineTo(startX - 8, midY - 4);
      ctx.lineTo(startX - 8, midY + 4);
      ctx.fill();
      // Right marker
      ctx.beginPath();
      ctx.moveTo(startX + gridW + 2, midY);
      ctx.lineTo(startX + gridW + 8, midY - 4);
      ctx.lineTo(startX + gridW + 8, midY + 4);
      ctx.fill();
    }

    // 3. Draw Cells
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';

    for (let y = 0; y < chartData.height; y++) {
      for (let x = 0; x < chartData.width; x++) {
        const palIdx = chartData.grid[y][x];
        const colorItem = chartData.palette[palIdx];
        const cellX = startX + x * baseCellSize;
        const cellY = startY + y * baseCellSize;

        if (!colorItem) continue;

        const isHighlight = selectedColorId !== null && selectedColorId !== undefined
          ? selectedColorId === palIdx
          : true;

        if (viewMode === 'symbol-bw') {
          ctx.fillStyle = isHighlight ? '#ffffff' : '#f1f5f9';
        } else {
          ctx.fillStyle = colorItem.hex;
          if (!isHighlight) {
            ctx.globalAlpha = 0.25;
          }
        }
        ctx.fillRect(cellX, cellY, baseCellSize, baseCellSize);
        ctx.globalAlpha = 1.0;

        // Symbol
        if (showSymbols && (viewMode === 'color-symbol' || viewMode === 'symbol-bw')) {
          if (viewMode === 'symbol-bw') {
            ctx.fillStyle = isHighlight ? '#0f172a' : '#94a3b8';
          } else {
            ctx.fillStyle = colorItem.textColor;
            if (!isHighlight) ctx.globalAlpha = 0.3;
          }
          ctx.fillText(colorItem.symbol, cellX + baseCellSize / 2, cellY + baseCellSize / 2 + 1);
          ctx.globalAlpha = 1.0;
        }
      }
    }

    // 4. Grid Lines
    if (showGridLines) {
      // 1px hairline lines
      ctx.strokeStyle = viewMode === 'symbol-bw' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();

      for (let x = 0; x <= chartData.width; x++) {
        if (x % 10 !== 0) {
          const xPos = startX + x * baseCellSize;
          ctx.moveTo(xPos, startY);
          ctx.lineTo(xPos, startY + gridH);
        }
      }
      for (let y = 0; y <= chartData.height; y++) {
        if (y % 10 !== 0) {
          const yPos = startY + y * baseCellSize;
          ctx.moveTo(startX, yPos);
          ctx.lineTo(startX + gridW, yPos);
        }
      }
      ctx.stroke();

      // Bold 10-count lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      for (let x = 0; x <= chartData.width; x += 10) {
        const xPos = startX + x * baseCellSize;
        ctx.moveTo(xPos, startY);
        ctx.lineTo(xPos, startY + gridH);
      }
      for (let y = 0; y <= chartData.height; y += 10) {
        const yPos = startY + y * baseCellSize;
        ctx.moveTo(startX, yPos);
        ctx.lineTo(startX + gridW, yPos);
      }
      ctx.stroke();
    }

    // 5. Outer border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, gridW, gridH);

    // 6. Highlight inspected cell if active
    if (inspectedCell) {
      const cellX = startX + inspectedCell.x * baseCellSize;
      const cellY = startY + inspectedCell.y * baseCellSize;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cellX, cellY, baseCellSize, baseCellSize);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(cellX - 1, cellY - 1, baseCellSize + 2, baseCellSize + 2);
    }

    ctx.restore();
  }, [
    chartData,
    viewMode,
    showGridLines,
    showSymbols,
    showRulers,
    selectedColorId,
    inspectedCell,
  ]);

  // Touch & Mouse Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: Math.round(e.clientX - dragStart.x),
        y: Math.round(e.clientY - dragStart.y),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom centered at mouse cursor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;

    setZoom((oldZoom) => {
      const nextZoom = Math.min(Math.max(oldZoom * zoomFactor, 0.05), 4);
      setPan((oldPan) => ({
        x: Math.round(cursorX - (cursorX - oldPan.x) * (nextZoom / oldZoom)),
        y: Math.round(cursorY - (cursorY - oldPan.y) * (nextZoom / oldZoom)),
      }));
      return nextZoom;
    });
  };

  // Zoom Step centered at screen center
  const handleZoomStep = (factor: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setZoom((oldZoom) => {
      const nextZoom = Math.min(Math.max(oldZoom * factor, 0.05), 4);
      setPan((oldPan) => ({
        x: Math.round(centerX - (centerX - oldPan.x) * (nextZoom / oldZoom)),
        y: Math.round(centerY - (centerY - oldPan.y) * (nextZoom / oldZoom)),
      }));
      return nextZoom;
    });
  };

  // Touch Handlers for Pinch & Drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchRef.current = {
        initialDistance: dist,
        initialZoom: zoom,
        initialPan: { ...pan },
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: Math.round(e.touches[0].clientX - dragStart.x),
        y: Math.round(e.touches[0].clientY - dragStart.y),
      });
    } else if (e.touches.length === 2 && pinchRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const midTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const midTouchY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleRatio = dist / pinchRef.current.initialDistance;
      const nextZoom = Math.min(Math.max(pinchRef.current.initialZoom * scaleRatio, 0.05), 4);

      setZoom(nextZoom);
      setPan({
        x: Math.round(
          midTouchX - (midTouchX - pinchRef.current.initialPan.x) * (nextZoom / pinchRef.current.initialZoom)
        ),
        y: Math.round(
          midTouchY - (midTouchY - pinchRef.current.initialPan.y) * (nextZoom / pinchRef.current.initialZoom)
        ),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchRef.current = null;
  };

  // Click on cell to inspect using unscaled coordinate math
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartData || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert from screen px to unscaled canvas px
    const unscaledX = (clientX - pan.x) / zoom;
    const unscaledY = (clientY - pan.y) / zoom;

    const gridX = Math.floor((unscaledX - rulerSize) / baseCellSize);
    const gridY = Math.floor((unscaledY - rulerSize) / baseCellSize);

    if (
      gridX >= 0 &&
      gridX < chartData.width &&
      gridY >= 0 &&
      gridY < chartData.height
    ) {
      const palIdx = chartData.grid[gridY]?.[gridX];
      if (palIdx !== undefined) {
        setInspectedCell({ x: gridX, y: gridY, palIdx });
        if (onSelectColor) onSelectColor(palIdx);
      }
    }
  };

  const inspectedColor =
    inspectedCell && chartData?.palette[inspectedCell.palIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-slate-900 cursor-grab active:cursor-grabbing touch-none select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Blueprint grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 0.75px, transparent 0.75px), radial-gradient(#38bdf8 0.75px, #090d16 0.75px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      {/* Floating stitch inspection badge */}
      {inspectedCell && inspectedColor && (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between px-3.5 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-xl text-xs text-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-md border border-white/20 shadow-inner flex items-center justify-center font-bold font-mono text-[11px]"
              style={{
                backgroundColor: inspectedColor.hex,
                color: inspectedColor.textColor,
              }}
            >
              {inspectedColor.symbol}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                Ponto ({inspectedCell.x + 1}, {inspectedCell.y + 1})
                <span className="text-slate-400 font-normal">·</span>
                <span className="text-amber-400 font-mono">{inspectedColor.hex}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {inspectedColor.dmcCode} ({inspectedColor.name}) · {inspectedColor.count} pontos no gráfico
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setInspectedCell(null);
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Zoom & Fit Controls (Bottom of Viewport - min 44px touch targets) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 p-1 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-xl">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomStep(1.25);
          }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95"
          title="Aumentar Zoom"
          aria-label="Aumentar Zoom"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        <span className="px-1.5 text-xs font-mono font-bold text-emerald-400 select-none min-w-[44px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomStep(0.75);
          }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95"
          title="Diminuir Zoom"
          aria-label="Diminuir Zoom"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-slate-700/80 mx-0.5" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            fitToScreen();
          }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95"
          title="Centralizar e Enquadrar Gráfico"
          aria-label="Centralizar e Enquadrar Gráfico"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* View Mode Pill indicator badge */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-slate-300 rounded-lg shadow-sm">
          <Eye className="w-3 h-3 text-emerald-400" />
          {viewMode === 'color-symbol' && 'Cor + Símbolo'}
          {viewMode === 'color-only' && 'Apenas Cor'}
          {viewMode === 'symbol-bw' && 'Preto & Branco (P&B)'}
        </span>
      </div>

      {/* Canvas Wrapper: Absolutely positioned top-0 left-0 so (pan.x, pan.y) is mathematically exact */}
      <div
        className={`absolute top-0 left-0 shadow-2xl rounded-sm transition-opacity duration-150 ${
          isCentered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: '0 0',
          width: totalUnscaledW > 0 ? `${totalUnscaledW}px` : 'auto',
          height: totalUnscaledH > 0 ? `${totalUnscaledH}px` : 'auto',
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="rounded-sm shadow-xl block"
        />
      </div>
    </div>
  );
};
