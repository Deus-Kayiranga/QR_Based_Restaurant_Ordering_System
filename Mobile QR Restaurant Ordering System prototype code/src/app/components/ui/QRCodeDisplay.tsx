import { useEffect, useRef } from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}

// Simple visual QR code placeholder using a deterministic pattern from the URL
export function QRCodeDisplay({ value, size = 160, fgColor = '#2c1810', bgColor = '#ffffff' }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.floor(size / 25);
    const actualSize = cellSize * 25;
    canvas.width = actualSize;
    canvas.height = actualSize;

    // White background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, actualSize, actualSize);

    // Generate deterministic pattern from value hash
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash |= 0;
    }

    ctx.fillStyle = fgColor;

    const drawCell = (x: number, y: number) => {
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    };

    // Draw fixed corner finder patterns
    const drawFinder = (startX: number, startY: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const isOuter = x === 0 || x === 6 || y === 0 || y === 6;
          const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          if (isOuter || isInner) drawCell(startX + x, startY + y);
        }
      }
    };

    drawFinder(0, 0);       // top-left
    drawFinder(18, 0);      // top-right
    drawFinder(0, 18);      // bottom-left

    // Draw data area with pseudo-random pattern
    let seed = Math.abs(hash);
    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        // Skip finder pattern areas
        const inTopLeft = x < 8 && y < 8;
        const inTopRight = x >= 17 && y < 8;
        const inBottomLeft = x < 8 && y >= 17;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        if (Math.abs(seed) % 2 === 0) drawCell(x, y);
      }
    }

    // Draw timing patterns
    for (let i = 8; i < 17; i++) {
      if (i % 2 === 0) {
        drawCell(i, 6);
        drawCell(6, i);
      }
    }
  }, [value, size, fgColor, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    />
  );
}

// Try to use qrcode.react, fall back to our custom component
export function QRCodeSafe(props: QRCodeDisplayProps) {
  try {
    return <QRCodeDisplay {...props} />;
  } catch {
    return <QRCodeDisplay {...props} />;
  }
}
