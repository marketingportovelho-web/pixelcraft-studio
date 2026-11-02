import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Crop, Move } from 'lucide-react';

export type AspectRatioOption = 'free' | '1:1' | '3:4' | '4:3';

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCrop: (croppedCanvas: HTMLCanvasElement) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onConfirmCrop,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('1:1');
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Crop box rectangle in normalized image coordinates (0 to 1)
  const [crop, setCrop] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.1,
    y: 0.1,
    w: 0.8,
    h: 0.8,
  });

  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [initialCrop, setInitialCrop] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Load Image
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      // Initialize crop according to aspect ratio
      applyDefaultCrop(aspectRatio, img.naturalWidth, img.naturalHeight);
    };
  }, [isOpen, imageSrc]);

  // Adjust crop box whenever aspect ratio changes
  const applyDefaultCrop = (ratio: AspectRatioOption, imgW?: number, imgH?: number) => {
    const w = imgW || imgRef.current?.naturalWidth || 400;
    const h = imgH || imgRef.current?.naturalHeight || 400;
    const imgAspect = w / h;

    if (ratio === 'free') {
      setCrop({ x: 0.05, y: 0.05, w: 0.9, h: 0.9 });
      return;
    }

    let targetRatio = 1;
    if (ratio === '1:1') targetRatio = 1;
    else if (ratio === '3:4') targetRatio = 3 / 4;
    else if (ratio === '4:3') targetRatio = 4 / 3;

    let cropW = 0.85;
    let cropH = (cropW * imgAspect) / targetRatio;

    if (cropH > 0.85) {
      cropH = 0.85;
      cropW = (cropH * targetRatio) / imgAspect;
    }

    const cropX = (1 - cropW) / 2;
    const cropY = (1 - cropH) / 2;

    setCrop({
      x: Math.max(0, cropX),
      y: Math.max(0, cropY),
      w: Math.min(1, cropW),
      h: Math.min(1, cropH),
    });
  };

  const handleRatioChange = (newRatio: AspectRatioOption) => {
    setAspectRatio(newRatio);
    applyDefaultCrop(newRatio);
  };

  // Render preview canvas
  useEffect(() => {
    if (!isOpen || !imgRef.current || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;
    const containerW = containerRef.current.clientWidth;
    const containerH = Math.min(window.innerHeight * 0.52, 380);

    const scale = Math.min(containerW / img.naturalWidth, containerH / img.naturalHeight, 1);
    const dispW = Math.round(img.naturalWidth * scale);
    const dispH = Math.round(img.naturalHeight * scale);

    canvas.width = dispW;
    canvas.height = dispH;

    // Draw background image
    ctx.drawImage(img, 0, 0, dispW, dispH);

    // Dim overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.fillRect(0, 0, dispW, dispH);

    // Clear inside crop box
    const cx = crop.x * dispW;
    const cy = crop.y * dispH;
    const cw = crop.w * dispW;
    const ch = crop.h * dispH;

    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy, cw, ch);
    ctx.clip();
    ctx.drawImage(img, 0, 0, dispW, dispH);

    // Grid lines (rule of thirds)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + cw / 3, cy);
    ctx.lineTo(cx + cw / 3, cy + ch);
    ctx.moveTo(cx + (cw * 2) / 3, cy);
    ctx.lineTo(cx + (cw * 2) / 3, cy + ch);
    ctx.moveTo(cx, cy + ch / 3);
    ctx.lineTo(cx + cw, cy + ch / 3);
    ctx.moveTo(cx, cy + (ch * 2) / 3);
    ctx.lineTo(cx + cw, cy + (ch * 2) / 3);
    ctx.stroke();
    ctx.restore();

    // Border around crop box
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cw, ch);

    // Corner handle markers
    const hSize = 14;
    ctx.fillStyle = '#38bdf8';
    // Top-Left
    ctx.fillRect(cx - 3, cy - 3, hSize, 3);
    ctx.fillRect(cx - 3, cy - 3, 3, hSize);
    // Top-Right
    ctx.fillRect(cx + cw - hSize + 3, cy - 3, hSize, 3);
    ctx.fillRect(cx + cw, cy - 3, 3, hSize);
    // Bottom-Left
    ctx.fillRect(cx - 3, cy + ch, hSize, 3);
    ctx.fillRect(cx - 3, cy + ch - hSize + 3, 3, hSize);
    // Bottom-Right
    ctx.fillRect(cx + cw - hSize + 3, cy + ch, hSize, 3);
    ctx.fillRect(cx + cw, cy + ch - hSize + 3, 3, hSize);
  }, [crop, isOpen]);

  // Touch and Mouse interaction on canvas
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;

    const cx = crop.x;
    const cy = crop.y;
    const cw = crop.w;
    const ch = crop.h;

    const threshold = 0.08;

    // Check corner handles
    if (Math.hypot(nx - (cx + cw), ny - (cy + ch)) < threshold) {
      setActiveHandle('br');
    } else if (Math.hypot(nx - cx, ny - cy) < threshold) {
      setActiveHandle('tl');
    } else if (nx >= cx && nx <= cx + cw && ny >= cy && ny <= cy + ch) {
      setActiveHandle('move');
    } else {
      setActiveHandle(null);
    }

    setDragStart({ x: nx, y: ny });
    setInitialCrop({ ...crop });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!activeHandle || !dragStart || !initialCrop || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;

    const dx = nx - dragStart.x;
    const dy = ny - dragStart.y;

    if (activeHandle === 'move') {
      const nextX = Math.max(0, Math.min(1 - initialCrop.w, initialCrop.x + dx));
      const nextY = Math.max(0, Math.min(1 - initialCrop.h, initialCrop.y + dy));
      setCrop({ ...initialCrop, x: nextX, y: nextY });
    } else if (activeHandle === 'br') {
      let nextW = Math.max(0.15, Math.min(1 - initialCrop.x, initialCrop.w + dx));
      let nextH = Math.max(0.15, Math.min(1 - initialCrop.y, initialCrop.h + dy));

      if (aspectRatio !== 'free' && imgRef.current) {
        const imgAspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
        let targetRatio = 1;
        if (aspectRatio === '1:1') targetRatio = 1;
        else if (aspectRatio === '3:4') targetRatio = 3 / 4;
        else if (aspectRatio === '4:3') targetRatio = 4 / 3;

        nextH = (nextW * imgAspect) / targetRatio;
        if (initialCrop.y + nextH > 1) {
          nextH = 1 - initialCrop.y;
          nextW = (nextH * targetRatio) / imgAspect;
        }
      }

      setCrop({ ...initialCrop, w: nextW, h: nextH });
    }
  };

  const handlePointerUp = () => {
    setActiveHandle(null);
    setDragStart(null);
    setInitialCrop(null);
  };

  const handleConfirm = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;

    const cropX = Math.round(crop.x * img.naturalWidth);
    const cropY = Math.round(crop.y * img.naturalHeight);
    const cropW = Math.round(crop.w * img.naturalWidth);
    const cropH = Math.round(crop.h * img.naturalHeight);

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = Math.max(1, cropW);
    croppedCanvas.height = Math.max(1, cropH);
    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    onConfirmCrop(croppedCanvas);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Enquadrar e Recortar Imagem</h3>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Display Viewport */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-center p-4 bg-slate-950 min-h-[300px] select-none touch-none"
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onTouchStart={(e) => {
            if (e.touches.length > 0) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handlePointerUp}
        >
          <canvas ref={canvasRef} className="rounded shadow-lg cursor-crosshair max-w-full" />
        </div>

        {/* Aspect Ratio Selector (min 44px touch height) */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800">
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
            {(['1:1', '3:4', '4:3', 'free'] as AspectRatioOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => handleRatioChange(opt)}
                className={`flex-1 min-h-[44px] py-2 text-xs font-semibold rounded-lg transition-all ${
                  aspectRatio === opt
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt === 'free' ? 'Livre' : opt}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons (min 44px height) */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 bg-slate-900 border-t border-slate-800">
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Check className="w-4 h-4" />
            Aplicar Recorte
          </button>
        </div>
      </div>
    </div>
  );
};
