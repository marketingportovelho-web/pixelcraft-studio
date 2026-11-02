import jsPDF from 'jspdf';
import { ChartData, ColorItem, ProjectInfo, ViewMode } from '../types';

export interface RenderExportOptions {
  chartData: ChartData;
  projectInfo: ProjectInfo;
  viewMode: ViewMode;
  showGridLines: boolean;
  showSymbols: boolean;
  showRulers: boolean;
  cellSize?: number; // default 24
}

// Generates a crisp base64 PNG of the cell with symbol for 100% PDF fidelity
function createMiniSymbolCell(color: ColorItem, viewMode: ViewMode): string {
  const size = 52;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  if (viewMode === 'symbol-bw') {
    ctx.fillStyle = '#ffffff';
  } else {
    ctx.fillStyle = color.hex;
  }
  ctx.fillRect(0, 0, size, size);

  // Border
  ctx.strokeStyle = viewMode === 'symbol-bw' ? '#0f172a' : 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, size, size);

  // Symbol
  if (viewMode === 'color-symbol' || viewMode === 'symbol-bw') {
    ctx.fillStyle = viewMode === 'symbol-bw' ? '#0f172a' : color.textColor;
    ctx.font = 'bold 32px "JetBrains Mono", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(color.symbol, size / 2, size / 2 + 1);
  }

  return canvas.toDataURL('image/png');
}

// Generates a crisp base64 color swatch image
function createMiniColorSwatch(hex: string): string {
  const w = 72;
  const h = 36;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, w, h);

  return canvas.toDataURL('image/png');
}

