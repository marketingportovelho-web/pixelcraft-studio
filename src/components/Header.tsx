import React, { useState } from 'react';
import { ProjectInfo } from '../types';
import { Grid, Share2, Edit3, Check, Sparkles } from 'lucide-react';

interface HeaderProps {
  projectInfo: ProjectInfo;
  onUpdateProjectInfo: (updated: Partial<ProjectInfo>) => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectInfo,
  onUpdateProjectInfo,
  onOpenExport,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(projectInfo.title);
  const [tempCode, setTempCode] = useState(projectInfo.code);
  const [copied, setCopied] = useState(false);

  const handleSaveTitle = () => {
    onUpdateProjectInfo({
      title: tempTitle || 'Meu Gráfico',
      code: tempCode || 'Nº 1084-01',
    });
    setIsEditingTitle(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectInfo.title,
          text: `Gráfico ${projectInfo.code} - ${projectInfo.title} gerado no PixelCraft Studio`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to opening export
      }
    }
    // Fallback: trigger export or copy link
    onOpenExport();
  };

  return (
    <header className="shrink-0 z-30 w-full bg-slate-900/98 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2">
      <div className="flex items-center justify-between gap-2 h-10">
        {/* Brand Zone - Clean & Slim */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-sm shadow-emerald-500/20 shrink-0">
            <Grid className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xs font-bold tracking-tight text-white font-sans">
                PixelCraft
              </span>
              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded font-mono">
                STUDIO
              </span>
            </div>

            {/* Editable Project Code / Title */}
            {isEditingTitle ? (
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="text"
                  value={tempCode}
                  onChange={(e) => setTempCode(e.target.value)}
                  className="w-14 px-1 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono focus:outline-none"
                />
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="w-20 px-1 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-400 hover:text-emerald-300"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempTitle(projectInfo.title);
                  setTempCode(projectInfo.code);
                  setIsEditingTitle(true);
                }}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 truncate group mt-0.5 text-left"
                title="Toque para editar código ou título"
              >
                <span className="font-mono text-emerald-400/90">{projectInfo.code}</span>
                <span>·</span>
                <span className="truncate max-w-[130px]">{projectInfo.title}</span>
                <Edit3 className="w-2.5 h-2.5 opacity-30 group-hover:opacity-100 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action: Menu / Compartilhar / Exportar */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleShare}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-300 hover:text-white active:scale-95 rounded-xl transition-all hover:bg-slate-800"
            title="Compartilhar ou Exportar"
            aria-label="Compartilhar"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
