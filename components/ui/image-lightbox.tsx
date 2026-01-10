'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  maxWidth?: string;
  className?: string;
}

export function ImageLightbox({ src, alt, aspectRatio = 'aspect-video', maxWidth, className = '' }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleClose = () => {
    setIsOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === '+' || e.key === '=') setScale(prev => Math.min(prev + 0.5, 4));
      if (e.key === '-') setScale(prev => Math.max(prev - 0.5, 0.5));
      if (e.key === '0') {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.25 : 0.25;
        setScale(prev => Math.min(Math.max(prev + delta, 0.5), 4));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  return (
    <>
      {/* Thumbnail */}
      <div 
        className={`relative cursor-pointer group ${aspectRatio} ${maxWidth || ''} ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-800">
          <Image src={src} alt={alt} fill className="object-cover transition-transform group-hover:scale-105" />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 dark:bg-dark-800/90 rounded-full p-3 shadow-lg">
              <Maximize2 className="w-6 h-6 text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black flex flex-col"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Header mit Controls */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-black/80 border-b border-white/10">
            <div className="text-white font-medium">{alt}</div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleZoomOut} 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Verkleinern (-)"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              
              <div className="bg-white/10 rounded-lg px-3 py-2 min-w-[80px] text-center">
                <span className="text-white text-sm font-medium">{Math.round(scale * 100)}%</span>
              </div>
              
              <button 
                onClick={handleZoomIn} 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Vergrößern (+)"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>

              <button 
                onClick={handleReset} 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-2"
                title="Zurücksetzen (0)"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
              
              <button 
                onClick={handleClose} 
                className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors ml-2"
                title="Schließen (ESC)"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Bild Container - Volle Hoehe */}
          <div 
            ref={containerRef}
            className="flex-1 overflow-hidden flex items-center justify-center"
            style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          >
            <div 
              className="transition-transform duration-150"
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center'
              }}
            >
              <Image 
                src={src} 
                alt={alt} 
                width={1920} 
                height={1080} 
                className="max-w-none select-none"
                style={{
                  maxHeight: scale === 1 ? 'calc(100vh - 120px)' : 'none',
                  width: 'auto',
                  height: 'auto'
                }}
                priority 
                draggable={false}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-3 bg-black/80 border-t border-white/10">
            <div className="flex items-center justify-center gap-6 text-white/50 text-xs">
              <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">ESC</kbd> Schliessen</span>
              <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">+</kbd> / <kbd className="bg-white/10 px-1.5 py-0.5 rounded">-</kbd> Zoomen</span>
              <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">0</kbd> Zuruecksetzen</span>
              {scale > 1 && <span>Ziehen zum Verschieben</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