// Builds high-resolution offscreen canvas with paper background, rulers, header, and grid
export function renderHighResChartCanvas(options: RenderExportOptions): HTMLCanvasElement {
  const { chartData, projectInfo, viewMode, showGridLines, showSymbols, showRulers } = options;
  const cellSize = options.cellSize || 24;
  const rulerSize = showRulers ? 36 : 8;
  const headerHeight = 110;
  const margin = 24;

  const gridWidthPx = chartData.width * cellSize;
  const gridHeightPx = chartData.height * cellSize;

  const totalWidth = gridWidthPx + rulerSize * 2 + margin * 2;
  const totalHeight = gridHeightPx + rulerSize * 2 + headerHeight + margin * 2;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context for export');

  // 1. Technical paper background (warm archival white)
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Decorative border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(margin / 2, margin / 2, totalWidth - margin, totalHeight - margin);

  // 2. Header Area
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(projectInfo.title || 'Gráfico de Ponto Cruz / Crochê', margin + 10, margin + 35);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 13px "Plus Jakarta Sans", system-ui, sans-serif';
  const subtitle = `PixelCraft Studio • ${projectInfo.code || 'Nº 1084-01'} • ${new Date().toLocaleDateString('pt-BR')}`;
  ctx.fillText(subtitle, margin + 10, margin + 58);

  // Stats badge bar
  const fabricSizeCmW = ((chartData.width / (projectInfo.fabricCount || 14)) * 2.54).toFixed(1);
  const fabricSizeCmH = ((chartData.height / (projectInfo.fabricCount || 14)) * 2.54).toFixed(1);
  const statsText = `${chartData.width} × ${chartData.height} pts  •  ${chartData.totalStitches.toLocaleString('pt-BR')} pontos totais  •  ${chartData.palette.length} cores  •  Tamanho aprox. (Etamine 14ct): ${fabricSizeCmW} × ${fabricSizeCmH} cm`;

  ctx.fillStyle = '#334155';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText(statsText, margin + 10, margin + 82);

  // Divider line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(margin + 10, margin + 96);
  ctx.lineTo(totalWidth - margin - 10, margin + 96);
  ctx.stroke();

  // Grid offsets
  const startX = margin + rulerSize;
  const startY = margin + headerHeight + rulerSize;

  // 3. Draw Rulers (Top, Bottom, Left, Right)
  if (showRulers) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Horizontal rulers (top & bottom)
    for (let x = 1; x <= chartData.width; x++) {
      if (x % 10 === 0) {
        const xPos = startX + (x - 0.5) * cellSize;
        ctx.fillText(String(x), xPos, startY - 16);
        ctx.fillText(String(x), xPos, startY + gridHeightPx + 16);

        // Small tick marks
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(xPos, startY - 6);
        ctx.lineTo(xPos, startY);
        ctx.moveTo(xPos, startY + gridHeightPx);
        ctx.lineTo(xPos, startY + gridHeightPx + 6);
        ctx.stroke();
      }
    }

    // Vertical rulers (left & right)
    for (let y = 1; y <= chartData.height; y++) {
      if (y % 10 === 0) {
        const yPos = startY + (y - 0.5) * cellSize;
        ctx.textAlign = 'right';
        ctx.fillText(String(y), startX - 12, yPos);
        ctx.textAlign = 'left';
        ctx.fillText(String(y), startX + gridWidthPx + 12, yPos);

        // Ticks
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX - 6, yPos);
        ctx.lineTo(startX, yPos);
        ctx.moveTo(startX + gridWidthPx, yPos);
        ctx.lineTo(startX + gridWidthPx + 6, yPos);
        ctx.stroke();
      }
    }

    // Center markers (Red alignment arrows)
    const midX = startX + Math.floor(chartData.width / 2) * cellSize;
    const midY = startY + Math.floor(chartData.height / 2) * cellSize;

    ctx.fillStyle = '#dc2626';
    // Top arrow
    ctx.beginPath();
    ctx.moveTo(midX, startY - 4);
    ctx.lineTo(midX - 5, startY - 12);
    ctx.lineTo(midX + 5, startY - 12);
    ctx.fill();
    // Bottom arrow
    ctx.beginPath();
    ctx.moveTo(midX, startY + gridHeightPx + 4);
    ctx.lineTo(midX - 5, startY + gridHeightPx + 12);
    ctx.lineTo(midX + 5, startY + gridHeightPx + 12);
    ctx.fill();
    // Left arrow
    ctx.beginPath();
    ctx.moveTo(startX - 4, midY);
    ctx.lineTo(startX - 12, midY - 5);
    ctx.lineTo(startX - 12, midY + 5);
    ctx.fill();
    // Right arrow
    ctx.beginPath();
    ctx.moveTo(startX + gridWidthPx + 4, midY);
    ctx.lineTo(startX + gridWidthPx + 12, midY - 5);
    ctx.lineTo(startX + gridWidthPx + 12, midY + 5);
    ctx.fill();
  }

  // 4. Draw Grid Cells
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const symbolFontSize = Math.max(9, Math.floor(cellSize * 0.65));
  ctx.font = `bold ${symbolFontSize}px "JetBrains Mono", monospace`;

  for (let y = 0; y < chartData.height; y++) {
    for (let x = 0; x < chartData.width; x++) {
      const palIdx = chartData.grid[y][x];
      const colorItem = chartData.palette[palIdx];
      const cellX = startX + x * cellSize;
      const cellY = startY + y * cellSize;

      if (!colorItem) continue;

      if (viewMode === 'symbol-bw') {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = colorItem.hex;
      }
      ctx.fillRect(cellX, cellY, cellSize, cellSize);

      if (showSymbols && (viewMode === 'color-symbol' || viewMode === 'symbol-bw')) {
        if (viewMode === 'symbol-bw') {
          ctx.fillStyle = '#0f172a';
        } else {
          ctx.fillStyle = colorItem.textColor;
        }
        ctx.fillText(colorItem.symbol, cellX + cellSize / 2, cellY + cellSize / 2 + 1);
      }
    }
  }

  // 5. Draw Grid Lines (Hairline + 10-count thick lines)
  if (showGridLines) {
    ctx.strokeStyle = viewMode === 'symbol-bw' ? '#cbd5e1' : 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= chartData.width; x++) {
      if (x % 10 !== 0) {
        const xPos = startX + x * cellSize;
        ctx.moveTo(xPos, startY);
        ctx.lineTo(xPos, startY + gridHeightPx);
      }
    }
    for (let y = 0; y <= chartData.height; y++) {
      if (y % 10 !== 0) {
        const yPos = startY + y * cellSize;
        ctx.moveTo(startX, yPos);
        ctx.lineTo(startX + gridWidthPx, yPos);
      }
    }
    ctx.stroke();

    // Bold 10-count lines
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let x = 0; x <= chartData.width; x += 10) {
      const xPos = startX + x * cellSize;
      ctx.moveTo(xPos, startY);
      ctx.lineTo(xPos, startY + gridHeightPx);
    }
    for (let y = 0; y <= chartData.height; y += 10) {
      const yPos = startY + y * cellSize;
      ctx.moveTo(startX, yPos);
      ctx.lineTo(startX + gridWidthPx, yPos);
    }
    ctx.rect(startX, startY, gridWidthPx, gridHeightPx);
    ctx.stroke();
  }

  return canvas;
}

// Download high-res PNG file
export function downloadHighResPNG(options: RenderExportOptions) {
  const canvas = renderHighResChartCanvas({ ...options, cellSize: 26 });
  const filename = `${(options.projectInfo.title || 'grafico-pixelcraft')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')}-${options.projectInfo.code || '1084'}.png`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Generate Printable Multi-Page PDF (Page 1: Chart, Page 2: Legend Table)
export async function downloadPrintablePDF(options: RenderExportOptions) {
  const { chartData, projectInfo } = options;
  const isLandscape = chartData.width > chartData.height;

  // Create jsPDF document
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;

  // --- PAGE 1: High Resolution Chart ---
  // Header
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, 0, pageWidth, 28, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(15, 23, 42);
  pdf.text(projectInfo.title || 'Gráfico PixelCraft Studio', margin, 12);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    `Código: ${projectInfo.code || 'Nº 1084-01'}  |  Pontos: ${chartData.width} × ${chartData.height} (${chartData.totalStitches.toLocaleString('pt-BR')} pts)  |  Cores: ${chartData.palette.length}`,
    margin,
    18
  );
  pdf.text(
    `Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}  |  Página 1 de 2: Gráfico Principal`,
    margin,
    23
  );

  // Render high quality chart image
  const chartCanvas = renderHighResChartCanvas({ ...options, cellSize: 20 });
  const chartImgData = chartCanvas.toDataURL('image/jpeg', 0.95);

  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - 34 - margin;
  const imgRatio = chartCanvas.width / chartCanvas.height;

  let drawW = availableWidth;
  let drawH = drawW / imgRatio;
  if (drawH > availableHeight) {
    drawH = availableHeight;
    drawW = drawH * imgRatio;
  }
  const posX = (pageWidth - drawW) / 2;
  const posY = 32 + (availableHeight - drawH) / 2;

  pdf.addImage(chartImgData, 'JPEG', posX, posY, drawW, drawH);

  // --- PAGE 2: Color Palette & Symbol Legend ---
  pdf.addPage(isLandscape ? 'landscape' : 'portrait', isLandscape ? 'l' : 'p');

  // Header Page 2
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, 0, pageWidth, 28, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(15, 23, 42);
  pdf.text(`Tabela de Cores e Símbolos - ${projectInfo.title}`, margin, 12);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    `Código: ${projectInfo.code || 'Nº 1084-01'}  |  Guia de Linhas e Contagem de Pontos  |  Página 2 de 2`,
    margin,
    18
  );
  pdf.text(
    `Total de Pontos no Projeto: ${chartData.totalStitches.toLocaleString('pt-BR')} pontos`,
    margin,
    23
  );

  // Legend Table Columns
  const tableStartY = 34;
  const colX = {
    symbolBox: margin + 3,
    symbolText: margin + 14,
    colorSwatch: margin + 25,
    hex: margin + 46,
    dmc: margin + 74,
    count: isLandscape ? margin + 175 : margin + 135,
    percent: isLandscape ? margin + 215 : margin + 168,
  };

  // Table header
  pdf.setFillColor(241, 245, 249);
  pdf.rect(margin, tableStartY, pageWidth - margin * 2, 7.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(51, 65, 85);

  pdf.text('Símbolo', colX.symbolBox, tableStartY + 5);
  pdf.text('Caractere', colX.symbolText, tableStartY + 5);
  pdf.text('Amostra', colX.colorSwatch, tableStartY + 5);
  pdf.text('Código Hex', colX.hex, tableStartY + 5);
  pdf.text('Cor DMC Oficial', colX.dmc, tableStartY + 5);
  pdf.text('Qtd. Pontos', colX.count, tableStartY + 5);
  pdf.text('% Total', colX.percent, tableStartY + 5);

  // Rows configuration (adjust height dynamically if palette has many colors)
  let curY = tableStartY + 7.5;
  const rowCount = chartData.palette.length;
  const rowHeight = rowCount > 24 ? 6.2 : rowCount > 16 ? 6.8 : 7.4;

  chartData.palette.forEach((color, idx) => {
    // Alternating background
    if (idx % 2 === 1) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, curY, pageWidth - margin * 2, rowHeight, 'F');
    }

    // 1. Mini-canvas rendered square with symbol (100% identical to Chart Page 1!)
    const symbolImgData = createMiniSymbolCell(color, options.viewMode);
    if (symbolImgData) {
      pdf.addImage(symbolImgData, 'PNG', colX.symbolBox + 1, curY + 1, 4.8, 4.8);
    }

    // 2. Pure ASCII Single-character label
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text(color.symbol, colX.symbolText + 3, curY + (rowHeight / 2) + 1.5);

    // 3. Mini-canvas color swatch
    const swatchImgData = createMiniColorSwatch(color.hex);
    if (swatchImgData) {
      pdf.addImage(swatchImgData, 'PNG', colX.colorSwatch + 1, curY + 1.2, 10, 4.6);
    }

    // 4. Hex
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text(color.hex, colX.hex, curY + (rowHeight / 2) + 1.2);

    // 5. Official DMC Reference Name & Code
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    const dmcLabel = `${color.dmcCode || 'DMC Geral'} - ${color.name || 'Personalizado'}`;
    // Truncate if long
    const maxChars = isLandscape ? 45 : 30;
    const truncatedDmc = dmcLabel.length > maxChars ? `${dmcLabel.substring(0, maxChars - 3)}...` : dmcLabel;
    pdf.text(truncatedDmc, colX.dmc, curY + (rowHeight / 2) + 1.2);

    // 6. Stitch Count
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${color.count.toLocaleString('pt-BR')} pts`, colX.count, curY + (rowHeight / 2) + 1.2);

    // 7. Percent
    const pct = ((color.count / chartData.totalStitches) * 100).toFixed(1);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(`${pct}%`, colX.percent, curY + (rowHeight / 2) + 1.2);

    curY += rowHeight;
  });

  // Footer Advice on Page 2
  curY = Math.max(curY + 8, pageHeight - 26);
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, curY, pageWidth - margin, curY);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('Guia Técnico de Execução (Ponto Cruz & Crochê):', margin, curY + 5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    '1. Cada símbolo na tabela corresponde exatamente a uma meada DMC individual atribuída sem repetições no projeto.',
    margin,
    curY + 9.5
  );
  pdf.text(
    '2. Para Ponto Cruz: utilize 2 cabos de meada em tecido Etamine 14ct (5.4 pts/cm) e agulha tapestry sem ponta nº 24.',
    margin,
    curY + 13.5
  );
  pdf.text(
    '3. Para Crochê Conduzido: cada quadradinho corresponde a 1 ponto baixo (pb) com troca de cor na laçada final.',
    margin,
    curY + 17.5
  );

  // Save PDF
  const filename = `${(projectInfo.title || 'grafico-pixelcraft')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')}-${projectInfo.code || '1084'}.pdf`;
  pdf.save(filename);
}
